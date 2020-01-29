import wepy from 'wepy';
import {prefixUri, request} from './index';

export const uploadVideo = async ({video}) => {
  const session = wepy.getStorageSync('session');

  const _name = new Date().getTime();

  return new Promise((resolve, reject) => {
    wepy.uploadFile({
      url: prefixUri('/api/image/picture/'),
      filePath: video,
      name: 'video',
      header: {
        Authorization: `session ${session}`,
      },
      formData: {
        'label': _name,
      },
      success (res) {
        if (res.statusCode === 201)
          resolve(JSON.parse(res.data));
        else
          reject(res);
      },
      fail: (res) => reject(res),
    });
  });
};

export const uploadImage = async ({image}) => {
  const session = wepy.getStorageSync('session');

  const _name = new Date().getTime();

  return new Promise((resolve, reject) => {
    wepy.uploadFile({
      url: prefixUri('/api/image/picture/'),
      filePath: image,
      name: 'image',
      header: {
        Authorization: `session ${session}`,
      },
      formData: {
        'label': _name,
      },
      success (res) {
        if (res.statusCode === 201)
          resolve(JSON.parse(res.data));
        else
          reject(res);
      },
      fail: (res) => reject(res),
    });
  });
};

export const getVideoList = async ({next, page_size}) => {
  return await request(
    next || 'shortvide',
    {
      data: next
        ? {}
        : {
          page: 1,
          page_size,
        },
    },
  );
};

export const getVideoDetail = async ({url}) => {
  return await request(
    url,
  );
};

export const uploadVideoData = async (data) => {
  const session = wepy.getStorageSync('session');
  const {video, goods = [], title} = data;
  const _goods = goods ? JSON.stringify(goods) : '';

  return new Promise((resolve, reject) => {
    wepy.uploadFile({
      url: prefixUri('/api/video/video/'),
      filePath: video,
      name: 'video',
      header: {
        Authorization: `session ${session}`,
      },
      formData: {
        title,
        goods: _goods,
      },
      success (res) {
        if (res.statusCode === 201)
          resolve(JSON.parse(res.data));
        else
          reject(res);
      },
      fail: (res) => {
        console.warn(res);
        reject(res);
      },
    });
  });
};

export const getVideoPersonList = async ({next, user}) => {
  return await request(
    next || 'video_personal',
    {
      data: {
        page: 1,
        page_size: 20,
        user,
      },
      loginRequired: true,
    },
  );
};
