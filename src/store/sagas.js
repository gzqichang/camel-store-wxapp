import {effects} from 'redux-saga';

import {userWatcher} from './user/sagas';
import {productWatcher} from './product/sagas';
import {homeWatcher} from './home/sagas';
import {searchWatcher} from './search/sagas';
import {orderWatcher} from './order/sagas';
import {othersWatcher} from './others/sagas';
import {addressWatcher} from './address/sagas';
import {storeWatcher} from './store/sagas';
import {systemWatcher} from './system/sagas';
import {configWatcher} from './config/sagas';
import {videoWatcher} from './video/sagas';
import {timerWatcher, startTicking} from './timer/sagas';


const {all, fork, take, call} = effects;


const rootSaga = function* () {
  yield all([
    userWatcher(),
    productWatcher(),
    homeWatcher(),
    searchWatcher(),
    orderWatcher(),
    othersWatcher(),
    addressWatcher(),
    configWatcher(),
    storeWatcher(),
    systemWatcher(),
    timerWatcher(),
    startTicking(),
    videoWatcher(),
  ]);
};


export const takeLeading = (patternOrChannel, saga, ...args) => fork(
  function*() {
    while (true) {
      const action = yield take(patternOrChannel);
      yield call(saga, ...args.concat(action));
    }
  }
);


export default rootSaga;
