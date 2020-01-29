import {effects} from 'redux-saga';

import {loading} from '../../utils/index';
import {types} from './index';
import {types as othersTypes} from '../others';
import {
  addressAdd,
  addressGet,
  addressDelete,
  addressUpdate,
  addressCheck,
} from '../../service';


const {call, put, takeEvery} = effects;


export const addAddress = function* ({address, store, skipCheck, callback}) {
  const {
    cityName,
    countyName,
    detailInfo,
    postalCode,
    provinceName,
    telNumber,
    userName,
    isDefault,
  } = address;
  let check = null;

  yield loading().show('添加中');

  if (skipCheck !== true) {
    const _ = yield call(
      addressCheck,
      provinceName + cityName + countyName + detailInfo,
      store || '',
    );

    check = /\d+/.test(_) ? _ : null;
  }

  if (skipCheck || check === store) {
    // 一切正常
    yield call(
      addressAdd,
      {
        name: userName,
        region: provinceName
          + cityName
          + countyName,
        phone: telNumber,
        postcode: postalCode,
        location_detail: detailInfo,
        is_default: isDefault,
      },
    );
    yield call(getAddress, {store});
    yield loading().hide();
    return callback && callback();
  } else {
    if (check && check !== store) {
      // 不在当前店内 但在其他店内
      yield call(
        addressAdd,
        {
          name: userName,
          region: provinceName
            + cityName
            + countyName,
          phone: telNumber,
          postcode: postalCode,
          location_detail: detailInfo,
          is_default: isDefault,
        },
      );
      yield call(getAddress, {store});
      yield put({
        type: othersTypes.SET_TEMP_STORE_ID,
        storeID: check,
      });
      yield put({
        type: types.SET_ADDRESS_STATUS,
        status: 'out-of-services',
      });
    } else {
      // 不在任何店内 提示是否保存
      yield put({
        type: types.SET_ADDRESS_STATUS,
        status: 'no-services',
      });
    }
  }
  return yield loading().hide();
};


export const getAddress = function* ({store}) {
  yield loading().show('加载中');

  const res = yield call(addressGet, store);

  if (res && res.results)
    yield put({
      type: types.SET_ADDRESS_LIST,
      list: res.results,
    });

  yield loading().hide();
};


export const deleteAddress = function* ({url, store}) {
  yield loading().show('删除中');

  yield call(addressDelete, url);
  yield call(getAddress, {store});

  yield loading().hide();
};


export const updateAddress = function* ({url, address, refetch, store}) {
  yield loading().show('更新中');

  yield call(addressUpdate, url, address);
  if (refetch) yield call(getAddress, {store});

  yield loading().hide();
};


export const addressWatcher = function* () {
  yield takeEvery(types.ADD_ADDRESS_SERVICE, addAddress);
  yield takeEvery(types.GET_ADDRESS_SERVICE, getAddress);
  yield takeEvery(types.DELETE_ADDRESS_SERVICE, deleteAddress);
  yield takeEvery(types.UPDATE_ADDRESS_SERVICE, updateAddress);
};
