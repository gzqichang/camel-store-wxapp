import {storage} from '../../utils/index';


/**
 * PRODUCT SEARCH REDUCER
 */


/**
 * Initial State
 */


export const initState = {
  query: '',
  hottest: [],
  history: [],
  list: [],
  others: [],
  loading: false,
};


/**
 * Action Types
 */


export const types = {
  // 热搜
  GET_HOTTEST_SERVICE: 'GET_HOTTEST_SERVICE',
  SET_HOTTEST: 'SET_HOTTEST',

  // 搜索历史
  SET_SEARCH_HISTORY: 'SET_SEARCH_HISTORY',

  // 搜索
  GET_SEARCH_PRODUCT_SERVICE: 'GET_SEARCH_PRODUCT_SERVICE',
  SET_SEARCH_PRODUCT: 'SET_SEARCH_PRODUCT',
  SET_SEARCH_OTHERS: 'SET_SEARCH_OTHERS',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',

  // 加载中
  SET_SEARCH_LOADING: 'SET_SEARCH_LOADING',
};


/**
 * Action Functions
 */


export const actions = {
  getSearchProductService: ({
    store,
    query,
    next,
    latitude,
    longitude,
  } = {}) => ({
    type: types.GET_SEARCH_PRODUCT_SERVICE,
    store,
    query,
    next,
    latitude,
    longitude,
  }),

  clearSearchProduct: () => ({
    type: types.SET_SEARCH_PRODUCT,
    clear: true,
  }),

  setSearchHistory: (history) => ({
    type: types.SET_SEARCH_HISTORY,
    history,
  }),

  getHottestService: () => ({
    type: types.GET_HOTTEST_SERVICE,
  }),

  setSearchQuery: (query) => ({
    type: types.SET_SEARCH_QUERY,
    query,
  }),
};


/**
 * Reducer
 */


export const search = (state = initState, action) => {
  switch (action.type) {
    case types.SET_HOTTEST:
      return Object.assign({}, state, {
        hottest: action.hottest,
      });

    case types.SET_SEARCH_PRODUCT:
      if (action.clear)
        return Object.assign({}, state, {list: []});

      let mark = [];
      const list = [
        ...state.list,
        ...action.list,
      ].filter(
        (item) => {
          const _ = mark.includes(item.id);
          if (!_) mark.push(item.id);
          return !_;
        }
      );
      return Object.assign({}, state, {list});

    case types.SET_SEARCH_HISTORY:
      const history = action.history.slice(0, 5);
      storage().setStorageSync('history', history);
      return Object.assign({}, state, {history});

    case types.SET_SEARCH_QUERY:
      return Object.assign({}, state, {
        query: action.query,
      });

    case types.SET_SEARCH_OTHERS:
      return Object.assign({}, state, {
        others: action.others,
      });

    case types.SET_SEARCH_LOADING:
      return Object.assign({}, state, {
        loading: action.loading,
      });

    default:
      return state;
  }
};
