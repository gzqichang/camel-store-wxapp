import wepy from 'wepy';
import {effects} from 'redux-saga';

import {showToast} from '../../utils';
import {types} from './index';


const {put, takeEvery} = effects;

const updatePermissions = function* ({callback}) {
  let permissions = null;

  /* eslint-disable prefer-promise-reject-errors */
  yield new Promise((resolve, reject) => {
    wepy.getSetting({
      success: ({authSetting}) => {
        permissions = Object.keys(authSetting)
          .filter((item) => (authSetting[item]));
        resolve();
      },
      fail: (res) => {
        console.error('ERR: wepy.getSetting with error: ', res);
        showToast('小程序获取权限信息失败，请稍后重试');
        reject();
      },
    });
  });

  if (permissions) {
    yield put({
      type: types.SET_PERMISSIONS,
      permissions,
    });
    callback && callback();
  }
};


export const systemWatcher = function* () {
  yield takeEvery(types.UPDATE_PERMISSIONS_SERVICE, updatePermissions);
};
