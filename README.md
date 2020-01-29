小程序
===


#### 前端的版本说明

| 小程序版本号 | 基于框架 | 主要功能                                     |
|--------------|----------|--------------------------------------------|
| 1.x          | Taro     | 略                                         |
| 2.0.x        | WePY     | 基本和旧版一样，主要是用wepy进行重写         |
| 2.1.x        | WePY     | 新增分享、分销及购物车等内容                 |
| 2.2.x        | WePY     | 新增会员钱包的概念及充值等相关的附加内容      |
| 2.3.x        | WePY     | 完善会员钱包相关功能及增加会员等级、折扣等    |
| 2.4.x        | WePY     | 多门店版本，根据用户定位及收货信息等切换门店等 |
| 2.5.x        | WePY     | 多门店版本，无新功能，接口全面重构，数据变更   |
| 2.6.x        | WePY     | 拼团版本，支持拼团功能                        |
| 2.7.x        | WePY     | 新增更丰富的首页，支持配置                    |


#### 文档

* [关于开发及约定](https://coding.net/u/qichang/p/camel-store/git/blob/wxapp/wxapp/doc/developAdvice.md)
* [关于前端数据模型](https://coding.net/u/qichang/p/camel-store/git/blob/wxapp/wxapp/doc/storeAndModules.md)


#### 如何“新建”一个小程序

##### 自动：

```sh

# 新建到分支

git checkout -b wxapp-new

# 生成

npm run gen help

# 或 (解决中文乱码)

chcp 65001 && node ./script/gen.js

# 或

node ./script/gen.js

# 最后重新构建小程序

rm -rf ./dist && npm run build

```


##### 手动：

1. 新建到分支：

```

git checkout -b wxapp-new

```

2. 修改以下文件：

    1. `wxapp/project.config.json` 中的 `appid` 字段
    2. `wxapp/src/app.wpy` 中的 `navigationBarTitleText`, `globalData - appName` 字段
    3. `wxapp/src/service/index.js` 中的 `baseUrl` 字段
    4. 替换掉“分享图片” 路径: `wxapp/src/assets/sharedBackground.jpg`（注意要保持同名）

3. 重新构建小程序文件：

```

rm -rf ./dist && npm run build

```

4. 发布小程序
