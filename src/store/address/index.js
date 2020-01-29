/**
 * ADDRESS REDUCER
 */


/**
 * Initial State
 */


export const initState = {
  // oneOf:
  //   out-of-services  [不在当前店的配送范围]
  //   no-services      [不在所有店的配送范围]
  //   ''               [正常]
  status: '',
  current: null,
  list: [],
};


/**
 * Action Types
 */


export const types = {
  // 全部地址
  SET_ADDRESS_LIST: 'SET_ADDRESS_LIST',

  // 当前地址
  SET_ADDRESS_CURRENT: 'SET_ADDRESS_CURRENT',

  // 增删改查
  ADD_ADDRESS_SERVICE: 'ADD_ADDRESS_SERVICE',
  DELETE_ADDRESS_SERVICE: 'DELETE_ADDRESS_SERVICE',
  UPDATE_ADDRESS_SERVICE: 'UPDATE_ADDRESS_SERVICE',
  GET_ADDRESS_SERVICE: 'GET_ADDRESS_SERVICE',

  // 状态
  SET_ADDRESS_STATUS: 'SET_ADDRESS_STATUS',
};


/**
 * Action Functions
 */


export const actions = {
  addAddressService: ({address, store, skipCheck, callback}) => ({
    type: types.ADD_ADDRESS_SERVICE,
    address,
    store,
    skipCheck,
    callback,
  }),

  getAddressService: (store) => ({
    type: types.GET_ADDRESS_SERVICE,
    store,
  }),

  deleteAddressService: ({url, store}) => ({
    type: types.DELETE_ADDRESS_SERVICE,
    store,
    url,
  }),

  updateAddressService: ({url, address, refetch, store}) => ({
    type: types.UPDATE_ADDRESS_SERVICE,
    address,
    store,
    refetch,
    url,
  }),

  setAddressList: (list) => ({
    type: types.SET_ADDRESS_LIST,
    list,
  }),

  setAddressCurrent: (current) => ({
    type: types.SET_ADDRESS_CURRENT,
    current,
  }),

  setAddressStatus: (status) => ({
    type: types.SET_ADDRESS_STATUS,
    status,
  }),
};


/**
 * Reducer
 */


export const address = (state = initState, action) => {
  switch (action.type) {
    case types.SET_ADDRESS_LIST:
      const {list} = action;
      return Object.assign({}, state, {
        list,
      });

    case types.SET_ADDRESS_CURRENT:
      const {current} = action;
      return Object.assign({}, state, {
        current,
      });

    case types.SET_ADDRESS_STATUS:
      const {status} = action;
      return Object.assign({}, state, {
        status,
      });

    default:
      return state;
  }
};
