/**
 * VIDEO REDUCER
 */


/**
 * Initial State
 */


export const initState = {
  userInfo: {},
  detail: {
    connectGoods: [],
  },
  category: [],
  videoList: [],
  productList: [],
  store: {},
  isUser: null,
  userVideoList: [],
  userVideoListCount: 0,
};


/**
 * Action Types
 */


export const types = {
  // 用户信息
  SET_VIDEO_USER_INFO: 'SET_VIDEO_USER_INFO',

  // 上传
  UPLOAD_IMAGE_SERVICE: 'UPLOAD_IMAGE_SERVICE',
  UPLOAD_VIDEO_SERVICE: 'UPLOAD_VIDEO_SERVICE',
  
  // 获取好评
  GET_VIDEO_LIST_SERVICE: 'GET_VIDEO_LIST_SERVICE',
  SET_VIDEO_LIST_SERVICE: 'SET_VIDEO_LIST_SERVICE',
  CLEAR_VIDEO_LIST_SERVICE: 'CLEAR_VIDEO_LIST_SERVICE',
  GET_VIDEO_USER_SERVICE: 'GET_VIDEO_USER_SERVICE',
  SET_VIDEO_USER_SERVICE: 'SET_VIDEO_USER_SERVICE',
  CLEAR_VIDEO_USER_SERVICE: 'CLEAR_VIDEO_USER_SERVICE',

  // 设置使用用户视频还是列表
  SET_USER: 'SET_USER',

  // 保存数据
  ADD_VIDEO_DATA: 'ADD_VIDEO_DATA',
  SAVE_VIDEO_DATA: 'SAVE_VIDEO_DATA',
  SET_VIDEO_DATA: 'SET_VIDEO_DATA',
  CONNECT_VIDEO_GOODS: 'CONNECT_VIDEO_GOODS',

  // 商品列表
  GET_VIDEO_CATEGORY_SERVICE: 'GET_VIDEO_CATEGORY_SERVICE',
  SET_VIDEO_CATEGORY: 'SET_VIDEO_CATEGORY',
  GET_VIDEO_PRODUCT_LIST_SERVICE: 'GET_VIDEO_PRODUCT_LIST_SERVICE',
  SET_VIDEO_PRODUCT_LIST: 'SET_VIDEO_PRODUCT_LIST',

  // 获取单个视频和列表
  GET_VIDEO_DETAIL_LIST: 'GET_VIDEO_DETAIL_LIST',

  // 更换门店
  SET_VIDEO_STORE: 'SET_VIDEO_STORE',
};


/**
 * Action Functions
 */


export const actions = {
  getVideoCategoryService: ({store, callback}) => ({
    type: types.GET_VIDEO_CATEGORY_SERVICE,
    store,
    callback,
  }),

  setUserInfo: ({payload}) => ({
    type: types.SET_VIDEO_USER_INFO,
    payload,
  }),

  setUser: ({isUser}) => ({
    type: types.SET_USER,
    isUser,
  }),

  getVideoDetailService: ({url, callback}) => ({
    type: types.GET_VIDEO_DETAIL_LIST,
    url,
    callback,
  }),

  getShortVideoService: ({reload, next, pageSize = 20, callback}) => ({
    type: types.GET_VIDEO_LIST_SERVICE,
    reload,
    next,
    pageSize,
    callback,
  }),

  getShortVideoUserService: ({user, next, callback}) => ({
    type: types.GET_VIDEO_USER_SERVICE,
    user,
    next,
    callback,
  }),

  saveShortVideoData: ({data, callback}) => ({
    type: types.SAVE_VIDEO_DATA,
    data,
    callback,
  }),

  changeVideoStore: ({store}) => ({
    type: types.SET_VIDEO_STORE,
    store,
  }),

  addVideo: ({data, callback}) => ({
    type: types.ADD_VIDEO_DATA,
    data,
    callback,
  }),

  getVideoProductListService: ({
    storeID,
    category,
    next,
    callback,
  } = {}) => ({
    type: types.GET_VIDEO_PRODUCT_LIST_SERVICE,
    storeID,
    category,
    next,
    callback,
  }),
};


/**
 * Reducer
 */


/* eslint-disable camelcase */
export const video = (state = initState, action) => {
  const {payload} = action;

  switch (action.type) {
    case types.SET_VIDEO_CATEGORY:
      return Object.assign({}, state, {
        category: action.category,
      });

    case types.SET_USER:
      const {isUser} = action;
      return Object.assign({}, state, {
        isUser,
      });

    case types.SET_VIDEO_USER_INFO:
      return Object.assign({}, state, {
        userInfo: payload,
      });

    case types.SET_VIDEO_LIST_SERVICE:
      if (
        action.videoList.length <= 0
        && action.reload !== true
      ) return state;

      const {videoList} = action;
      if (action.reload === true)
        return Object.assign({}, state, {
          videoList,
        });

      return Object.assign({}, state, {
        videoList: [...state.videoList, ...videoList],
      });

    case types.CLEAR_VIDEO_LIST_SERVICE:
      return Object.assign({}, state, {
        videoList: [],
      });

    case types.SET_VIDEO_USER_SERVICE:
      const {userVideo, userVideoList, userVideoListCount} = action;

      const _userVideo = {...state.userVideo, ...userVideo};

      return Object.assign({}, state, {
        userVideoList: [...state.userVideoList, ...userVideoList],
        userVideoListCount,
        userVideo: _userVideo,
      });

    case types.CLEAR_VIDEO_USER_SERVICE:
      return Object.assign({}, state, {
        userVideoList: [],
        userVideoListCount: 0,
      });

    case types.SET_VIDEO_DATA:
      const {data} = action;
      return Object.assign({}, state, {
        detail: {...state.detail, ...data},
      });

    case types.SET_VIDEO_PRODUCT_LIST:
      let _ = [
        ...state.productList,
        ...action.list,
      ];
      // If reload equals true then clear the previews data
      if (action.reload === true)
        _ = [...action.list];

      let dict = {};
      let indexing = [];
      _.map((item) => {
        const {id, model_type} = item;
        dict[model_type + id] = item;
        if (!indexing.includes(model_type + id))
          indexing.push(model_type + id);
      });
      let list = [];
      for (let keyName of indexing) {
        if (dict[keyName])
          list.push(dict[keyName]);
      }
      return Object.assign({}, state, {productList: list});

    case types.CLEAR_PRODUCT_LIST:
      return Object.assign({}, state, {productList: []});

    case types.SET_VIDEO_STORE:
      const {store} = action;
      return Object.assign({}, state, {
        store,
      });

    default:
      return state;
  }
};
