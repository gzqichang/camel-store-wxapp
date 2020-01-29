/**
 * OTHERS REDUCER
 */


/**
 * Initial State
 */
import {checkIOS} from '../../utils';

export const initState = {
  orderNotes: '',
  orderGroup: '',
  orderTime: {},
  newGroup: '',
  storeID: '',
  scene: '',
  faq: [],
  messages: [],
  membershipLevels: [],
  nextURL: {
    orderList: '',
    // orderList_someStatus: '',

    productList: '',
    // productList_someCategory: '',

    userLogs: '',

    creditLog: '',

    searchList: '',

    videoList: '',

    videoProductList: '',

    videoUserList: '',
  },
  isIOS: checkIOS(),
};


/**
 * Action Types
 */


export const types = {
  // 订单备注
  SET_ORDER_NOTES: 'SET_ORDER_NOTES',

  // 订单拼团
  SET_ORDER_GROUP: 'SET_ORDER_GROUPS',
  SET_NEW_GROUP: 'SET_NEW_GROUP',

  // 确认订单 到 日历页面的通讯
  SET_ORDER_TIME: 'SET_ORDER_TIME',

  // 常见问题
  GET_FAQ_SERVICE: 'GET_FAQ_SERVICE',
  SET_FAQ: 'SET_FAQ',

  // 下一页链接
  UPDATE_NEXT_URL: 'UPDATE_NEXT_URL',

  // 首页消息
  GET_MESSAGE_SERVICE: 'GET_MESSAGE_SERVICE',
  SET_MESSAGE: 'SET_MESSAGE',

  // 会员等级
  GET_MEMBERSHIP_LEVELS_SERVICE: 'GET_MEMBERSHIP_LEVELS_SERVICE',
  SET_MEMBERSHIP_LEVELS: 'SET_MEMBERSHIP_LEVELS',

  // 跳转用的临时店铺ID
  SET_TEMP_STORE_ID: 'SET_TEMP_STORE_ID',

  // 分销场景值
  SET_SCENE: 'SET_SCENE',
};


/**
 * Action Functions
 */


export const actions = {
  /* eslint-disable camelcase */
  getFAQService: () => ({
    type: types.GET_FAQ_SERVICE,
  }),

  setOrderNotes: (orderNotes) => ({
    type: types.SET_ORDER_NOTES,
    orderNotes,
  }),

  setOrderGroup: (orderGroup) => ({
    type: types.SET_ORDER_GROUP,
    orderGroup,
  }),

  setNewGroup: (newGroup) => ({
    type: types.SET_NEW_GROUP,
    newGroup,
  }),

  setOrderTime: (orderTime) => ({
    type: types.SET_ORDER_TIME,
    orderTime,
  }),

  setScene: (scene) => ({
    type: types.SET_SCENE,
    scene,
  }),

  getMessageService: () => ({
    type: types.GET_MESSAGE_SERVICE,
  }),

  getMembershipLevelsService: () => ({
    type: types.GET_MEMBERSHIP_LEVELS_SERVICE,
  }),
};


/**
 * Reducer
 */


export const others = (state = initState, action) => {
  switch (action.type) {
    case types.SET_ORDER_NOTES:
      const {orderNotes} = action;
      return Object.assign({}, state, {
        orderNotes,
      });

    case types.SET_ORDER_GROUP:
      const {orderGroup} = action;
      return Object.assign({}, state, {
        orderGroup,
      });

    case types.SET_NEW_GROUP:
      const {newGroup} = action;
      return Object.assign({}, state, {
        newGroup,
      });

    case types.SET_ORDER_TIME:
      const {orderTime} = action;
      return Object.assign({}, state, {
        orderTime,
      });

    case types.SET_FAQ:
      const {faq} = action;
      return Object.assign({}, state, {
        faq,
      });

    case types.SET_TEMP_STORE_ID:
      const {storeID} = action;
      return Object.assign({}, state, {
        storeID,
      });

    case types.UPDATE_NEXT_URL:
      const {key, url} = action;
      return Object.assign({}, state, {
        nextURL: {
          ...state.nextURL,
          [key]: url || null,
        },
      });

    case types.SET_MESSAGE:
      const {messages} = action;
      return Object.assign({}, state, {
        messages,
      });

    case types.SET_MEMBERSHIP_LEVELS:
      const {membershipLevels} = action;
      return Object.assign({}, state, {
        membershipLevels,
      });

    case types.SET_SCENE:
      const {scene} = action;
      return Object.assign({}, state, {
        scene,
      });

    default:
      return state;
  }
};
