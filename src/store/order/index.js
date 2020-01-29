import {storage} from '../../utils/index';


/**
 * ORDER REDUCER
 */


/**
 * Initial State
 */


export const initState = {
  sharedUser: null,
  sharedProduct: null,
  sharedGroup: null,
  count: {
    paying: 0, // 待付款
    serving: 0, // 服务中
    sending: 0, // 待发货
    receiving: 0, // 待收货
    over: 0, // 已完成
    close: 0, // 已关闭
  },
  orderList: [],
  cart: [],
  cartInfo: [],
  orderType: '',
  orderContent: [],
  expressInfo: {},
  detail: {},
  payInfo: {},
};


/**
 * Action Types
 */


export const types = {
  // 微信支付
  WECHAT_PAY_SERVICE: 'WECHAT_PAY_SERVICE',
  ORDER_CALL_URL_SERVICE: 'ORDER_CALL_URL_SERVICE',

  // payJs支付
  PAY_JS_SERVICE: 'PAY_JS_SERVICE',
  CHECK_PAY_SUCCESS: 'CHECK_PAY_SUCCESS',

  // 从已有订单发起拼团
  NEW_GROUPING_BY_ORDER_SERVICE: 'NEW_GROUPING_BY_ORDER_SERVICE',

  // 分享用户及对应商品
  SET_SHARED: 'SET_SHARED',
  SET_SHARED_GROUP: 'SET_SHARED_GROUP',

  // 用户订单
  NEW_ORDER_SERVICE: 'NEW_ORDER_SERVICE',
  NEW_QR_ORDER_SERVICE: 'NEW_QR_ORDER_SERVICE',
  UPDATE_ORDER_SERVICE: 'UPDATE_ORDER_SERVICE',
  GET_ORDER_SERVICE: 'GET_ORDER_SERVICE',
  SET_ORDER: 'SET_ORDER',
  GET_ORDER_COUNT_SERVICE: 'GET_ORDER_COUNT_SERVICE',
  SET_ORDER_COUNT: 'SET_ORDER_COUNT',
  GET_ORDER_DETAIL_SERVICE: 'GET_ORDER_DETAIL_SERVICE',
  SET_ORDER_DETAIL: 'SET_ORDER_DETAIL',

  // 购物车
  UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
  UPDATE_CART_INFO_SERVICE: 'UPDATE_CART_INFO_SERVICE',
  PURGE_UNAVAILABLE_CART_ITEM_SERVICE: 'PURGE_UNAVAILABLE_CART_ITEM_SERVICE',
  SET_CART: 'SET_CART',
  SET_CART_INFO: 'SET_CART_INFO',
  CLEAR_CART_ITEM: 'CLEAR_CART_ITEM',

  // 将东西放到确认订单中 内容格式同 cart
  SET_ORDER_CONTENT: 'SET_ORDER_CONTENT',

  // 物流信息
  GET_EXPRESS_INFO_SERVICE: 'GET_EXPRESS_INFO_SERVICE',
  SET_EXPRESS_INFO: 'SET_EXPRESS_INFO',
};


/**
 * Action Functions
 */


export const actions = {
  /* eslint-disable camelcase */
  wechatPayService: ({order_sn, other, callback}) => ({
    type: types.WECHAT_PAY_SERVICE,
    order_sn,
    other,
    callback,
  }),

  setPayJsInfo: ({data}) => ({
    type: types.PAY_JS_SERVICE,
    data,
  }),

  setShared: ({userID, productID}) => ({
    type: types.SET_SHARED,
    userID,
    productID,
  }),

  setSharedGroup: ({group}) => ({
    type: types.SET_SHARED_GROUP,
    sharedGroup: group,
  }),

  newOrderService: ({orderType, data}) => ({
    type: types.NEW_ORDER_SERVICE,
    orderType,
    data,
  }),

  newQROrderService: ({data}) => ({
    type: types.NEW_QR_ORDER_SERVICE,
    data,
  }),

  getOrderService: ({orderType, next, reload} = {}) => ({
    type: types.GET_ORDER_SERVICE,
    orderType,
    next,
    reload,
  }),

  getOrderCountService: () => ({
    type: types.GET_ORDER_COUNT_SERVICE,
  }),

  orderCallUrlService: ({url, orderType, callback}) => ({
    type: types.ORDER_CALL_URL_SERVICE,
    url,
    orderType,
    callback,
  }),

  updateCartItem: (data) => ({
    type: types.UPDATE_CART_ITEM,
    data,
  }),

  updateCartInfoService: ({orderType, cart, address}) => ({
    type: types.UPDATE_CART_INFO_SERVICE,
    orderType,
    cart,
    address,
  }),

  purgeUnavailableCartItemService: ({cart}) => ({
    type: types.PURGE_UNAVAILABLE_CART_ITEM_SERVICE,
    payload: {cart},
  }),

  setOrderContent: ({orderContent, orderType}) => ({
    type: types.SET_ORDER_CONTENT,
    orderType,
    orderContent,
  }),

  clearCartItem: () => ({
    type: types.CLEAR_CART_ITEM,
  }),

  getExpressInfoService: (uri) => ({
    type: types.GET_EXPRESS_INFO_SERVICE,
    uri,
  }),

  getOrderDetailService: ({uri, overlay, isGroupOwner, callback}) => ({
    type: types.GET_ORDER_DETAIL_SERVICE,
    uri,
    overlay,
    isGroupOwner,
    callback,
  }),

  newGroupingByOrderService: ({order, back}) => ({
    type: types.NEW_GROUPING_BY_ORDER_SERVICE,
    order,
    back,
  }),
};


