import {request} from './index';
import {hasUserInfo} from '../utils';


export const storeGetCurrent = async ({storeID, addressID, location}) => {
  return await request(
    'near_shop',
    {
      data: {
        shop: storeID || '',
        address: addressID || '',
        location: location || '',
      },
      loginRequired: hasUserInfo(),
    },
  );
};


export const storeGetList = async (location = '') => {
  return await request(
    'shop_list',
    {
      data: {
        page: 1,
        page_size: 1000,
        location,
      },
      loginRequired: hasUserInfo(),
    },
  );
};


export const storeSendFeedback = async (data) => {
  return await request(
    'feedback',
    {
      method: 'POST',
      data,
      loginRequired: true,
    },
  );
};


export const storeGetInfo = async () => {
  return await request('storeinfo');
};
