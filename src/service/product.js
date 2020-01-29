import wepy from 'wepy';
import {request} from './index';
import {hasUserInfo} from '../utils';


export const productGetCategory = async (storeID) => {
  return await request(
    'category',
    {
      data: {
        page: 1,
        page_size: 1000,
        shop: storeID,
      },
    },
  );
};


export const productGetBanner = async (storeID) => {
  return await request(
    'banner',
    {
      data: {
        page: 1,
        page_size: 1000,
        shop: storeID,
      },
    },
  );
};


export const productGetDetail = async (url) => {
  let rs = {};
  if (url)
    rs = await request(
      url,
      {
        loginRequired: hasUserInfo(),
      }
    );
  return rs;
};


export const productGetList = async ({
    store,
    category = '',
    next = '',
    isGrouping = '',
    productType = '',
    keyword = '',
    recommendation = '',
    pageSize = 20,
  }) => {
  return await request(
    next || 'goods',
    {
      data: next
        ? {}
        : {
          page_size: pageSize,
          category,
          shop: store,
          search: keyword,
          groupbuy: isGrouping,
          model_type: productType,
          recommendation,
        },
      loginRequired: hasUserInfo(),
    },
  );
};


export const productGetPoster = async (url) => {
  const session = wepy.getStorageSync('session');

  return await new Promise(
    (resolve) => {
      wepy.downloadFile({
        url,
        header: {
          Authorization: `session ${session}`,
        },
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          console.error(err);
        },
      });
    },
  );
};


export const productGetGroupsInfo = async (product) => {
  return await request(
    'ptgroup',
    {
      data: {
        page: 1,
        page_size: 1000,
        ptgoods: product,
      },
      loginRequired: hasUserInfo(),
    },
  );
};
