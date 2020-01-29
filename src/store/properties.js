export const APP_VERSION = '3.8.1';


export const CUSTOMIZED_FIELDS_MAPPING = {
  attach_type: 'type',
  label: 'name',
  help_text: 'placeholder',
  is_required: 'required',
  length: 'length',
  min_value: 'minimum',
  max_value: 'maximum',
  index: 'index',
  id: 'id',
  option: 'options',
};


export const ORDER_STATUS_INFO = {
  paying: '待付款',
  groupbuy: '拼团中',
  'has paid': '待发货',
  serving: '服务中',
  receiving: '待收货',
  done: '交易成功',
  close: '交易关闭',
};


export const DELIVERY_INFO = {
  own: '商家配送',
  express: '快递',
  buyer: '自提',
};


export const DELIVERY_TYPES = {
  buyer: 'self',
  own: 'merchant',
  express: 'express',
};


export const DELIVERY_TYPES_INFO = {
  [DELIVERY_TYPES.buyer]: '自提',
  [DELIVERY_TYPES.own]: '商家配送',
  [DELIVERY_TYPES.express]: '快递',
};


export const ORDER_STATUS = [
  'paying',
  'groupbuy',
  'has paid',
  'serving',
  'receiving',
  'done',
  'close',
];


export const PERMISSION_SCOPE = {
  // 是否授权用户信息，对应接口 wx.getUserInfo
  userInfo: 'scope.userInfo',

  // 是否授权地理位置，对应接口 wx.getLocation, wx.chooseLocation
  userLocation: 'scope.userLocation',

  // 是否授权通讯地址，对应接口 wx.chooseAddress
  address: 'scope.address',

  // 是否授权发票抬头，对应接口 wx.chooseInvoiceTitle
  invoiceTitle: 'scope.invoiceTitle',

  // 是否授权获取发票，对应接口 wx.chooseInvoice
  invoice: 'scope.invoice',

  // 是否授权微信运动步数，对应接口 wx.getWeRunData
  werun: 'scope.werun',

  // 是否授权录音功能，对应接口 wx.startRecord
  record: 'scope.record',

  // 是否授权保存到相册 wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum
  writePhotosAlbum: 'scope.writePhotosAlbum',

  // 是否授权摄像头，对应<camera /> 组件
  camera: 'scope.camera',
};


export const _TYPES = {
  regular: 'regular',
  subscription: 'subscription',
  credits: 'credits',
  offline: 'offline',
};


export const PRODUCT_TYPES = {
  [_TYPES.regular]: 'ord',
  [_TYPES.subscription]: 'sub',
  [_TYPES.credits]: 'replace',
};


export const PRODUCT_FIELD_NAMES = {
  [_TYPES.regular]: 'ord_goods',
  [_TYPES.subscription]: 'sub_goods',
  [_TYPES.credits]: 'repl_goods',
};


export const ORDER_TYPES = {
  [_TYPES.regular]: 'ord',
  [_TYPES.subscription]: 'sub',
  [_TYPES.credits]: 'repl',
  [_TYPES.offline]: 'qrpay',
};


export const ORDER_FIELD_NAMES = {
  [_TYPES.regular]: 'ord_goods_info',
  [_TYPES.subscription]: 'sub_goods_info',
  [_TYPES.credits]: 'repl_goods_info',
};


export const MODULE_NAME = {
  grouping: '接龙拼团',
  periodic: '周期购',
  recommendation: '热门推荐',
  credit: '积分换购',
};


export const CONFIG_KEYS = {
  enableShare: 'enableShare',
  enableSharingProfit: 'enableSharingProfit',
  enableDistributionRelations: 'enableDistributionRelations',
  enableCarts: 'enableCarts',
  enableRicherLandingPage: 'enableRicherLandingPage',
  enableWallet: 'enableWallet',
  systemVersion: 'systemVersion',
  distributionPoster: 'distributionPoster',
  showCopyright: 'showCopyright',
  enableSubscription: 'enableSubscription',
  storeType: 'storeType',
  enableVideo: 'enableVideo',
  enableInvoice: 'enableInvoice',
  enablePayJs: 'enablePayJs',
};


export const GLOBAL_CONFIG = {
  [CONFIG_KEYS.enableShare]: 'share_switch',
  [CONFIG_KEYS.enableSharingProfit]: 'rebate_switch',
  [CONFIG_KEYS.enableDistributionRelations]: 'bonus_switch',
  [CONFIG_KEYS.enableCarts]: 'cart_switch',
  [CONFIG_KEYS.enableRicherLandingPage]: 'tradition_home',
  [CONFIG_KEYS.enableWallet]: 'wallet_switch',
  [CONFIG_KEYS.enableSubscription]: 'subscription_switch',
  [CONFIG_KEYS.systemVersion]: 'version',
  [CONFIG_KEYS.distributionPoster]: 'store_poster',
  [CONFIG_KEYS.showCopyright]: 'show_copyright',
  [CONFIG_KEYS.storeType]: 'store_type',
  [CONFIG_KEYS.enableVideo]: 'video_switch',
  [CONFIG_KEYS.enableInvoice]: 'invoice_switch',
  [CONFIG_KEYS.enablePayJs]: 'person_pay_switch',
};
