import wepy from 'wepy';
import md5 from '../../utils/md5.min';
import {effects} from 'redux-saga';

import {types} from './index';
import {types as otherTypes} from '../others';
import {types as timerTypes} from '../timer';
import {types as configTypes} from '../config';
import {
  calculateGroupDescriptions,
  calculateEstimateDeliveryTime,
} from './helper';
import {
  loading,
  go2page,
  showToast,
  showModal,
  parseTime,
} from '../../utils';
import {
  orderNew,
  orderQRNew,
  orderUpdate,
  orderWechatPay,
  orderGetList,
  orderCallURL,
  orderValidateCart,
  orderGetExpressInfo,
  orderGetDetail,
  orderNewGroup,
  orderGetStatistics,
  payjsConfig,
} from '../../service';
import {
  DELIVERY_INFO,
  DELIVERY_TYPES,
  _TYPES,
  ORDER_TYPES,
  ORDER_FIELD_NAMES,
  ORDER_STATUS_INFO,
} from '../properties';
import {storage} from '../../utils/index';

const {call, put, takeEvery, select} = effects;


/* eslint-disable camelcase, no-fallthrough */
export const newOrder = function* (action = {}) {
  loading().show('处理中');

  const {orderType, data} = action;

  const res = yield call(orderNew, {
    data,
    type: orderType,
  });

  const {groupbuy} = data;
  const {order_sn, url, is_pt, real_amount} = res || {};

  const callback = (isSuccess) => {
    setTimeout(() => {
      go2page()
        .redirect('/pages/me/myOrders');

      if (is_pt && isSuccess === true)
        go2page()
          .navigate(`/pages/all/groupBuyingDetail?isGroupOwner=${(is_pt && !groupbuy)}&uri=${url}`);
    }, 1000);
  };

  loading().hide();

  if (!order_sn)
    return showModal({
      title: '下单失败',
      content: String(res),
    });

  if (!(real_amount * 1))
    return callback && callback(true);
  else
    return yield call(wechatPay, {
      order_sn,
      other: {url, is_pt, real_amount},
      callback,
    });
};


export const newQROrder = function* (action = {}) {
  loading().show('处理中');

  const {data} = action;

  const res = yield call(orderQRNew, {data});

  const {order_sn} = res || {};

  const callback = () => {
    setTimeout(() => {
      go2page()
        .redirect('/pages/me/myOrders?checkStore=true');
    }, 1000);
  };

  loading().hide();

  if (!order_sn)
    return showModal({
      title: '下单失败',
      content: String(res),
    });

  yield put({
    type: configTypes.SET_CONFIG,
    payload: {machineCode: ''},
  });

  return yield call(wechatPay, {
    order_sn,
    callback,
  });
};


