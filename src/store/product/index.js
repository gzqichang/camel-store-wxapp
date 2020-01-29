import {
  _TYPES,
  PRODUCT_TYPES,
} from '../properties';


/**
 * PRODUCT REDUCER
 */


/**
 * Initial State
 */


export const initState = {
  banner: [],
  category: [],
  list: [],
  detail: {},
};


/**
 * Action Types
 */


export const types = {
  // 商品分类
  GET_CATEGORY_SERVICE: 'GET_CATEGORY_SERVICE',
  SET_CATEGORY: 'SET_CATEGORY',

  // 首页轮播
  GET_BANNER_SERVICE: 'GET_BANNER_SERVICE',
  SET_BANNER: 'SET_BANNER',

  // 商品详情
  GET_DETAIL_SERVICE: 'GET_DETAIL_SERVICE',
  SET_DETAIL: 'SET_DETAIL',

  // 商品列表
  GET_PRODUCT_LIST_SERVICE: 'GET_PRODUCT_LIST_SERVICE',
  SET_PRODUCT_LIST: 'SET_PRODUCT_LIST',
  CLEAR_PRODUCT_LIST: 'CLEAR_PRODUCT_LIST',

  // 海报
  GET_POSTER_SERVICE: 'GET_POSTER_SERVICE',
  SET_POSTER: 'SET_POSTER',
};


/**
 * Action Functions
 */


export const actions = {
  getCategoryService: (storeID) => ({
    type: types.GET_CATEGORY_SERVICE,
    storeID,
  }),

  getBannerService: (storeID) => ({
    type: types.GET_BANNER_SERVICE,
    storeID,
  }),

  getDetailService: ({
    url,
    callback,
  }) => ({
    type: types.GET_DETAIL_SERVICE,
    url,
    callback,
  }),

  getProductListService: ({
    storeID,
    category,
    next,
    callback,
  } = {}) => ({
    type: types.GET_PRODUCT_LIST_SERVICE,
    storeID,
    category,
    next,
    callback,
  }),

  clearProductList: () => ({
    type: types.CLEAR_PRODUCT_LIST,
  }),

  getPosterService: (url) => ({
    type: types.GET_POSTER_SERVICE,
    url,
  }),

  getGroupingProductListService: ({
    store,
    next,
    callback,
  }) => ({
    type: types.GET_PRODUCT_LIST_SERVICE,
    storeID: store,
    next,
    isGrouping: true,
    callback,
  }),

  getPeriodsProductListService: ({
    store,
    next,
    callback,
  }) => ({
    type: types.GET_PRODUCT_LIST_SERVICE,
    storeID: store,
    next,
    productType: PRODUCT_TYPES[_TYPES.subscription],
    callback,
  }),

  getCreditsProductListService: ({
    store,
    next,
    keyword,
    callback,
  }) => ({
    type: types.GET_PRODUCT_LIST_SERVICE,
    storeID: store,
    next,
    keyword,
    productType: PRODUCT_TYPES[_TYPES.credits],
    callback,
  }),

  getRecommendedProductListService: ({
    store,
    next,
    callback,
  }) => ({
    type: types.GET_PRODUCT_LIST_SERVICE,
    storeID: store,
    next,
    recommendation: true,
    callback,
  }),
};


/**
 * Reducer
 */


export const product = (state = initState, action) => {
  /* eslint-disable camelcase */
  switch (action.type) {
    case types.SET_CATEGORY:
      return Object.assign({}, state, {
        category: action.category,
      });

    case types.SET_BANNER:
      return Object.assign({}, state, {
        banner: action.banner,
      });

    case types.SET_DETAIL:
      return Object.assign({}, state, {
        detail: action.detail,
      });

    case types.SET_PRODUCT_LIST:
      let _ = [
        ...state.list,
        ...action.list,
      ];
      // If reload equals true then clear the previews data
      if (action.reload === true)
        _ = [...action.list];

      let dict = {};
      let indexing = [];
      _.map((item) => {
        const {id, model_type} = item;
        dict[model_type + id] = item;
        if (!indexing.includes(model_type + id))
          indexing.push(model_type + id);
      });
      let list = [];
      for (let keyName of indexing) {
        if (dict[keyName])
          list.push(dict[keyName]);
      }
      return Object.assign({}, state, {list});

    case types.CLEAR_PRODUCT_LIST:
      return Object.assign({}, state, {list: []});

    case types.SET_POSTER:
      return Object.assign({}, state, {
        detail: {
          ...state.detail,
          posterImage: action.url,
        },
      });

    default:
      return state;
  }
};
