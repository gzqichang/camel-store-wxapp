import {request} from './index';


export const othersGetFaq = async () => {
  return await request(
    'faq',
    {
      data: {
        page: 1,
        page_size: 1000,
      },
    },
  );
};


export const othersGetMessages = async () => {
  return await request(
    'notice',
    {
      data: {
        page: 1,
        page_size: 1000,
        is_active: true,
      },
    },
  );
};


export const othersGetMemberShipLevels = async () => {
  return await request(
    'level',
    {
      data: {
        page: 1,
        page_size: 1000,
      },
    },
  );
};
