import wepy from 'wepy';


export {default as Calendar} from './Calendar';


export const loading = () => ({
  show: (title = '加载中') => {
    wepy.showLoading({
      title,
      mask: true,
    });
  },
  hide: () => {
    wepy.hideLoading();
  },
});


export const showToast = (title = '', icon = 'none') => {
  wepy.showToast({
    title,
    icon,
  });
};


export const showModal = (fields) => {
  wepy.showModal({
    ...fields,
  });
};


export const go2page = () => ({
  switch: (url) => {
    wepy.switchTab({url});
  },
  redirect: (url) => {
    wepy.redirectTo({url});
  },
  navigate: (url) => {
    wepy.navigateTo({url});
  },
  back: (delta = 1) => {
    wepy.navigateBack({delta});
  },
});


export const storage = () => ({
  setStorageSync: (key, data) => {
    try {
      wepy.setStorageSync(key, data);
    } catch (e) {
      console.error('ERR: Persistence Error during Saving: ', e);
    }
  },

  getStorageSync: (key) => {
    try {
      return wepy.getStorageSync(key);
    } catch (e) {
      console.error('ERR: Persistence Error during Getting: ', e);
    }
  },
});


export const parse2Float = (num) => (
  (num * 1).toFixed(2)
  // isNaN(parseInt(String(parseFloat(String(num)))))
  //   ? 0
  //   : `${parseInt(String(parseFloat(String(num))))}.${
  //   (num + '0.00').replace(/(\d)*\./, '').replace('.', '')
  //     .slice(0, 2)}`
);


export const parseTime = (date) => {
  if (!(date instanceof Date)) return;

  const parse = (time) => (
    String(time).length <= 2 && String(time)[1] === undefined
      ? `0${time}`
      : time
  );

  return (
    date.getFullYear()
    + '-'
    + parse(date.getMonth() + 1)
    + '-'
    + parse(date.getDate())
    + ' '
    + parse(date.getHours())
    + ':'
    + parse(date.getMinutes())
    + ':'
    + parse(date.getSeconds())
  );
};


export const unPackImageField = (obj) => {
  const unPack = (item) => (
    item && item.image && item.image.file
      ? {...item, image: item.image.file}
      : item
  );

  const checkSub = (item) => {
    if (!item) return;
    if (typeof item !== 'string')
      Object.keys(item).map(
        (key) => {
          if (item[key] && item[key].map)
            item[key] = item[key].map(unPackImageField);
          item[key] = unPack(item[key]);
        }
      );
    return unPack(item);
  };

  return obj && Array.isArray(obj)
    ? obj.map(unPackImageField)
    : checkSub(obj);
};


export const line2Hump = (obj) => {
  let newObj = {};
  let parse = (t) => (t.replace(/_(\w)/g, (_, l) => (l.toUpperCase())));

  Object.keys(obj).map(
    (key) => {
      newObj[parse(key)] = obj[key];
    }
  );

  return newObj;
};


export const hasUserInfo = () => {
  const session = storage().getStorageSync('session');
  return Boolean(session);
};


let _callback = () => {};


export const checkUserInfo = (callback) => {
  if (callback) _callback = callback;

  const _hasUserInfo = hasUserInfo();
  if (!_hasUserInfo)
    go2page().navigate('/pages/util/permissions');
  return _hasUserInfo;
};


export const permissionCallback = () => ({
  set: (callback) => {
    if (callback)
      _callback = callback;
    else
      _callback = () => {};
    return permissionCallback();
  },
  run: (callback) => {
    if (_callback) _callback();
    if (callback) callback();
    return permissionCallback();
  },
});

export const checkIOS = () => {
  const res = wx.getSystemInfoSync();
  return res.system.includes('iOS');
};
