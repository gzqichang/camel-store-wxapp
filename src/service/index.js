import wepy from 'wepy';

import {userGetCode, userWxLogin} from './user';

export const baseUrl = 'http://camelstore.dev.com:8080';


const debug = true;

const reTryTime = 2;

let sitemap = null;


const stdOut = (title, ...content) => {
  const {platform} = wepy.getSystemInfoSync();
  if (platform === 'devtools') {
    console.groupCollapsed(title);
    console.info(...content);
    console.groupEnd();
  } else {
    console.info(title, ...content);
  }
};


export const prefixUri = (url) => {
  return /[a-zA-z]+:\/\/[^\s]*/.test(url)
    ? url
    : baseUrl + url;
};


// Don't use this method elsewhere unless it's absolute necessary.


export const getSitemap = async () => {
  let data = null;

  debug && stdOut('Request: sitemap');

  await new Promise(
    (resolve) => {
      wepy.request({
        url: `${baseUrl}/api/sitemap/`,
        success: (res) => {
          if (res)
            data = res.data;
          debug && stdOut('Response: sitemap', res);
          resolve();
        },
      });
    },
  );

  return data;
};


// Re-Auth Process


const reAuth = async () => {
  debug && stdOut('Auth: Trying Re-Auth');

  const code = await userGetCode();
  const login = await userWxLogin(code);

  if (login && login.session) {
    wepy.setStorageSync('session', login.session);
    debug && stdOut('Auth: Re-Auth Done');
    return true;
  } else {
    debug && stdOut('Auth: Re-Auth Error');
    return false;
  }
};


 /*
  * @params:
  *   url <string>
  *   requestData <object> (optional)
  *
  * @return:
  *   Promise Object
  *
  * @example:
  *   request('wx_login')                  // match for the api sitemap.
  *   request('http://x.yz/')              // match certain url address.
  *   request('url', {data: {foo: 'bar'}}) // with options.
  */


export const request = async (url, requestData = {}) => {
  let data = null;
  let reTryCount = reTryTime;
  let {
    header = {},
    loginRequired = false,
    reTry = true,
  } = requestData;

  if (!sitemap)
    sitemap = await getSitemap();

  let _url = sitemap[url]
    ? sitemap[url]
    : (
      /[a-zA-z]+:\/\/[^\s]*/.test(url)
        ? url
        : prefixUri(url)
    );

  const session = wepy.getStorageSync('session');

  if (loginRequired && session) {
    await new Promise(
      (resolve, reject) => {
        wepy.checkSession({
          success: () => {
            header = {
              ...header,
              Authorization: `session ${session}`,
            };
            resolve();
          },
          fail: async () => {
            const isSucceed = await reAuth();

            if (isSucceed) {
              const session = wepy.getStorageSync('session');
              header = {
                ...header,
                Authorization: `session ${session}`,
              };
              resolve();
            } else {
              /* eslint-disable prefer-promise-reject-errors */
              reject();
            }
          },
        });
      }
    );
  }

  const finParams = {
    url: _url,
    ...requestData,
    header,
  };

  if (!_url) {
    debug && console.error(
      'Looks like it\'s something wrong with the API: ', url);
    return;
  }

  debug && stdOut(`Request: ${url}`, finParams);

  while (data === null && reTryCount > 0) {
    await new Promise(
      (resolve) => {
        wepy.request({
          ...finParams,
          success: async (res) => {
            if (res) {
              if (/2[\d{2}]/.test(res.statusCode)) {
                data = res.data;
                debug && stdOut(`Response: ${url}`, res);
              } else {
                debug && stdOut(`Response with Error: ${url}`, res);

                if (
                  /String/.test(Object.prototype.toString.call(res.data))
                  && [400].includes(res.statusCode)
                ) {
                  data = res.data;
                  resolve();
                }

                if (reTry && [403, 404].includes(res.statusCode)) {
                  debug && stdOut(`Re-Trying: ${url}`);

                  const isSucceed = await reAuth();

                  if (isSucceed)
                    data = request(url, {...requestData, reTry: false});
                }
              }
            }
            resolve();
          },
        });
      },
    );

    reTryCount -= 1;

    if (reTry) break;
  }

  return data;
};


export {
  userGetCode,
  userWxLogin,
};


export {
  userGetInfo,
  userGetLog,
  userGetCreditLog,
  userUpdateInfo,
  userNewWithdraw,
  userGetPartners,
  userGetTopUpTypes,
  userNewTopUp,
  userUpdatePhone,
} from './user';


export {
  productGetCategory,
  productGetBanner,
  productGetDetail,
  productGetList,
  productGetPoster,
  productGetGroupsInfo,
} from './product';


export {
  searchGetHottest,
  searchGetList,
  searchGetOthers,
} from './search';


export {
  orderNew,
  orderUpdate,
  orderWechatPay,
  orderGetList,
  orderGetListCount,
  orderCallURL,
  orderValidateCart,
  orderGetExpressInfo,
  orderGetDetail,
  orderNewGroup,
  orderGetStatistics,
  orderQRNew,
  payjsConfig,
} from './order';


export {
  othersGetFaq,
  othersGetMessages,
  othersGetMemberShipLevels,
} from './others';


export {
  addressGet,
  addressAdd,
  addressUpdate,
  addressDelete,
  addressCheck,
} from './address';


export {
  configGet,
} from './config';


export {
  homeGetCarousel,
  homeGetShortcut,
  homeGetModules,
} from './home';


export {
  storeGetCurrent,
  storeGetList,
  storeSendFeedback,
  storeGetInfo,
} from './store';

export {
  uploadVideo,
  uploadImage,
  getVideoList,
  getVideoDetail,
  uploadVideoData,
  getVideoPersonList,
} from './video';
