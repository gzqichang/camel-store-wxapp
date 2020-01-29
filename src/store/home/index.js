/**
 * HOME REDUCER
 */


/**
 * Initial State
 */


export const initState = {
  grouping: [],
  periods: [],
  recommended: [],
  credits: [],
  carousel: [],
  shortcut: [],
  modules: {},
};


/**
 * Action Types
 */


export const types = {
  // 拼团版块
  GET_INDEX_GROUPING_PRODUCT_SERVICE: 'GET_INDEX_GROUPING_PRODUCT_SERVICE',
  SET_INDEX_GROUPING_PRODUCT: 'SET_INDEX_GROUPING_PRODUCT',

  // 订阅版块
  GET_INDEX_PERIODS_PRODUCT_SERVICE: 'GET_INDEX_PERIODS_PRODUCT_SERVICE',
  SET_INDEX_PERIODS_PRODUCT: 'SET_INDEX_PERIODS_PRODUCT',

  // 推荐版块
  GET_INDEX_RECOMMENDED_PRODUCT_SERVICE: 'GET_INDEX_RECOMMENDED_PRODUCT_SERVICE',
  SET_INDEX_RECOMMENDED_PRODUCT: 'SET_INDEX_RECOMMENDED_PRODUCT',

  // 积分版块
  GET_INDEX_CREDITS_PRODUCT_SERVICE: 'GET_INDEX_CREDITS_PRODUCT_SERVICE',
  SET_INDEX_CREDITS_PRODUCT: 'SET_INDEX_CREDITS_PRODUCT',

  // 启动版块的配置信息
  GET_INDEX_MODULES_SERVICE: 'GET_INDEX_MODULES_SERVICE',
  SET_INDEX_MODULES: 'SET_INDEX_MODULES',

  // 轮播
  GET_INDEX_CAROUSEL_SERVICE: 'GET_INDEX_CAROUSEL_SERVICE',
  SET_INDEX_CAROUSEL: 'SET_INDEX_CAROUSEL',

  // 快速入口
  GET_INDEX_SHORTCUT_SERVICE: 'GET_INDEX_SHORTCUT_SERVICE',
  SET_INDEX_SHORTCUT: 'SET_INDEX_SHORTCUT',
};


/**
 * Action Functions
 */


export const actions = {};


/**
 * Reducer
 */


export const home = (state = initState, action) => {
  /* eslint-disable camelcase */
  const {
    modules,
    carousel,
    shortcut,
    grouping,
    periods,
    recommended,
    credits,
  } = action;

  switch (action.type) {
    case types.SET_INDEX_MODULES:
      return Object.assign({}, state, {modules});

    case types.SET_INDEX_CAROUSEL:
      return Object.assign({}, state, {carousel});

    case types.SET_INDEX_SHORTCUT:
      return Object.assign({}, state, {shortcut});

    case types.SET_INDEX_GROUPING_PRODUCT:
      return Object.assign({}, state, {grouping});

    case types.SET_INDEX_PERIODS_PRODUCT:
      return Object.assign({}, state, {periods});

    case types.SET_INDEX_RECOMMENDED_PRODUCT:
      return Object.assign({}, state, {recommended});

    case types.SET_INDEX_CREDITS_PRODUCT:
      return Object.assign({}, state, {credits});

    default:
      return state;
  }
};
