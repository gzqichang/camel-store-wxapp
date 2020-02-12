/**
 * CONFIGURATION REDUCER
 */


/**
 * Initial State
 */


export const initState = {
  showCards: false,                   // 全部TAB 是否显示卡片视图
  showFeedback: true,                 // 切换 在线客服 或 反馈客服
  enableRicherLandingPage: true,      // 是否启用更丰富的首页形式
  enableSharingProfit: true,          // 分享返利开关
  enableDistributionRelations: true,  // 分销关系开关
  enableCarts: true,                  // 购物车功能开关 (not-used)
  enableShare: true,                  // 分享功能开关
  enableSubscription: false,          // 订阅功能开关
  machineCode: '',                    // 打印机终端码
  enableWallet: true,                 // 会员钱包功能开关 (not-used)
  systemVersion: '1.0.0',             // 当前接口版本
  distributionPoster: '',             // 海报图片地址
  storeType: 'cloud',                 // 店铺的类型 云店 或 小店
  showCopyright: true,                // 是否显示版权信息
  enableVideo: true,                  // 是否显示好评
  enableInvoice: false,                // 是否开发票
  enablePayJs: false,                  // 是否使用个人账号支付
};


/**
 * Action Types
 */


export const types = {
  GET_CONFIG_SERVICE: 'GET_CONFIG_SERVICE',
  SET_CONFIG: 'SET_CONFIG',
};


/**
 * Action Functions
 */


export const actions = {
  setConfig: ({payload} = {}) => ({
    type: types.SET_CONFIG,
    payload,
  }),
};


/**
 * Reducer
 */


export const config = (state = initState, action) => {
  switch (action.type) {
    case types.SET_CONFIG:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
};
