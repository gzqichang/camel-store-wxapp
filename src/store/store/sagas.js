import {effects} from 'redux-saga';

import {types} from './index';
import {types as homeTypes} from '../home';
import {types as productTypes} from '../product';
import {takeLeading} from '../sagas';
import {loading} from '../../utils';
import {
  storeGetCurrent,
  storeGetList,
  storeSendFeedback,
  storeGetInfo,
} from '../../service';


const {call, put, take, select, takeEvery, race} = effects;

const getConfig = (state, key) => (state.config[key]);

const getHome = (state, key) => (state.home[key]);

const getStore = (state, key) => (state.store[key]);


export const pinpointCurrent = function* (action = {}) {
  const {
    payload: {
      store,
      location,
    },
  } = action;

  if (yield select(getStore, 'status') === 'available') return;

  const isQR = Boolean(yield select(getConfig, 'machineCode'));

  let res;

  // Use LocalStorage first
  if (store) {
    res = yield call(storeGetCurrent, {storeID: store});

    if (res && res.name && (isQR || res.status === 'open'))
      return yield put({
        type: types.GET_CURRENT_STORE_SERVICE,
        payload: {storeID: store},
      });
  }

  // Then Location
  if (location) {
    res = yield call(storeGetCurrent, {location});

    if (res && res.name && (isQR || res.status === 'open'))
      return yield put({
        type: types.GET_CURRENT_STORE_SERVICE,
        payload: {location},
      });
  }

  // Then Rest
  return yield put({
    type: types.GET_CURRENT_STORE_SERVICE,
    payload: {},
  });
};


export const getCurrent = function* (action = {}) {
  const {
    payload: {
      storeID,
      addressID,
      location,
    },
    callback,
  } = action;

  const res = yield call(
    storeGetCurrent,
    {
      storeID,
      addressID,
      location,
    });

  // 不在配送范围内
  if (!(res && res.name)) {
    yield put({
      type: types.SET_STORE_STATUS,
      status: 'unavailable',
    });

    return callback && callback();
  }

  yield put({
    type: types.SET_STORE_STATUS,
    status: 'available',
  });

  // 更新店铺信息
  yield put({
    type: types.SET_CURRENT_STORE,
    current: res,
  });

  // 清空已有的商品、首页海报等内容
  yield put({
    type: productTypes.CLEAR_PRODUCT_LIST,
  });
  yield put({
    type: productTypes.SET_CATEGORY,
    category: [],
  });
  yield put({
    type: homeTypes.SET_INDEX_GROUPING_PRODUCT,
    grouping: [],
  });
  yield put({
    type: homeTypes.SET_INDEX_PERIODS_PRODUCT,
    periods: [],
  });
  yield put({
    type: homeTypes.SET_INDEX_RECOMMENDED_PRODUCT,
    recommended: [],
  });
  yield put({
    type: homeTypes.SET_INDEX_CREDITS_PRODUCT,
    credits: [],
  });

  const store = res.id;

  const enableRicherLandingPage = yield select(
    getConfig,
    'enableRicherLandingPage',
  );

  loading().show();

  // 重新获取商品、首页海报
  yield put({
    type: productTypes.GET_PRODUCT_LIST_SERVICE,
    storeID: store,
    withloading: false,
  });
  yield put({
    type: productTypes.GET_CATEGORY_SERVICE,
    storeID: store,
  });

  if (!enableRicherLandingPage) {
    // 简单的首页
    yield put({
      type: productTypes.GET_BANNER_SERVICE,
      storeID: store,
    });

    loading().hide();
  } else {
    // 丰富的首页
    yield put({
      type: homeTypes.GET_INDEX_MODULES_SERVICE,
      payload: {
        store,
      },
    });

    yield put({
      type: homeTypes.GET_INDEX_CAROUSEL_SERVICE,
      payload: {store},
    });
    yield put({
      type: homeTypes.GET_INDEX_SHORTCUT_SERVICE,
      payload: {store},
    });

    yield take(homeTypes.SET_INDEX_MODULES);

    const indexModules = yield select(getHome, 'modules');

    const isEnabledModules = [
      indexModules.grouping,
      // indexModules.periodic,
      indexModules.credit,
      indexModules.recommendation,
    ].some((x) => (x));

    if (indexModules.grouping)
      yield put({
        type: homeTypes.GET_INDEX_GROUPING_PRODUCT_SERVICE,
        payload: {store},
      });
    // if (indexModules.periodic)
    //   yield put({
    //     type: homeTypes.GET_INDEX_PERIODS_PRODUCT_SERVICE,
    //     payload: {store},
    //   });
    if (indexModules.credit)
      yield put({
        type: homeTypes.GET_INDEX_CREDITS_PRODUCT_SERVICE,
        payload: {store},
      });
    if (indexModules.recommendation)
      yield put({
        type: homeTypes.GET_INDEX_RECOMMENDED_PRODUCT_SERVICE,
        payload: {store},
      });

    if (isEnabledModules)
      yield race({
        1: take(homeTypes.SET_INDEX_CREDITS_PRODUCT),
        2: take(homeTypes.SET_INDEX_GROUPING_PRODUCT),
        3: take(homeTypes.SET_INDEX_RECOMMENDED_PRODUCT),
        // 2: take(homeTypes.SET_INDEX_PERIODS_PRODUCT),
      });

    loading().hide();
  }

  callback && callback();
};


export const getRecommended = function* (action = {}) {
  const {payload: {location}} = action;

  const res = yield call(storeGetCurrent, {location});

  if (res && res.name)
    yield put({
      type: types.SET_RECOMMENDED_STORE,
      recommendation: res,
    });
};


export const getList = function* (action = {}) {
  const {payload: {location}} = action;

  const res = yield call(storeGetList, location);

  if (res && Array.isArray(res))
    yield put({
      type: types.SET_STORE_LIST,
      list: res,
    });
};


export const sendFeedbackMessage = function* (action = {}) {
  const {
    payload: {data},
    callback,
  } = action;

  yield call(storeSendFeedback, data);

  callback && callback();
};


export const getInfo = function* () {
  const res = yield call(storeGetInfo);

  if (res)
    yield put({
      type: types.SET_STORE_INFO,
      payload: {
        info: res,
      },
    });
};


export const storeWatcher = function* () {
  yield takeEvery(types.GET_STORE_LIST_SERVICE, getList);
  yield takeEvery(types.GET_STORE_INFO_SERVICE, getInfo);
  yield takeEvery(types.GET_CURRENT_STORE_SERVICE, getCurrent);
  yield takeLeading(types.PINPOINT_CURRENT_STORE_SERVICE, pinpointCurrent);
  yield takeEvery(types.GET_RECOMMENDED_STORE_SERVICE, getRecommended);
  yield takeEvery(types.SEND_FEEDBACK_MESSAGE_SERVICE, sendFeedbackMessage);
};