export const getOrder = function* (action = {}) {
  loading().show('加载中');

  const {orderType, next, reload} = action;

  const res = yield call(orderGetList, {orderType, next});

  loading().hide();

  let tasks = [];
  let flatenList = [];

  let modelNames = {};
  Object
    .entries(ORDER_TYPES)
    .map(([key, value]) => {
      modelNames[value] = key;
    });

  if (res && res.results) {
    Array
      .from(res.results)
      .map(
        (item) => {
          let boughtPrice = 0; // 原价
          let boughtCount = 0; // 买了多少件

          if (item.goods_backup && item.goods_backup[0]) {
            const {
              num,
              original_price,
            } = item.goods_backup[0];

            boughtPrice = parseFloat(original_price);
            boughtCount = parseInt(num);
          }

          if (!(item.groupbuy && item.groupbuy.length)) {
            flatenList.push({
              ...item,
              _groupInfo: {},
            });
          } else {
            Array.from(item.groupbuy).map(
              (groupItem) => {
                const {
                  is_owner,
                  ladder,
                  price_ladder,
                  mode,
                  integral,
                  partake_count,
                  goods_count,
                  ptgroup_no,
                  end_time,
                  status,
                } = groupItem;

                let _groupInfo = {...groupItem};

                // 注册定时器
                tasks.push({
                  id: ptgroup_no,
                  time: end_time,
                });

                if (Object.keys(groupItem).length) {
                  let _groupType = '';

                  if (ladder[0])
                    _groupType += ladder[0].num || '';

                  if (mode)
                    _groupType += mode === 'people' ? ' 人团' : ' 件团';

                  const {
                    _currentState,
                    _leastCount,
                  } = calculateGroupDescriptions({
                    boughtPrice,     // 原价
                    boughtCount,     // 买了多少件
                    is_owner,        // 是否团长
                    ladder,          // 阶梯
                    price_ladder,    // 阶梯价格
                    mode,            // 拼团模式
                    integral,        // 积分
                    partake_count,   // 已参加人数
                    goods_count,     // 已买总件数
                  });

                  _groupInfo._currentState = _currentState;
                  _groupInfo._leastCount = _leastCount;
                  _groupInfo._groupType = _groupType;
                }

                if (status === 'build')
                  flatenList.push({
                    ...item,
                    _groupInfo,
                  });
              }
            );
          }
        });

    yield put({
      type: timerTypes.REGISTER_TICKING,
      tasks,
    });

    const list = flatenList.map(
      (item) => {
        const {
          model_type,
          items,
          goods_backup,
          order_amount,
          postage_total,
          completion,
          add_time,
          pay_time,
          status,
          next_send,
          shop_info,
          entrust_shop_info,
        } = item;

        const _model = modelNames[model_type];

        let _items = [];

        switch (_model) {
          case _TYPES.regular:
          case _TYPES.credits:
            _items = items;
            break;

          case _TYPES.subscription:
            if (items.length) {
              if (items[completion])
                _items = [{...items[completion]}];
              else
                _items = items[0] ? [{...items[0]}] : [];
            } else {
              _items = [{
                goods_backup: goods_backup[0],
              }];
            }
            break;

          default:
        }

        let _count = 0;
        let _allPeriod = 0;
        let _confirm = '';
        let _expressTrack = '';

        const _payTime = pay_time ? parseTime(new Date(pay_time)) : '';

        const _shopInfo = entrust_shop_info || shop_info;

        const _order_amount = (order_amount * 1 + postage_total * 1).toFixed(2);

        if (items.length)
          _allPeriod = items.length;

        _items = _items.map(
          (i) => {
            const {
              goods_backup = {},
              logistics,
              confirm,
              send_date,
              send_time,
              receive_time,
            } = i;
            const {
              num,
              delivery_method,
            } = goods_backup;

            const _info = goods_backup[ORDER_FIELD_NAMES[_model]] || {};

            let _sendDate = '';

            switch (_model) {
              case _TYPES.regular:
              case _TYPES.credits:
                if (_info) {
                  const {estimate_time} = _info;
                  if (estimate_time)
                    _sendDate = calculateEstimateDeliveryTime({
                      add_time,       // 订单添加时间,
                      estimate_time,  // 后台配置的时间
                    });
                }
                break;

              case _TYPES.subscription:
                const {
                  start_send_date,
                  send_start_time,
                  send_end_time,
                  cycle_num,
                } = _info;

                if (!_allPeriod && cycle_num)
                  _allPeriod = cycle_num;

                if (status === 'paying') {
                  if (start_send_date)
                    _sendDate += start_send_date;

                  if (send_start_time && send_end_time)
                    _sendDate += [
                      ' ',
                      (send_start_time || '').slice(0, 5),
                      '-',
                      (send_end_time || '').slice(0, 5),
                    ].join('');
                } else {
                  if (send_date)
                    _sendDate += send_date;

                  if (send_start_time && send_end_time)
                    _sendDate += [
                      ' ',
                      (send_start_time || '').slice(0, 5),
                      '-',
                      (send_end_time || '').slice(0, 5),
                    ].join('');
                }
                break;

              default:
            }

            const _delivery = DELIVERY_INFO[delivery_method] || '';

            if (num)
              _count += num;

            if (logistics)
              _expressTrack = logistics;

            if (confirm)
              _confirm = confirm;

            const _sendTime = send_time ? parseTime(new Date(send_time)) : '';

            const _receiveTime = receive_time ? parseTime(new Date(receive_time)) : '';

            const _nextTime = next_send ? parseTime(new Date(next_send)) : '';

            return {
              ...i,
              _info,
              _sendDate,
              _delivery,
              _sendTime,
              _nextTime,
              _receiveTime,
            };
          }
        );

        return {
          ...item,
          _items,
          _count,
          _model,
          _confirm,
          _payTime,
          _expressTrack,
          _allPeriod,
          _shopInfo,
          order_amount: _order_amount,
        };
      },
    );

    yield put({
      type: types.SET_ORDER,
      list,
      reload,
    });

    yield put({
      type: otherTypes.UPDATE_NEXT_URL,
      url: res.next || '',
      key: orderType
        ? `orderList_${orderType}`
        : 'orderList',
    });
  }
};


export const getOrderCount = function* () {
  const res = yield call(orderGetStatistics);

  if (res)
    yield put({
      type: types.SET_ORDER_COUNT,
      count: {...res},
    });
};


