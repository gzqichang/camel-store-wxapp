import {effects} from 'redux-saga';

import {types} from './index';
import {types as otherTypes} from '../others';
import {types as timerTypes} from '../timer';
import {productListParser, productCreditParser} from './helper';
import {
  loading,
  showToast,
  unPackImageField,
  parse2Float,
} from '../../utils';
import {
  productGetCategory,
  productGetBanner,
  productGetDetail,
  productGetList,
  productGetPoster,
  productGetGroupsInfo,
} from '../../service';
import {
  PRODUCT_TYPES,
  DELIVERY_TYPES,
  PRODUCT_FIELD_NAMES,
  CUSTOMIZED_FIELDS_MAPPING,
} from '../properties';


const {call, put, select, takeEvery, takeLatest} = effects;


/* eslint-disable camelcase */
export const getCategory = function* (action = {}) {
  const {storeID} = action;

  // loading().show('加载中');

  const res = yield call(productGetCategory, storeID);

  let category = [];

  if (res && res.results)
    category = unPackImageField(res.results);

  yield put({
    type: types.SET_CATEGORY,
    category,
  });

  // loading().hide();
};


export const getBanner = function* (action = {}) {
  const {storeID} = action;

  loading().show('加载中');

  const res = yield call(productGetBanner, storeID);

  let banner = [];

  if (res && res.results)
    banner = unPackImageField(res.results);

  yield put({
    type: types.SET_BANNER,
    banner,
  });

  loading().hide();
};


export const getDetail = function* (action = {}) {
  const {url, callback} = action;

  loading().show('加载中');

  yield put({
    type: types.SET_DETAIL,
    detail: {},
  });

  const res = unPackImageField(
    yield call(productGetDetail, url));

  let detail = {};

  let modelNames = {};
  Object
    .entries(PRODUCT_TYPES)
    .map(([key, value]) => {
      modelNames[value] = key;
    });

  if (res) {
    const {
      id,
      attach,
      model_type,
      groupbuy,
      groupbuy_info,
      delivery_method,
      status,
    } = res;

    const _model = modelNames[model_type];
    const _product = res[PRODUCT_FIELD_NAMES[_model]];
    const _grouping = groupbuy === true;

    let _priceOrg = 0;
    let _priceMin = 0;
    let _groupType = '';
    let _groupsInfo = [];
    let _groupsRules = [];
    let _customizedFields = [];
    let _status = null;
    let _credit_price_range = null;

    if (_grouping) {
      if (_product && _product.gtypes) {
        _product.gtypes = Array.from(_product.gtypes).map(
          (item) => {
            const {ladder_list} = item;
            let _minimumPricing = 0;
            let groupPrice = 0;

            if (ladder_list) {
              const {price} = Array
                .from(ladder_list)
                .find((x) => (x.index === 1)) || {};

              if (price)
                _minimumPricing = price;

              if (ladder_list.length) {
                const {price} = ladder_list[0];
                groupPrice = price.toFixed(2);
              }
            }

            _minimumPricing = parse2Float(_minimumPricing);

            return {...item, _minimumPricing, groupPrice};
          }
        );

        Array.from(_product.gtypes).map(
          ({price, _minimumPricing}) => {
            const p = parseFloat(price);
            const m = parseFloat(_minimumPricing);

            _priceOrg = (_priceOrg === 0 || p < _priceOrg) ? p : _priceOrg;
            _priceMin = (_priceMin === 0 || m < _priceMin) ? m : _priceMin;
          }
        );

        _priceOrg = parse2Float(_priceOrg);
        _priceMin = parse2Float(_priceMin);
      }

      if (
        _product
        && _product.gtypes
        && groupbuy_info
        && groupbuy_info.ladder_list
      ) {
        Array
          .from(groupbuy_info.ladder_list)
          .map(
            ({index, num}) => {
              _groupsRules[index] = {
                count: num,
                refunds: 0,
              };
            }
          );

        Array
          .from(_product.gtypes)
          .map(
            ({ladder_list}) => {
              Array
                .from(ladder_list)
                .map(
                  ({index, price}) => {
                    const difference = Math.abs(
                      ((ladder_list[0].price * 1000) - (price * 1000)) / 1000
                    ) || 0;

                    if (difference > _groupsRules[index].refunds)
                      _groupsRules[index].refunds = difference;
                  });
            });

        _groupsRules = _groupsRules.filter((x) => (x !== null));
      }

      if (groupbuy_info) {
        const {ladder_list, mode} = groupbuy_info;

        if (ladder_list[0])
          _groupType += ladder_list[0].num || '';

        if (mode)
          _groupType += mode === 'people' ? ' 人团' : ' 件团';
      }

      const groups = yield call(productGetGroupsInfo, id);

      if (groups && groups.results)
        _groupsInfo = Array
          .from(groups.results)
          .filter(({can_join}) => (can_join));

      let tasks = [];

      // 注册定时器
      _groupsInfo.map(
        ({ptgroup_no, end_time}) => {
          tasks.push({
            id: ptgroup_no,
            time: end_time,
          });
        }
      );

      yield put({
        type: timerTypes.REGISTER_TICKING,
        tasks,
      });
    }

    if (attach && attach.length) {
      _customizedFields = Array
        .from(attach)
        .map(
          (item) => {
            let _ = {};
            Object.keys(item).map(
              (i) => {
                if (CUSTOMIZED_FIELDS_MAPPING[i])
                  _[CUSTOMIZED_FIELDS_MAPPING[i]] = item[i];
              }
            );
            return _;
          });

      _customizedFields = _customizedFields
        .sort((a, b) => (a.index > b.index ? 1 : 0));
    }

    let _shipping = delivery_method
      .map((item) => (DELIVERY_TYPES[item]))
      .filter((item) => (item));

    const userTest = yield select(state => state.user.testers) || false;

    const status_hint = {
      'not_enough': '商品库存不足，商家正在拼命补货',
      'not_sell': '该商品已下架',
      'preview': '该商品已下架',
    };

    _status = status === 'preview' && userTest
      ? null
      : status_hint[status] || null;

    if (_model === 'credits') {
      const {_sellPrice, _credit} = productCreditParser(_product.gtypes);
      _credit_price_range = `${_credit}积分 + ¥${_sellPrice}`;
    }

    detail = {
      ...res,
      _model,
      _status,
      _shipping,
      _product,
      _grouping,
      _priceOrg,
      _priceMin,
      _credit_price_range,
      _groupType,
      _groupsInfo,
      _groupsRules,
      _customizedFields,
    };
  }
  else {
    loading().hide();
    showToast('商品已失效');
    return;
  }

  yield put({
    type: types.SET_DETAIL,
    detail,
  });

  loading().hide();

  callback && callback();
};


