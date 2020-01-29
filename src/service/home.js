import {request} from './index';


export const homeGetCarousel = async ({store}) => {
  return await request(
    'homebanner',
    {
      data: {
        shop: store,
      },
    },
  );
};


export const homeGetShortcut = async ({store}) => {
  return await request(
    'shortcut',
    {
      data: {
        shop: store,
      },
    },
  );
};


export const homeGetModules = async ({store}) => {
  return await request(
    'module',
    {
      data: {
        shop: store,
      },
    },
  );
};
