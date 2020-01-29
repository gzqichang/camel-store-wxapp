import {request} from './index';


export const searchGetHottest = async () => {
  return await request(
    'hotword',
    {
      data: {
        page: 1,
        page_size: 1000,
      },
    },
  );
};


export const searchGetList = async ({
    store = '',
    query = '',
    next = '',
  }) => {
  return await request(
    next || 'goods',
    {
      data: {
        page_size: 20,
        search: query,
        shop: store,
      },
    },
  );
};


export const searchGetOthers = async ({
    query = '',
    latitude = '',
    longitude = '',
  }) => {
  return await request(
    'search',
    {
      data: {
        page_size: 20,
        keyword: query,
        lat: latitude,
        lng: longitude,
      },
    },
  );
};