export const getProductList = function* (action = {}) {
  const {
    storeID,
    category,
    next,
    isGrouping = '',
    keyword = '',
    productType = '',
    recommendation = '',
    callback,
    withloading = true,
  } = action;

  if (withloading)
    loading().show('加载中');

  const res = unPackImageField(
    yield call(productGetList, {
      store: storeID,
      isGrouping,
      productType,
      category,
      keyword,
      recommendation,
      next,
    }));

  let list = [];

  if (res && res.results) {
    list = productListParser(res.results);

    yield put({
      type: types.SET_PRODUCT_LIST,
      list,
      reload: !next,
    });

    yield put({
      type: otherTypes.UPDATE_NEXT_URL,
      url: res.next || '',
      key: category
        ? `productList_${category}`
        : 'productList',
    });
  }

  callback && callback();

  if (withloading)
    loading().hide();
};


export const getPoster = function* (action = {}) {
  loading().show('加载中');

  const {url} = action;

  const res = yield call(productGetPoster, url);

  loading().hide();

  if (res && res.statusCode === 200) {
    const {tempFilePath} = res;

    yield put({
      type: types.SET_POSTER,
      url: tempFilePath,
    });
  } else {
    showToast('加载失败');
  }
};


export const productWatcher = function* () {
  yield takeEvery(types.GET_CATEGORY_SERVICE, getCategory);
  yield takeEvery(types.GET_BANNER_SERVICE, getBanner);
  yield takeEvery(types.GET_DETAIL_SERVICE, getDetail);
  yield takeLatest(types.GET_PRODUCT_LIST_SERVICE, getProductList);
  yield takeEvery(types.GET_POSTER_SERVICE, getPoster);
};
