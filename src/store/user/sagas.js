import wepy from 'wepy';
import {effects, delay} from 'redux-saga';

import {go2page, loading, showModal, showToast} from '../../utils/index';
import {types} from './index';
import {types as configTypes} from '../config';
import {types as otherTypes} from '../others';
import {
  userGetCode,
  userWxLogin,
  userGetInfo,
  userGetLog,
  userGetCreditLog,
  userNewWithdraw,
  userUpdateInfo,
  userGetPartners,
  userGetTopUpTypes,
  userNewTopUp,
  userUpdatePhone,
} from '../../service';
import {APP_VERSION, CONFIG_KEYS} from '../properties';


const {call, put, take, select, takeEvery} = effects;


export const auth = function* ({payload: {scene, callback}}) {
  // Auth
  const code = yield call(userGetCode);
  const login = yield call(userWxLogin, code);

  // session keys
  if (login && login.session)
    wepy.setStorageSync('session', login.session);

  // Update user info
  const _scene = yield select(
    (state) => (state.others.scene));

  let _ = scene ? {scene} : (_scene ? {scene: _scene} : {});

  if (_scene)
    yield put({
      type: otherTypes.SET_SCENE,
      scene: '',
    });

  yield new Promise(
    (resolve) => {
      wepy.getUserInfo({
        lang: 'zh_CN',
        success: (res) => {
          if (res)
            _ = {
              ..._,
              encrypted_data: res.encryptedData,
              raw_data: res.rawData,
              iv: res.iv,
              signature: res.signature,
            };
          resolve();
        },
        fail: resolve,
      });
    }
  );

  if (_.raw_data)
    yield call(userUpdateInfo, _);

  const info = yield call(userGetInfo);

  /* eslint-disable camelcase */
  const {has_bonus_right, has_rebate_right} = info;

  if (has_bonus_right === false)
    yield put({
      type: configTypes.SET_CONFIG,
      payload: {
        [CONFIG_KEYS.enableDistributionRelations]: false,
      },
    });
  if (has_rebate_right === false)
    yield put({
      type: configTypes.SET_CONFIG,
      payload: {
        [CONFIG_KEYS.enableSharingProfit]: false,
      },
    });

  yield put({
    type: types.SET_USER_INFO,
    payload: {
      ...login,
      ...info,
    },
  });

  // Callback
  callback && callback();

  // Prepare for re-auth
  // yield put({type: types.RE_AUTH_SERVICE});
};


export const reAuth = function* () {
  yield delay(300 * 1000);
  yield put({
    type: types.AUTH_SERVICE,
    payload: {},
  });
};


export const getAppConfig = function* ({payload: {callback}}) {
  // Update Settings
  yield put({
    type: configTypes.GET_CONFIG_SERVICE,
  });

  yield take(configTypes.SET_CONFIG);

  const remoteVersion = yield select(
    (state) => (state.config.systemVersion));

  console.info({
    AppVersion: APP_VERSION,
    InterfaceVerion: remoteVersion,
  });

  if (remoteVersion !== APP_VERSION)
    return go2page().redirect('/pages/util/update');

  callback && callback();
};


export const getUserLog = function* ({
    payload = {},
    next = '',
  }) {
  const {user = ''} = payload;

  const res = yield call(userGetLog, {
    user,
    next,
  });

  if (res && res.results) {
    yield put({
      type: types.SET_USER_LOG,
      accountLog: res.results,
    });
    yield put({
      type: otherTypes.UPDATE_NEXT_URL,
      url: res.next || '',
      key: 'userLogs',
    });
  }
};


export const getCreditLog = function* ({
    payload = {},
    next = '',
  }) {
  const {user = ''} = payload;

  const res = yield call(userGetCreditLog, {
    user,
    next,
  });

  if (res && res.results) {
    yield put({
      type: types.SET_CREDIT_LOG,
      creditLog: res.results,
    });
    yield put({
      type: otherTypes.UPDATE_NEXT_URL,
      url: res.next || '',
      key: 'creditLog',
    });
  }
};


export const newWithdraw = function* ({data}) {
  yield call(userNewWithdraw, data);
  showToast('提交成功');
  yield call(getUserInfo);
  const user = yield select((state) => (state.user.id));
  yield call(getUserLog, {payload: {user}});
};


export const getUserInfo = function* () {
  const payload = yield call(userGetInfo);
  yield put({
    type: types.SET_USER_INFO,
    payload,
  });
};


export const updateUserPhone = function* ({data, callback}) {
  const res = yield call(userUpdatePhone, data);

  yield call(getUserInfo);

  if (res)
    callback && callback(res.phoneNumber || undefined);
};


export const getUserPartners = function* () {
  const partners = yield call(userGetPartners);
  yield put({
    type: types.SET_USER_PARTNERS,
    partners,
  });
};


export const getTopUpTypes = function* () {
  loading().show();
  const res = yield call(userGetTopUpTypes);
  if (res && res.results)
    yield put({
      type: types.SET_TOP_UP_TYPES,
      topUpTypes: res.results,
    });
  loading().hide();
};


export const newTopUp = function* ({amount}) {
  loading().show('处理中');
  const info = yield call(userNewTopUp, amount);

  loading().hide();
  if (!info.nonceStr) {
    showModal({
      title: '出错了',
      content: info,
    });
    return go2page().back();
  }

  return wepy.requestPayment({
    ...info,
    success: () => {
      showToast('支付成功');
    },
    fail: () => {
      showToast('支付失败');
    },
    complete: () => {
      go2page().back();
    },
  });
};


export const userWatcher = function* () {
  yield takeEvery(types.AUTH_SERVICE, auth);
  yield takeEvery(types.RE_AUTH_SERVICE, reAuth);
  yield takeEvery(types.GET_APP_CONFIG_SERVICE, getAppConfig);
  yield takeEvery(types.GET_USER_LOG_SERVICE, getUserLog);
  yield takeEvery(types.GET_CREDIT_LOG_SERVICE, getCreditLog);
  yield takeEvery(types.GET_USER_INFO_SERVICE, getUserInfo);
  yield takeEvery(types.NEW_WITHDRAW_SERVICE, newWithdraw);
  yield takeEvery(types.GET_USER_PARTNERS_SERVICE, getUserPartners);
  yield takeEvery(types.GET_TOP_UP_TYPES_SERVICE, getTopUpTypes);
  yield takeEvery(types.NEW_TOP_UP_SERVICE, newTopUp);
  yield takeEvery(types.UPDATE_USER_PHONE_SERVICE, updateUserPhone);
};