export const updateOrder = function* (action = {}) {
  const {data: {_url, ...data}} = action;

  loading().show('处理中');

  yield call(orderUpdate, _url, data);

  yield put({type: types.GET_ORDER_SERVICE});

  loading().hide();
};


export const orderCallUrl = function* (action = {}) {
  const {
    url,
    orderType = '',
    callback,
  } = action;

  loading().show('处理中');

  yield call(orderCallURL, url);

  yield put({
    type: types.GET_ORDER_SERVICE,
    orderType: 'paying',
    reload: true,
  });

  yield put({
    type: types.GET_ORDER_SERVICE,
    orderType,
    reload: true,
  });

  loading().hide();

  callback && callback();
};


export const wechatPay = function* (action = {}) {
  const {order_sn, other, callback} = action;
  loading().show('支付中');
  const enablePayJs = yield select(state => state.config.enablePayJs);
  if (other) {
    const {url, is_pt, real_amount} = other;
    if (enablePayJs && !is_pt) {
      const msg = yield call(payjsConfig);
      if (msg && msg.switch) {
        const {system} = yield wepy.getSystemInfoSync();
        if (system.includes('iOS')) {
          loading().hide();
          showModal({
            title: '支付失败',
            content: '不支持iOS端支付',
            success: () => {
              callback && callback();
            },
          });
          return;
        }
        let extraData = {
          mchid: msg.mchid,
          total_fee: Math.ceil(real_amount * 100),
          notify_url: msg.notify_url,
          out_trade_no: order_sn,
          attach: 'buyOrder',
          body: url,
          nonce: new Date().getTime().toString(),
        };
        const keys = Object.keys(extraData).sort().map(x => `${x}=${extraData[x]}`).join('&');
        const sign = md5(keys + '&key=' + msg.key).toUpperCase();
        loading().hide();
        wepy.navigateToMiniProgram({
          appId: 'wx959c8c1fb2d877b5',
          path: 'pages/pay',
          extraData: {
            ...extraData,
            sign,
          },
          success: () => {
            storage().setStorageSync('payJs', true);
            console.log('等待返回支付结果');
          },
          fail: () => {
            showToast('支付跳转失败');
            const pages = getCurrentPages();
            const {route} = pages[pages.length - 1];
            !route.toLowerCase().includes('detail') && go2page().redirect('/pages/me/myOrders?aid=paying');
          },
        });
        return;
      }
    }
  }

  const {status, info} = yield call(orderWechatPay, {order_sn});
  loading().hide();
  let message = '商品状态异常，无法支付';

  if (!info.nonceStr) {
    showToast('支付成功');
    return callback && callback(true);
  }

  switch (status) {
    case 200:
      return wepy.requestPayment({
        ...info,
        success: () => {
          showToast('支付成功');
          callback && callback(true);
        },
        fail: () => {
          showToast('支付失败');
          callback && callback();
        },
      });

    case 404:
      message = '该商品已下架，下次趁早啦';

    case 400:
      message = '该商品属性已经变更，请重新下单';

    default:
      return showModal({
        title: '出错了',
        content: message,
      });
  }
};

export const updateCartInfo = function* (action = {}) {
  const {
    orderType,
    cart,
    address = null,
  } = action;

  if (!cart.length)
    return yield put({
      type: types.SET_CART_INFO,
      cartInfo: [],
    });

  loading().show();

  const is_pt = (cart[0] && cart[0].is_pt) || false;

  // 普通商品
  if (orderType === _TYPES.regular) {
    const payload = cart.map(
      (item) => ({
        goodsid: item.product,
        gtypeid: item.type,
      })
    );

    const res = yield call(
      orderValidateCart, {
        type: orderType,
        data: {
          items_list: payload,
          address,
          is_pt,
        },
      });

    if (res) {
      const _res = res.map((item) => {
        const {delivery_method} = item;
        let _shipping = delivery_method
          .map((item) => (DELIVERY_TYPES[item]))
          .filter((item) => (item));
        return {...item, _shipping};
      });
      yield put({
        type: types.SET_CART_INFO,
        cartInfo: _res,
      });
    }
  }

  // 订阅商品
  if (orderType === _TYPES.subscription) {
    const res = yield call(
      orderValidateCart, {
        type: orderType,
        data: {
          goodsid: cart[0].product || '',
          gtypeid: cart[0].type || '',
          address,
          is_pt,
        },
      });

    if (res) {
      // Copy - Paste
      const _res = [res].map((item) => {
        const {delivery_method} = item;
        let _shipping = delivery_method
          .map((item) => (DELIVERY_TYPES[item]))
          .filter((item) => (item));
        return {...item, _shipping};
      });
      yield put({
        type: types.SET_CART_INFO,
        cartInfo: _res,
      });
    }
  }

  // 积分商品
  if (orderType === _TYPES.credits) {
    const res = yield call(
      orderValidateCart, {
        type: orderType,
        data: {
          goodsid: cart[0].product || '',
          gtypeid: cart[0].type || '',
        },
      });

    if (res) {
      // Copy - Paste
      const _res = [res].map((item) => {
        const {delivery_method} = item;
        let _shipping = delivery_method
          .map((item) => (DELIVERY_TYPES[item]))
          .filter((item) => (item));
        return {...item, _shipping};
      });
      yield put({
        type: types.SET_CART_INFO,
        cartInfo: _res,
      });
    }
  }

  loading().hide();
};


