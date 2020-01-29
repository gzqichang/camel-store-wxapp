import {effects} from 'redux-saga';

import {types} from './index';
import {
  othersGetFaq,
  othersGetMessages,
  othersGetMemberShipLevels,
} from '../../service';


const {call, put, takeEvery} = effects;


export const getFaq = function* () {
  const res = yield call(othersGetFaq);
  if (res && res.results)
    yield put({
      type: types.SET_FAQ,
      faq: res.results,
    });
};


export const getMessages = function* () {
  const res = yield call(othersGetMessages);
  if (res && res.results)
    yield put({
      type: types.SET_MESSAGE,
      messages: res.results,
    });
};


export const getLevels = function* () {
  const res = yield call(othersGetMemberShipLevels);
  if (res && res.results)
    yield put({
      type: types.SET_MEMBERSHIP_LEVELS,
      membershipLevels: res.results,
    });
};


export const othersWatcher = function* () {
  yield takeEvery(types.GET_FAQ_SERVICE, getFaq);
  yield takeEvery(types.GET_MESSAGE_SERVICE, getMessages);
  yield takeEvery(types.GET_MEMBERSHIP_LEVELS_SERVICE, getLevels);
};
