import {request} from './index';
import {hasUserInfo} from '../utils';


export const orderNew = async ({type, data}) => {
  const _ = {
    regular: 'cartbuy',
    subscription: 'buysubgoods',
    credits: 'replace',
  };

  return await request(
    _[type],
    {
      method: 'POST',
      data,
      loginRequired: true,
    },
  );
};


export const orderQRNew = async ({data}) => {
  return await request(
    'qrpay',
    {
      method: 'POST',
      data,
      loginRequired: true,
    },
  );
};


export const orderWechatPay = async (data) => {
  return await request(
    'wechatpay',
    {
      method: 'POST',
      data,
      loginRequired: true,
    },
  );
};

export const payjsConfig = async () => {
  return await request(
    '/api/config/payjsconfig/',
    {
      loginRequired: true,
    },
  );
};

export const orderGetList = async ({orderType, next}) => {
  return await request(
    next || 'order',
    {
      data: {
        status: orderType || '',
        page_size: orderType && orderType === 'paying'
          ? 1000
          : 20,
      },
      loginRequired: true,
    },
  );
};


export const orderGetListCount = async (type) => {
  return await request(
    'order',
    {
      data: {
        page_size: 1,
        status: type,
      },
      loginRequired: true,
    },
  );
};


export const orderUpdate = async (url, data) => {
  return await request(
    url,
    {
      method: 'PUT',
      data,
      loginRequired: true,
    }
  );
};


export const orderCallURL = async (url) => {
  return await request(
    url,
    {
      method: 'POST',
      loginRequired: true,
    },
  );
};


export const orderValidateCart = async ({type, data}) => {
  const _ = {
    regular: 'validate_cart',
    subscription: 'validate_subgoods',
    credits: 'validate_replgoods',
  };

  return await request(
     _[type],
    {
      method: 'POST',
      data,
      loginRequired: hasUserInfo(),
    },
  );
};


export const orderGetExpressInfo = async (url) => {
  return await request(
    url,
    {
      loginRequired: true,
    },
  );
};


export const orderGetStatistics = async () => {
  return await request(
    'order_statistic',
    {
      loginRequired: true,
    },
  );
};


export const orderGetDetail = async (url) => {
  return await request(
    url,
    {
      loginRequired: true,
    },
  );
};


export const orderNewGroup = async (data) => {
  return await request(
    'build_ptgroups',
    {
      method: 'POST',
      data,
      loginRequired: true,
    },
  );
};
