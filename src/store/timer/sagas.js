import {effects, delay} from 'redux-saga';

import {types} from './index';


const {cancel, cancelled, take, fork, put, takeEvery} = effects;

let tasks = [];


const timeDiff = (start, end) => {
  const gaps = [
    24 * 3600 * 1000,
    3600 * 1000,
    60 * 1000,
    1000,
  ];
  let diff = end.getTime() - start.getTime();
  let left = diff;
  let results = {};

  // results.day = Math.floor(diff / gaps[0]);
  // left = diff % gaps[0];

  results.hour = Math.floor(left / gaps[1]);
  left = left % gaps[1];

  results.minute = Math.floor(left / gaps[2]);
  left = left % gaps[2];

  results.second = Math.round(left / gaps[3]);

  return results;
};


const ticking = function* () {
  try {
    while (true) {
      let results = {};

      if (tasks.length > 0) {
        const now = new Date();
        tasks = tasks
          .map(({id, time}) => {
            const left = timeDiff(now, time);
            const current = [
              left.hour,
              left.minute,
              left.second,
            ];

            let isRemovable = current.every((item) => (item <= 0));

            if (isRemovable) {
              results[id] = '';
              return {id, time: null};
            } else {
              results[id] = current.map((x) => (`0${x}`.slice(-2))).join(':');
              return {id, time};
            }
          })
          .filter((item) => (item.time !== null));
      }

      if (tasks.length)
        yield put({
          type: types.UPDATE_TIMER,
          results,
        });

      yield delay(1000);
    }
  } catch (e) {
    console.error(e);
  } finally {
    yield cancelled();
  }
};


export const startTicking = function* () {
  while (yield take(types.START_TICKING)) {
    const timer = yield fork(ticking);

    yield take(types.STOP_TICKING);

    yield cancel(timer);
  }
};


export const registerTicking = function* (action = {}) {
  const obj = {};

  [...tasks, ...action.tasks].map((item) => {
    obj[item.id] = new Date(item.time);
  });

  tasks = Object.entries(obj).map(
    ([id, time]) => ({id, time})
  );

  yield put({
    type: types.START_TICKING,
  });
};


export const clearTicking = function* () {
  tasks = [];

  yield put({
    type: types.STOP_TICKING,
  });
};


export const timerWatcher = function* () {
  yield takeEvery(types.REGISTER_TICKING, registerTicking);
  yield takeEvery(types.CLEAR_TICKING, clearTicking);
};
