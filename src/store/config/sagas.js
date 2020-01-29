import {effects} from 'redux-saga';

import {types} from './index';
import {configGet} from '../../service';
import {GLOBAL_CONFIG} from '../properties';


const {call, put, takeEvery} = effects;


export const getConfig = function* () {
  const res = yield call(configGet);

  let _ = {};

  if (res)
    Object
      .entries(GLOBAL_CONFIG)
      .map(([local, remote]) => {
        if (res[remote] !== undefined)
          _[local] = res[remote];
      });

  yield put({
    type: types.SET_CONFIG,
    payload: _,
  });
};


export const configWatcher = function* () {
  yield takeEvery(types.GET_CONFIG_SERVICE, getConfig);
};
