/**
 * SYSTEM REDUCER
 */


/**
 * Initial State
 */


export const initState = {
  permissions: [],                  // 已有的权限列表
};


/**
 * Action Types
 */


export const types = {
  UPDATE_PERMISSIONS_SERVICE: 'UPDATE_PERMISSIONS_SERVICE',
  SET_PERMISSIONS: 'SET_PERMISSIONS',
};


/**
 * Action Functions
 */


export const actions = {
  updatePermissionsService: () => ({
    type: types.UPDATE_PERMISSIONS_SERVICE,
  }),
};


/**
 * Reducer
 */


export const system = (state = initState, action) => {
  switch (action.type) {
    case types.SET_PERMISSIONS:
      const {permissions} = action;
      return Object.assign({}, state, {permissions});

    default:
      return state;
  }
};
