import wepy from 'wepy';

import {request} from './index';


export const userGetCode = async () => {
  let code = '';

  return await new Promise(
    (resolve) => {
      wepy.login({
        success: (res) => {
          if (res)
            code = res.code;
          resolve(code);
        },
      });
    }
  );
};


export const userWxLogin = async (code) => {
  return await request(
    'wx_login',
    {
      method: 'POST',
      data: {code},
    },
  );
};


export const userGetInfo = async () => {
  return await request(
    'wx_userinfo',
    {
      loginRequired: true,
    },
  );
};


export const userGetLog = async ({user, next}) => {
  return await request(
    next || `/api/wxuser/userinfo/${user}/account_logs/`,
    {
      data: {
        page_size: 100,
      },
      loginRequired: true,
    },
  );
};


export const userGetCreditLog = async ({user, next}) => {
  return await request(
    next || `/api/wxuser/userinfo/${user}/credit_logs/`,
    {
      data: {
        page_size: 100,
      },
      loginRequired: true,
    },
  );
};


export const userNewWithdraw = async ({amount, wx_code}) => {
  return await request(
    'create_withdrawal',
    {
      method: 'POST',
      data: {
        amount,
        wx_code,
      },
      loginRequired: true,
    },
  );
};


export const userUpdateInfo = async (data) => {
  return await request(
    'wx_userinfo',
    {
      method: 'POST',
      data,
      loginRequired: true,
    },
  );
};


export const userUpdatePhone = async (data) => {
  return await request(
    'wx_user_phone',
    {
      method: 'POST',
      data,
      loginRequired: true,
    },
  );
};


export const userGetPartners = async () => {
  return await request(
    'wx_user_referrals',
    {
      data: {
        page_size: 1000,
      },
      loginRequired: true,
    },
  );
};


export const userGetTopUpTypes = async () => {
  return await request(
    'rechargetype',
    {
      data: {
        page_size: 1000,
      },
    },
  );
};


export const userNewTopUp = async (amount) => {
  return await request(
    'recharge',
    {
      method: 'POST',
      data: {
        amount,
      },
      loginRequired: true,
    }
  );
};
