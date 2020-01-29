/**
 * STORE INFO REDUCER
 */

import {storage} from '../../utils';


/**
 * Initial State
 */


export const initState = {
  id: '',
  status: 'locating',
  // oneOf:
  //   locating     [加载中]
  //   unavailable  [不在配送范围]
  //   available    [正常]
  //   error        [定位异常]
  disabledLocating: false,
  current: {},
  list: [],
  recommendation: {},
  info: {},
};


/**
 * Action Types
 */


export const types = {
  // 获取当前店铺
  PINPOINT_CURRENT_STORE_SERVICE: 'PINPOINT_CURRENT_STORE_SERVICE',
  GET_CURRENT_STORE_SERVICE: 'GET_CURRENT_STORE_SERVICE',
  SET_CURRENT_STORE: 'SET_CURRENT_STORE',
  SET_CURRENT_STORE_ID: 'SET_CURRENT_STORE_ID',

  // 设置推荐店铺
  GET_RECOMMENDED_STORE_SERVICE: 'GET_RECOMMENDED_STORE_SERVICE',
  SET_RECOMMENDED_STORE: 'SET_RECOMMENDED_STORE',

  // 获取店铺列表
  GET_STORE_LIST_SERVICE: 'GET_STORE_LIST_SERVICE',
  SET_STORE_LIST: 'SET_STORE_LIST',

  // 获取小程序信息
  GET_STORE_INFO_SERVICE: 'GET_STORE_INFO_SERVICE',
  SET_STORE_INFO: 'SET_STORE_INFO',

  // 状态
  SET_STORE_STATUS: 'SET_STORE_STATUS',

  // 是否使用定位优先
  TOGGLE_DISABLED_LOCATING: 'TOGGLE_DISABLED_LOCATING',

  // 反馈
  SEND_FEEDBACK_MESSAGE_SERVICE: 'SEND_FEEDBACK_MESSAGE_SERVICE',
};


/**
 * Action Functions
 */


export const actions = {
  pinpointCurrentStoreService: ({
   store,
   location,
  } = {}) => ({
    type: types.PINPOINT_CURRENT_STORE_SERVICE,
    payload: {
      store,
      location,
    },
  }),

  getCurrentStoreService: ({
   storeID,
   addressID,
   location,
   callback,
  } = {}) => ({
    type: types.GET_CURRENT_STORE_SERVICE,
    payload: {
      storeID,
      addressID,
      location,
    },
    callback,
  }),

  setCurrentStoreID: (store) => ({
    type: types.SET_CURRENT_STORE_ID,
    payload: {
      store,
    },
  }),

  getRecommendedStoreService: ({location} = {}) => ({
    type: types.GET_RECOMMENDED_STORE_SERVICE,
    payload: {
      location,
    },
  }),

  getStoreListService: (location) => ({
    type: types.GET_STORE_LIST_SERVICE,
    payload: {
      location,
    },
  }),

  toggleDisabledLocating: (disabledLocating = null) => ({
    type: types.TOGGLE_DISABLED_LOCATING,
    payload: {
      disabledLocating,
    },
  }),

  setStoreStatus: (status) => ({
    type: types.SET_STORE_STATUS,
    status,
  }),

  getStoreInfoService: () => ({
    type: types.GET_STORE_INFO_SERVICE,
  }),

  sendFeedbackMessageService: ({data, callback}) => ({
    type: types.SEND_FEEDBACK_MESSAGE_SERVICE,
    payload: {
      data,
    },
    callback,
  }),
};


/**
 * Reducer
 */


export const store = (state = initState, action) => {
  switch (action.type) {
    case types.SET_CURRENT_STORE:
      storage().setStorageSync('store', action.current.id);
      return Object.assign({}, state, {
        id: action.current.id,
        current: action.current,
      });

    case types.SET_CURRENT_STORE_ID:
      return Object.assign({}, state, {
        id: action.payload.store,
      });

    case types.SET_RECOMMENDED_STORE:
      return Object.assign({}, state, {
        recommendation: action.recommendation,
      });

    case types.SET_STORE_LIST:
      return Object.assign({}, state, {
        list: action.list,
      });

    case types.SET_STORE_INFO:
      return Object.assign({}, state, action.payload);

    case types.SET_STORE_STATUS:
      return Object.assign({}, state, {
        status: action.status,
      });

    case types.TOGGLE_DISABLED_LOCATING:
      return Object.assign({}, state, {
        disabledLocating: action.payload.disabledLocating === null
          ? !state.disabledLocating
          : action.payload.disabledLocating,
      });

    default:
      return state;
  }
};
