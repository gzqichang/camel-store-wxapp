import {request} from './index';


export const configGet = async () => {
  return await request(
    'config',
    {
      data: {
        page: 1,
        page_size: 1000,
      },
    },
  );
};
