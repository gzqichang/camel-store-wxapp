import {effects} from 'redux-saga';

import {types} from './index';
import {productListParser} from '../product/helper';
import {unPackImageField} from '../../utils';
import {
  productGetList,
  homeGetCarousel,
  homeGetShortcut,
  homeGetModules,
} from '../../service';
import {
  _TYPES,
  PRODUCT_TYPES,
} from '../properties';


const {call, put, takeEvery} = effects;


/* eslint-disable camelcase */
export const getIndexGroupingProduct = function* (action = {}) {
  const {payload: {store}} = action;

  const res = unPackImageField(
    yield call(productGetList, {
      store,
      isGrouping: true,
      pageSize: 4,
    }));

  let grouping = [];

  if (res && res.results)
    grouping = productListParser(res.results);

  yield put({
    type: types.SET_INDEX_GROUPING_PRODUCT,
    grouping,
  });
};


export const getIndexPeriodsProduct = function* (action = {}) {
  const {payload: {store}} = action;

  const res = unPackImageField(
    yield call(productGetList, {
      store,
      pageSize: 9 + 1,
      productType: PRODUCT_TYPES[_TYPES.subscription],
    }));

  let periods = [];

  if (res && res.results)
    periods = productListParser(res.results);

  yield put({
    type: types.SET_INDEX_PERIODS_PRODUCT,
    periods,
  });
};


export const getIndexRecommendedProduct = function* (action = {}) {
  const {payload: {store}} = action;

  const res = unPackImageField(
    yield call(productGetList, {
      store,
      pageSize: 11 + 1,
      recommendation: true,
    }));

  let recommended = [];

  if (res && res.results)
    recommended = productListParser(res.results);

  yield put({
    type: types.SET_INDEX_RECOMMENDED_PRODUCT,
    recommended,
  });
};


export const getIndexCreditsProduct = function* (action = {}) {
  const {payload: {store}} = action;

  const res = unPackImageField(
    yield call(productGetList, {
      store,
      pageSize: 9,
      productType: PRODUCT_TYPES[_TYPES.credits],
    }));

  let credits = [];

  if (res && res.results)
    credits = productListParser(res.results);

  yield put({
    type: types.SET_INDEX_CREDITS_PRODUCT,
    credits,
  });
};


export const getIndexCarousel = function* (action) {
  const {payload: {store}} = action;

  const res = unPackImageField(
    yield call(homeGetCarousel, {store}));

  let carousel = [];

  if (res && res.results)
    carousel = res.results;

  yield put({
    type: types.SET_INDEX_CAROUSEL,
    carousel,
  });
};


export const getIndexShortcut = function* (action) {
  const {payload: {store}} = action;

  const res = unPackImageField(
    yield call(homeGetShortcut, {store}));

  let shortcut = [];

  if (res && res.results)
    shortcut = res.results;

  yield put({
    type: types.SET_INDEX_SHORTCUT,
    shortcut,
  });
};


export const getIndexModules = function* (action = {}) {
  const {payload: {store}} = action;

  const res = unPackImageField(
    yield call(homeGetModules, {store}));

  let modules = {};

  if (res && res.results)
    Array
      .from(res.results)
      .map(({module, active}) => {
        modules[module] = active;
      });

  yield put({
    type: types.SET_INDEX_MODULES,
    modules,
  });
};


export const homeWatcher = function* () {
  yield takeEvery(types.GET_INDEX_GROUPING_PRODUCT_SERVICE, getIndexGroupingProduct);
  yield takeEvery(types.GET_INDEX_PERIODS_PRODUCT_SERVICE, getIndexPeriodsProduct);
  yield takeEvery(types.GET_INDEX_RECOMMENDED_PRODUCT_SERVICE, getIndexRecommendedProduct);
  yield takeEvery(types.GET_INDEX_CREDITS_PRODUCT_SERVICE, getIndexCreditsProduct);
  yield takeEvery(types.GET_INDEX_CAROUSEL_SERVICE, getIndexCarousel);
  yield takeEvery(types.GET_INDEX_SHORTCUT_SERVICE, getIndexShortcut);
  yield takeEvery(types.GET_INDEX_MODULES_SERVICE, getIndexModules);
};
