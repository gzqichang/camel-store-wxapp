/**
 * TIMER REDUCER
 */


/**
 * Initial State
 */


export const initState = {
  results: {},
};


/**
 * Action Types
 */


export const types = {
  // 开启 / 结束
  START_TICKING: 'START_TICKING',
  STOP_TICKING: 'STOP_TICKING',

  // 注册 / 清空
  REGISTER_TICKING: 'REGISTER_TICKING',
  CLEAR_TICKING: 'CLEAR_TICKING',

  // 保存
  UPDATE_TIMER: 'UPDATE_TIMER',
};


/**
 * Action Functions
 */


export const actions = {
  clearTicking: () => ({
    type: types.CLEAR_TICKING,
  }),

  registerTickingSingle: ({id, time}) => ({
    type: types.REGISTER_TICKING,
    tasks: [{id, time}],
  }),

  registerTickingBulk: (tasks) => ({
    type: types.REGISTER_TICKING,
    tasks,
  }),
};


/**
 * Reducer
 */


export const timer = (state = initState, action) => {
  switch (action.type) {
    case types.UPDATE_TIMER:
      return Object.assign({}, state, {
        results: action.results,
      });

    default:
      return state;
  }
};
