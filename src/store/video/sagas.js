import {effects} from 'redux-saga';

import {types} from './index';
import {types as otherTypes} from '../others';
import {productListParser} from '../product/helper';
import {
  loading,
  unPackImageField,
} from '../../utils/index';
import {
  uploadImage,
  uploadVideo,
  getVideoList,
  getVideoDetail,
  uploadVideoData,
  getVideoPersonList,
  productGetList,
  productGetCategory,
} from '../../service';
import {
  showToast,
} from '../../utils';

const {call, put, takeEvery} = effects;


export const _uploadImage = function* (action) {
  const {image, callback} = action;

  loading().show('上传中');

  let res = yield call(uploadImage, {video: image});

  // for (let img of image)
  //   res.push(yield call(uploadImage, {image: img}));

  callback && callback(res);

  loading().hide();
};


export const _uploadVideo = function* (action) {
  const {video, callback} = action;

  loading().show('上传中');

  let res = yield call(uploadVideo, {video: video});

  callback && callback(res);

  loading().hide();
};


export const getVideoService = function* (action) {
  const {reload, next, pageSize, callback} = action;

  yield loading().show('加载中');

  const res = yield call(getVideoList, {next, page_size: pageSize});

  yield loading().hide();

  if (res) {
    const list = res.results.map(item => {
      if (item.goods && item.goods.length) {
        item.goods.map(x => {
          x.cover = x.banner && x.banner.image && x.banner.image.file;
        });
      } else {
        item.goods = item.goods || [];
      }

      return {...item};
    });

    if (reload) {
      yield put({
        type: types.CLEAR_VIDEO_LIST_SERVICE,
      });
    }

    yield put({
      type: types.SET_VIDEO_LIST_SERVICE,
      videoList: list,
    });

    yield put({
      type: otherTypes.UPDATE_NEXT_URL,
      url: res.next || '',
      key: 'videoList',
    });
  }

  callback && callback();
};

export const getVideoDetailService = function* (action) {
  const {url, callback} = action;

  yield put({
    type: types.CLEAR_VIDEO_LIST_SERVICE,
  });

  const res = yield call(getVideoDetail, {url});

  if (res.id) {
    if (res.goods && res.goods.length) {
      res.goods.map(x => {
        x.cover = x.banner && x.banner.image && x.banner.image.file;
      });
    } else {
      res.goods = res.goods || [];
    }
    yield put({
      type: types.SET_VIDEO_LIST_SERVICE,
      videoList: [res],
    });
  } else {
    showToast(res);
  }

  // yield call(getVideoService, {reload: false});

  callback && callback();
};

export const getVideoUserService = function* (action) {
  const {userInfo, user, next, callback} = action;

  yield loading().show('加载中');

  const res = yield call(getVideoPersonList, {user, next});

  yield loading().hide();

  if (!res.results) {
    showToast(res);
    return;
  }

  if (res) {
    if (user) {
      yield put({
        type: types.CLEAR_VIDEO_USER_SERVICE,
      });
    }
    const list = res.results.map(item => {
      if (item.goods && item.goods.length) {
        item.goods.map(x => {
          x.cover = x.banner && x.banner.image && x.banner.image.file;
        });
      } else {
        item.goods = item.goods || [];
      }

      return {...item};
    });

    yield put({
      type: types.SET_VIDEO_USER_SERVICE,
      userVideoList: list,
      userVideoListCount: res.count,
      userVideo: userInfo,
    });

    yield put({
      type: otherTypes.UPDATE_NEXT_URL,
      url: res.next || '',
      key: 'videoUserList',
    });
  }

  callback && callback();
};


export const addVideoData = function* ({callback, data} = {}) {
  yield loading().show('添加中');

  const res = yield call(uploadVideoData, data);
  yield loading().hide();

  if (!res.video) {
    showToast(res);
    return;
  }

  yield put({
    type: types.SET_VIDEO_DATA,
    data: {connectGoods: [], video: null},
  });

  callback && callback(res);
};


export const saveVideoData = function* ({callback, data} = {}) {
  yield put({
    type: types.SET_VIDEO_DATA,
    data,
  });
  callback && callback();
};


export const getProductList = function* (action = {}) {
  const {
    storeID,
    category,
    next,
    isGrouping = '',
    keyword = '',
    productType = '',
    recommendation = '',
    callback,
    withloading = true,
  } = action;

  if (withloading)
    loading().show('加载中');

  const res = unPackImageField(
    yield call(productGetList, {
      store: storeID,
      isGrouping,
      productType,
      category,
      keyword,
      recommendation,
      next,
    }));

  let list = [];

  if (res && res.results) {
    list = productListParser(res.results);

    list = list.reduce((result, current) => {
      const {_product: {gtypes = []}} = current;
      let minCredit = 0;
      let minMoney = 0;

      gtypes.map(({rebate, bonus}) => {
        const _rebate = Number(rebate);
        const _bonus = Number(bonus);

        if (!isNaN(_rebate)
          && (_rebate < minCredit || minCredit === 0))
          minCredit = _rebate;

        if (!isNaN(_bonus)
          && (_bonus < minMoney || minMoney === 0))
          minMoney = _bonus;
      });

      current._minMoney = minMoney;
      current._minCredit = minCredit;

      result.push(current);

      return result;
    }, []);

    yield put({
      type: types.SET_VIDEO_PRODUCT_LIST,
      list,
      reload: !next,
    });

    yield put({
      type: otherTypes.UPDATE_NEXT_URL,
      url: res.next || '',
      key: category
        ? `videoProductList_${category}`
        : 'videoProductList',
    });
  }

  callback && callback();

  if (withloading)
    loading().hide();
};


export const getCategory = function* (action = {}) {
  const {store, callback} = action;

  // loading().show('加载中');

  const res = yield call(productGetCategory, store);

  let category = [];

  if (res && res.results)
    category = unPackImageField(res.results);

  yield put({
    type: types.SET_VIDEO_CATEGORY,
    category,
  });

  callback && callback(res.results);
  // loading().hide();
};


export const videoWatcher = function* () {
  yield takeEvery(types.UPLOAD_IMAGE_SERVICE, _uploadImage);
  yield takeEvery(types.UPLOAD_VIDEO_SERVICE, _uploadVideo);
  yield takeEvery(types.GET_VIDEO_LIST_SERVICE, getVideoService);
  yield takeEvery(types.GET_VIDEO_DETAIL_LIST, getVideoDetailService);
  yield takeEvery(types.GET_VIDEO_USER_SERVICE, getVideoUserService);
  yield takeEvery(types.ADD_VIDEO_DATA, addVideoData);
  yield takeEvery(types.SAVE_VIDEO_DATA, saveVideoData);
  yield takeEvery(types.GET_VIDEO_PRODUCT_LIST_SERVICE, getProductList);
  yield takeEvery(types.GET_VIDEO_CATEGORY_SERVICE, getCategory);
};