/**
 * Reducer
 */


export const order = (state = initState, action) => {
  switch (action.type) {
    case types.SET_SHARED:
      return Object.assign({}, state, {
        sharedUser: action.userID,
        sharedProduct: action.productID,
      });

    case types.PAY_JS_SERVICE:
      return Object.assign({}, state, {
        payInfo: action.data,
      });

    case types.SET_SHARED_GROUP:
      return Object.assign({}, state, {
        sharedGroup: action.sharedGroup,
      });

    case types.SET_ORDER:
      if (
        action.list.length <= 0
        && action.reload !== true
      ) return state;

      let dict = {};
      let indexing = [];

      // If reload equals true then clear the previews data
      if (action.reload !== true)
        state.orderList.map((item) => {
          const {id, _model, _groupInfo} = item;
          const {ptgroup_no} = _groupInfo || {ptgroup_no: 0};
          const _key = _model + id + ptgroup_no;
          dict[_key] = item;
          if (!indexing.includes(_key))
            indexing.push(_key);
        });

      Array.from(action.list).map(
        (item) => {
          const {id, _model, _groupInfo} = item;
          const {ptgroup_no} = _groupInfo || {ptgroup_no: 0};
          const _key = _model + id + ptgroup_no;

          dict[_key] = item;
          if (!indexing.includes(_key))
            indexing.push(_key);
        }
      );

      let orderList = [];
      for (let keyName of indexing) {
        if (dict[keyName])
          orderList.push(dict[keyName]);
      }

      return Object.assign({}, state, {orderList});

    case types.SET_ORDER_COUNT:
      return Object.assign({}, state, {
        count: {
          ...state.count,
          ...action.count,
        },
      });

    case types.UPDATE_CART_ITEM:
      const {data: {product, type, count, url, customizedData, attach}} = action;
      let cart = [...state.cart];
      // Find if item in Cart
      const isItemInCart = cart.find(
        (item) => (
          item.product
          && item.type
          && item.product === product
          && item.type === type
        )
      );
      // If it is not - add it in
      if (!isItemInCart)
        cart = [
          ...cart,
          {
            product,
            type,
            count,
            url,
            hash: `${product}${type}`,
            customizedData,
            attach,
          },
        ];
      // otherwise update the existing item
      else
        cart = cart.filter(
          (item) => {
            if (
              item.product
              && item.type
              && item.product === product
              && item.type === type
            ) {
              item.count += count;
              item.attach = attach;
              item.customizedData = customizedData;
            }
            return item.count > 0;
          }
        );
      // Persistence
      storage().setStorageSync('cart', cart);
      return Object.assign({}, state, {cart});

    case types.SET_CART:
      // Persistence
      storage().setStorageSync('cart', action.payload.cart);
      return Object.assign({}, state, {
        cart: action.payload.cart,
      });

    case types.SET_CART_INFO:
      return Object.assign({}, state, {
        cartInfo: action.cartInfo,
      });

    case types.SET_ORDER_CONTENT:
      return Object.assign({}, state, {
        orderType: action.orderType,
        orderContent: action.orderContent,
      });

    case types.CLEAR_CART_ITEM:
      return Object.assign({}, state, {cart: []});

    case types.SET_EXPRESS_INFO:
      return Object.assign({}, state, {
        expressInfo: action.expressInfo,
      });

    case types.SET_ORDER_DETAIL:
      return Object.assign({}, state, {
        detail: action.detail,
      });

    default:
      return state;
  }
};
