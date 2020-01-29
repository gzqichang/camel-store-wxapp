import {effects} from 'redux-saga';

import {types} from './index';
import {types as otherTypes} from '../others';
import {productListParser} from '../product/helper';
import {
  loading,
  unPackImageField,
} from '../../utils';
import {
  searchGetHottest,
  searchGetList,
  searchGetOthers,
} from '../../service';


const {call, put, takeEvery} = effects;


export const getHottest = function* () {
  yield put({
    type: types.SET_SEARCH_LOADING,
    loading: true,
  });

  const res = yield call(searchGetHottest);

  let hottest = [];

  if (res && res.results)
    hottest = res.results;

  yield put({
    type: types.SET_HOTTEST,
    hottest,
  });
  yield put({
    type: types.SET_SEARCH_LOADING,
    loading: false,
  });
};


export const getSearchProduct = function* (action) {
  const {
    query,
    store,
    next,
    latitude,
    longitude,
  } = action;

  loading().show('加载中');

  if (!next)
    yield put({
      type: types.SET_SEARCH_LOADING,
      loading: true,
    });

  if (query)
    yield put({
      type: types.SET_SEARCH_PRODUCT,
      clear: true,
    });

  const res = unPackImageField(
    yield call(searchGetList, {query, store, next}));

  let list = [];
  let others = [];

  if (res && res.results) {
    list = productListParser(res.results);

    yield put({
      type: types.SET_SEARCH_PRODUCT,
      list,
    });

    yield put({
      type: otherTypes.UPDATE_NEXT_URL,
      url: res.next || '',
      key: 'searchList',
    });
  }

  const resOthers = unPackImageField(
    yield call(searchGetOthers, {
      query,
      store,
      latitude,
      longitude,
    }));

  if (resOthers) {
    others = Array.from(resOthers).map(
      (item) => ({
        ...item,
        goods: productListParser(item.goods),
      })
    );

    yield put({
      type: types.SET_SEARCH_OTHERS,
      others,
    });
  }

  loading().hide();

  if (!next)
    yield put({
      type: types.SET_SEARCH_LOADING,
      loading: false,
    });
};


export const searchWatcher = function* () {
  yield takeEvery(types.GET_HOTTEST_SERVICE, getHottest);
  yield takeEvery(types.GET_SEARCH_PRODUCT_SERVICE, getSearchProduct);
};
