关于前端数据模型
===

> 状态（数据）划分

```js

const state = {
  // 地址相关数据
  address: {
    current: 1,            // <ID>     保存当前地址的 ID 值
    list: [],              // <List>   全部地址列表
    status: '',            // <String> 地址模型的状态，用于控制弹窗及跳转逻辑
                           // oneOf:
                           //   out-of-services  [不在当前店的配送范围]
                           //   no-services      [不在所有店的配送范围]
                           //   ''               [正常]
  },


  // 配置类信息
  config: {
    showCards: false,                  // <Boolean> 全部 TAB 是否显示卡片视图
    showFeedback: true,                // <Boolean> 切换 在线客服 或 反馈客服
    enableRicherLandingPage: true,     // <Boolean> 是否启用更丰富的首页形式
    enableSharingProfit: true,         // <Boolean> 分享返利开关
    enableDistributionRelations: true, // <Boolean> 分销关系开关
    enableCarts: true,                 // <Boolean> 购物车功能开关 (not-used)
    enableShare: true,                 // <Boolean> 分享功能开关
    enableSubscription: false,         // <Boolean> 订阅功能开关
    machineCode: '',                   // <String>  打印机终端码
    enableWallet: true,                // <Boolean> 会员钱包功能开关 (not-used)
    systemVersion: '1.0.0',            // <String>  当前接口版本
    distributionPoster: '',            // <String>  海报图片地址
    storeType: 'cloud',                // <String>  店铺的类型 云店 或 小店
    showCopyright: true,               // <Boolean> 是否显示版权信息
  },


  // 更丰富的首页相关的内容
  home: {
    grouping: [],          // <List> 首页的拼团商品
    periods: [],           // <List> 首页的订阅商品
    recommended: [],       // <List> 首页的推荐商品
    credits: [],           // <List> 首页的积分商品
    carousel: [],          // <List> 首页的轮播
    shortcut: [],          // <List> 首页的快速入口
    modules: {},           // <List> 首页的模块开关
  },


  // 订单内容
  order: {
    sharedUser: 1,         // <ID>   分享用户的 ID （由谁的分享进来的）
    sharedProduct: 1,      // <ID>   分享商品的 ID （分享的商品是什么）
    sharedGroup: 1,        // <ID>   分享拼团的 ID （分享的是哪个团）
    count: {               // <Dict> 保存各种订单的数量 （我的主页的显示）
      paying: 0,           // 待付款
      serving: 0,          // 服务中
      sending: 0,          // 待发货
      receiving: 0,        // 待收货
      over: 0,             // 已完成
      close: 0,            // 已关闭
    },
    orderList: [],         // <List>   订单列表 [分页加载]
    cart: [],              // <List>   购物车内的东西
    cartInfo: [],          // <List>   购物车的商品详细信息 由后端提供
    orderType: '',         // <String> 当前的订单类型
    orderContent: [],      // <List>   下单的内容，可“直接购买”或“从购物车下单”
    expressInfo: {},       // <Dict>   物流信息
    detail: {},            // <Dict>   订单详情
  },


  // 其他杂碎
  others: {
    orderNotes: '',        // <String> 保存订单备注（框架限制跨页面无法直接通讯）
    orderGroup: '',        // <String> 保存订单拼团ID（框架限制跨页面无法直接通讯）
    orderTime: {},         // <Dict>   保存跨页面日历数据（框架限制跨页面无法直接通讯）
    newGroup: '',          // <String> 保存临时的拼团ID 用于标记新团
    storeID: '',           // <String> 保存临时的店铺ID 用于跳转店铺
    scene: '',             // <String> 保存分销场景值 用于登录时绑定关系
    faq: [],               // <List>   常见问题的内容
    messages: [],          // <List>   店铺消息
    membershipLevels: [],  // <List>   会员等级设置
    nextURL: {             // <Dict>   保存下一页的获取地址
      orderList: '',
      // orderList_someStatus: '',

      productList: '',
      // productList_someCategory: '',

      userLogs: '',

      creditLog: '',

      searchList: '',
    },
  },


  // 商品内容
  product: {
    banner: [],            // <List> 落地页的 Banner 内容
    category: [],          // <List> 所有的商品分类
    list: [],              // <List> 全部的商品内容 [分页加载]
    detail: {},            // <Dict> 某个商品的详情 （用于详情页）
  },


  // 搜索相关
  search: {
    query: '',             // <String>  关键词
    hottest: [],           // <List>    热搜词
    history: [],           // <List>    搜索历史
    list: [],              // <List>    搜索结果
    others: [],            // <List>    其他门店的搜索结果
    loading: false,        // <Boolean> 加载状态
  },


  // 店铺相关
  store: {
    id: '',                     // <String> 当前的店铺ID
    status: '',                 // <String> 店铺相关的状态，用于显示区分用
                                // oneOf:
                                //   locating     [加载中]
                                //   unavailable  [不在配送范围]
                                //   available    [正常]
                                //   error        [定位异常]
    disabledLocating: false,    // <Boolean> 是否禁用定位功能
    current: {},                // <Dict>   当前店铺的所有信息
    list: [],                   // <List>   所有的门店列表
    recommendation: {},         // <Dict>   推荐的店铺
    info: {},                   // <Dict>   当前小程序的资料
  },


  // 系统类相关
  system: {
    permissions: [],      // <List>   当前已经向用户请求过的权限列表
  },


  // 全局唯一定时器
  timer: {
    results: {},          // <Dict>   所有的倒计时的结果，由 Saga 进行每秒更新
  },


  // 用户信息
  user: {
    ...,                   // <Any>  用户的信息，由后端及微信 API 返回内容
    accountLog: [...],     // <List> 用户的日志 [分页加载]
    creditLog: [...],      // <List> 用户的积分日志 [分页加载]
    partners: [],          // <List> 用户的下线们
    topUpTypes: [],        // <List> 可充值的类型
  },
}

const localStorage = {
  // section key
  session: '',

  // search history
  history: [],

  // cart items
  cart: [],

  // is first time open the ME TAB
  firstTimeMe: true,

  // is first time open the withdraw window
  firstTimeProfit: true,

  // if disabled wechat location functions
  disabledLocating: false,

  // last used store id
  store: '',

  // mark the readed message id(s)
  hasRead: [],
};

```