export const purgeUnavailableCartItems = function* (action = {}) {
  const {payload: {cart}} = action;

  if (!cart.length) return;

  const items = cart.map(
    (item) => ({
      goodsid: item.product,
      gtypeid: item.type,
    })
  );

  const res = yield call(
    orderValidateCart, {
      type: _TYPES.regular,
      data: {
        items_list: items,
        address: null,
        is_pt: false,
      },
    });

  if (res) {
    const availables = Array
      .from(res)
      .map(({goodid, gtypeid}) => (`${goodid}${gtypeid}`));

    const newCart = Array
      .from(cart)
      .filter(({hash}) => (availables.includes(hash)));

    yield put({
      type: types.SET_CART,
      payload: {
        cart: newCart,
      },
    });
  }
};


export const getExpressInfo = function* (action) {
  const {uri} = action;

  loading().show();

  yield put({
    type: types.SET_EXPRESS_INFO,
    expressInfo: {},
  });

  const res = yield call(orderGetExpressInfo, uri);

  loading().hide();

  if (res && !res.status) return showToast(res);

  yield put({
    type: types.SET_EXPRESS_INFO,
    expressInfo: res,
  });
};


export const getDetail = function* (action = {}) {
  const {uri, overlay, isGroupOwner, callback} = action;

  loading().show('加载中');

  if (overlay !== true)
    yield put({
      type: types.SET_ORDER_DETAIL,
      detail: {},
    });

  const res = yield call(orderGetDetail, uri);

  let modelNames = {};
  Object
    .entries(ORDER_TYPES)
    .map(([key, value]) => {
      modelNames[value] = key;
    });

  if (res) {
    const {
      model_type,
      items,
      goods_backup,
      order_amount,
      postage_total,
      completion,
      add_time,
      pay_time,
      status,
      next_send,
      groupbuy,
      shop_info,
      entrust_shop_info,
    } = res;

    const _model = modelNames[model_type];

    const _statusInfo = ORDER_STATUS_INFO[status];

    const _createTime = add_time ? parseTime(new Date(add_time)) : '';

    const _payTime = pay_time ? parseTime(new Date(pay_time)) : '';

    let _items = [];

    switch (_model) {
      case _TYPES.regular:
      case _TYPES.credits:
        _items = items;
        break;

      case _TYPES.subscription:
        if (items.length) {
          if (items[completion])
            _items = [{...items[completion]}];
          else
            _items = items[0] ? [{...items[0]}] : [];
        } else {
          _items = [{goods_backup: goods_backup[0]}];
        }
        break;

      default:
    }

    let _count = 0;
    let _allPeriod = 0;
    let _confirm = '';
    let _expressTrack = '';
    let _groupInfo = {};

    if (items.length)
      _allPeriod = items.length;

    _items = _items.map(
      (i) => {
        const {
          send_time,
          send_date,
          receive_time,
          goods_backup = {},
          logistics,
          confirm,
        } = i;
        const {
          num,
          attach,
          delivery_method,
        } = goods_backup;

        const _info = goods_backup[ORDER_FIELD_NAMES[_model]] || {};

        let _sendDate = '';

        switch (_model) {
          case _TYPES.regular:
          case _TYPES.credits:
            if (_info) {
              const {estimate_time} = _info;
              if (estimate_time)
                _sendDate = calculateEstimateDeliveryTime({
                  estimate_time,  // 后台配置的时间
                  add_time,       // 订单添加时间
                });
            }
            break;

          case _TYPES.subscription:
            const {
              start_send_date,
              send_start_time,
              send_end_time,
              cycle_num,
            } = _info;

            if (!_allPeriod && cycle_num)
              _allPeriod = cycle_num;

            if (send_date || start_send_date)
              _sendDate += (send_date || start_send_date);
            if (send_start_time && send_end_time)
              _sendDate += [
                ' ',
                (send_start_time || '').slice(0, 5),
                '-',
                (send_end_time || '').slice(0, 5),
              ].join('');
            break;

          default:
        }

        const _delivery = DELIVERY_INFO[delivery_method] || '';

        if (num)
          _count += num;

        if (logistics)
          _expressTrack = logistics;

        if (confirm)
          _confirm = confirm;

        const _sendTime = send_time ? parseTime(new Date(send_time)) : '';

        const _receiveTime = receive_time ? parseTime(new Date(receive_time)) : '';

        const _nextTime = next_send ? parseTime(new Date(next_send)) : '';

        const _customizedFields = attach ? JSON.parse(attach) : [];

        return {
          ...i,
          _info,
          _sendDate,
          _sendTime,
          _nextTime,
          _receiveTime,
          _delivery,
          _customizedFields,
        };
      }
    );

    if (groupbuy) {
      _groupInfo = Array
        .from(groupbuy)
        .find(({status, is_owner}) => (
          status === 'build' && is_owner === isGroupOwner
        )) || {};

      if (Object.keys(_groupInfo).length) {
        const {
          is_owner,
          ladder,
          price_ladder,
          mode,
          integral,
          partake_count,
          goods_count,
        } = _groupInfo;

        let boughtPrice = 0; // 原价
        let boughtCount = 0; // 买了多少件

        if (goods_backup && goods_backup[0]) {
          const {
            num,
            original_price,
          } = goods_backup[0];

          boughtPrice = parseFloat(original_price);
          boughtCount = parseInt(num);
        }

        let _groupType = '';

        if (ladder[0])
          _groupType += ladder[0].num || '';

        if (mode)
          _groupType += mode === 'people' ? ' 人团' : ' 件团';

        const {
          _currentState,
          _leastCount,
        } = calculateGroupDescriptions({
          boughtPrice,     // 原价
          boughtCount,     // 买了多少件
          is_owner,        // 是否团长
          ladder,          // 阶梯
          price_ladder,    // 阶梯价格
          mode,            // 拼团模式
          integral,        // 积分
          partake_count,   // 已参加人数
          goods_count,     // 已买总件数
        });

        _groupInfo._currentState = _currentState;
        _groupInfo._leastCount = _leastCount;
        _groupInfo._groupType = _groupType;
      }
    }

    const {send_time, receive_time} = res;

    const _sendTime = send_time ? parseTime(new Date(send_time)) : '';

    const _receiveTime = receive_time ? parseTime(new Date(receive_time)) : '';

    const _shopInfo = entrust_shop_info || shop_info;

    const _order_amount = (order_amount * 1 + postage_total * 1).toFixed(2);

    const detail = {
      ...res,
      _items,
      _count,
      _model,
      _payTime,
      _createTime,
      _statusInfo,
      _allPeriod,
      _confirm,
      _groupInfo,
      _expressTrack,
      _sendTime,
      _receiveTime,
      _shopInfo,
      order_amount: _order_amount,
    };

    yield put({
      type: types.SET_ORDER_DETAIL,
      detail,
    });
  }

  loading().hide();
  callback && callback();
};


