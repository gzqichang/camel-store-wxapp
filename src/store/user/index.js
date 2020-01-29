/**
 * USER REDUCER
 */


/**
 * Initial State
 */


export const initState = {
  accountLog: [],
  creditLog: [],
  partners: [],
  topUpTypes: [],
};


/**
 * Action Types
 */


export const types = {
  // 初始化
  AUTH_SERVICE: 'AUTH_SERVICE',
  RE_AUTH_SERVICE: 'RE_AUTH_SERVICE',
  GET_APP_CONFIG_SERVICE: 'GET_APP_CONFIG_SERVICE',

  // 用户信息
  GET_USER_INFO_SERVICE: 'GET_USER_INFO_SERVICE',
  SET_USER_INFO: 'SET_USER_INFO',

  // 更新手机号码
  UPDATE_USER_PHONE_SERVICE: 'UPDATE_USER_PHONE_SERVICE',

  // 用户日志
  GET_USER_LOG_SERVICE: 'GET_USER_LOG_SERVICE',
  SET_USER_LOG: 'SET_USER_LOG',

  // 积分日志
  GET_CREDIT_LOG_SERVICE: 'GET_CREDIT_LOG_SERVICE',
  SET_CREDIT_LOG: 'SET_CREDIT_LOG',

  // 提现
  NEW_WITHDRAW_SERVICE: 'NEW_WITHDRAW_SERVICE',

  // 我的小伙伴们
  GET_USER_PARTNERS_SERVICE: 'GET_USER_PARTNERS_SERVICE',
  SET_USER_PARTNERS: 'SET_USER_PARTNERS',

  // 充值
  GET_TOP_UP_TYPES_SERVICE: 'GET_TOP_UP_TYPES_SERVICE',
  SET_TOP_UP_TYPES: 'SET_TOP_UP_TYPES',
  NEW_TOP_UP_SERVICE: 'NEW_TOP_UP_SERVICE',
};


/**
 * Action Functions
 */


export const actions = {
  authService: (payload) => ({
    type: types.AUTH_SERVICE,
    payload,
  }),

  getAppConfigService: (payload) => ({
    type: types.GET_APP_CONFIG_SERVICE,
    payload,
  }),

  getUserInfoService: () => ({
    type: types.GET_USER_INFO_SERVICE,
  }),

  getUserLogService: ({
    user = '',
    next = '',
  }) => ({
    type: types.GET_USER_LOG_SERVICE,
    payload: {
      user,
    },
    next,
  }),

  getCreditLogService: ({
    user = '',
    next = '',
  }) => ({
    type: types.GET_CREDIT_LOG_SERVICE,
    payload: {
      user,
    },
    next,
  }),

  newWithdrawService: (data) => ({
    type: types.NEW_WITHDRAW_SERVICE,
    data,
  }),

  updateUserPhoneService: ({data, callback}) => ({
    type: types.UPDATE_USER_PHONE_SERVICE,
    data,
    callback,
  }),

  getPartnersService: () => ({
    type: types.GET_USER_PARTNERS_SERVICE,
  }),

  getTopUpTypesService: () => ({
    type: types.GET_TOP_UP_TYPES_SERVICE,
  }),

  newTopUpService: (amount) => ({
    type: types.NEW_TOP_UP_SERVICE,
    amount,
  }),
};


/**
 * Reducer
 */


export const user = (state = initState, action) => {
  let mark = [];

  switch (action.type) {
    case types.SET_USER_INFO:
      return Object.assign(
        {},
        state,
        action.payload,
      );

    case types.SET_USER_LOG:
      let accountLog = [
        ...state.accountLog,
        ...action.accountLog,
      ].filter(
        (item) => {
          const _ = mark.includes(item.add_time);
          if (!_) mark.push(item.add_time);
          return !_;
        }
      ).sort((a, b) => new Date(b.add_time).getTime() - new Date(a.add_time).getTime());
      return Object.assign(
        {},
        state,
        {accountLog},
      );

    case types.SET_CREDIT_LOG:
      let creditLog = [
        ...state.creditLog,
        ...action.creditLog,
      ].filter(
        (item) => {
          const _ = mark.includes(item.add_time);
          if (!_) mark.push(item.add_time);
          return !_;
        }
      ).sort((a, b) => new Date(b.add_time).getTime() - new Date(a.add_time).getTime());
      return Object.assign(
        {},
        state,
        {creditLog},
      );

    case types.SET_USER_PARTNERS:
      const {partners} = action;
      return Object.assign(
        {},
        state,
        {partners},
      );

    case types.SET_TOP_UP_TYPES:
      const {topUpTypes} = action;
      return Object.assign(
        {},
        state,
        {topUpTypes},
      );

    default:
      return state;
  }
};
