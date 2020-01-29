import {request} from './index';


export const addressAdd = async (data) => {
  return await request(
    'address',
    {
      method: 'POST',
      data,
      loginRequired: true,
    },
  );
};


export const addressGet = async (store = '') => {
  return await request(
    'address',
    {
      data: {
        page: 1,
        page_size: 1000,
        shop: store,
      },
      loginRequired: true,
    },
  );
};


export const addressDelete = async (url) => {
  return await request(
    url,
    {
      method: 'DELETE',
      loginRequired: true,
    },
  );
};


export const addressUpdate = async (url, address) => {
  return await request(
    url,
    {
      method: 'PUT',
      data: address,
      loginRequired: true,
    },
  );
};


export const addressCheck = async (address, shop) => {
  return await request(
    'is_range',
    {
      data: {
        address,
        shop,
      },
      loginRequired: true,
    },
  );
};