export const newGroupingByOrder = function* (action = {}) {
  loading().show('准备中');

  const {order, back} = action;

  const {ptgroup_no} = yield call(orderNewGroup, {order});

  loading().hide();

  loading().show();

  yield put({
    type: otherTypes.SET_NEW_GROUP,
    newGroup: ptgroup_no,
  });

  go2page().back(back);

  loading().hide();
};


export const orderWatcher = function* () {
  yield takeEvery(types.NEW_ORDER_SERVICE, newOrder);
  yield takeEvery(types.NEW_QR_ORDER_SERVICE, newQROrder);
  yield takeEvery(types.WECHAT_PAY_SERVICE, wechatPay);
  yield takeEvery(types.GET_ORDER_SERVICE, getOrder);
  yield takeEvery(types.UPDATE_ORDER_SERVICE, updateOrder);
  yield takeEvery(types.GET_ORDER_COUNT_SERVICE, getOrderCount);
  yield takeEvery(types.ORDER_CALL_URL_SERVICE, orderCallUrl);
  yield takeEvery(types.UPDATE_CART_INFO_SERVICE, updateCartInfo);
  yield takeEvery(types.PURGE_UNAVAILABLE_CART_ITEM_SERVICE, purgeUnavailableCartItems);
  yield takeEvery(types.GET_EXPRESS_INFO_SERVICE, getExpressInfo);
  yield takeEvery(types.GET_ORDER_DETAIL_SERVICE, getDetail);
  yield takeEvery(types.NEW_GROUPING_BY_ORDER_SERVICE, newGroupingByOrder);
};
