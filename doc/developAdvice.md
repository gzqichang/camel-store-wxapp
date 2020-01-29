开发及维护
===


#### 关于配置文件 wxapp.config.js

> 配置文件用于生成代码片段，可直接粘贴进 `app.wpy` 中修改使用。
> 进而加快新小程序项目的自定义内容（比如说自定义主题颜色等）


写法如下：

```js

module.exports = {
  app: {
    name: 'app name',            // 应用显示的名称
    page: [],                    // 除tab类页面外的其他页面，默认会放在tab页的前面
    tab:[                        // 底部TAB页
      {
        name:'发现',             // TAB页的名称
        icon:'explore',          // TAB页的图标，如果没有则以入口名 entrance 字段替代
        entrance:'explore',      // TAB页的页面入口，填文件夹名
                                 // entrance: 'explore',  =>  'pages/explore/index'
        pages: [],               // 当前tab下的其他子页面
                                 // pages: ['a'],  =>  'pages/explore/a'
      },
      ...,
    ]
  },
  theme: {
    primary: '',                 // 主题色 hex code, eg. primary: '#f00'
    text: '',                    // 文本色 hex code, eg. text: '#000'
    tab: {
      color: '',                 // TAB 默认色 hex code
      active: '',                // TAB 选中色 hex code
    },
    ...,
  },
  ...,
};

```


使用方法：

```sh

node genConfig.js

```

运行后会在当前目录下生成 `gen.js` 文件


#### 关于项目文件结构

> 下面只列出需要说明的文件及文件夹，其他文件及文件夹以 `...` 代替

```

  |- script/                        // 辅助类脚本文件 - 与项目功能及展现无关的
      |- genConfig.js               // 生成代码片段的脚本
      |- wxapp.config.js            // 用于生成代码片段的配置内容
      |- ...
  |- src/
      |- app.wpy
      |- assets/                    // 静态资源
          |- icons/                 // 图标
              |- tabBar/            // TAB 图标
              |- explore/           // explore 页面中用到的图标
              |- ...
          |- img/                   // 图片
              |- ...
      |- pages/
          |- explore/               // explore 这个TAB 中用到的页面
              |- index.wpy          // 所有TAB 中的主页面统一命名 index.wpy
              |- ...
          |- ...
      |- service/                   // 远程发起请求的功能按模块划分后集中放service 中
          |- index.js               // index.js 统一导出所有模块内方法
          |- user.js
          |- ...
      |- store/                     // 全局store 及状态管理方法等
          |- user/                  // 按redux ducks 的形式划分
              |- index.js           // types, actions, static reducers
              |- sagas.js           // async func. & async reducers
          |- index.js               // 统一导出并生成store
          |- sagas.js               // 统一所有 async reducers
          |- ...
      |- ...
  |- ...

```


#### 关于开发的内容

* 约定所有异步 redux actions 命名添加 `_SERVICE` 后缀，（如：`ON_LOGIN_SERVICE`）
并且一般异步只在页面中调用。同步只在 `SAGAS` 中调用，但不强制。

* 约定页面内的 `methods = {}` 的 `key`，即所有的页面内方法加 `bind` 前缀，
以区别 `redux actions` 方法，避免重复。强制要求。如：`bindGetUserInfo: () => {}`

* 因为 `wepy` 没有模块间的样式隔离，约定每个页面和组件都带顶级类，以避免不必要的样式污染。

** 例子如下，没懂就翻下已有代码 😂 **

```js

// page

<style>
  .page-class-name {
    // your page styles here..

  }
</style>

<template>
  <view class="page-class-name">
    // your contents here..

  </view>
</template>



// component

<style>
  .parent-folder-name-class-name {
    // your page styles here..

  }
</style>

<template>
  <view class="parent-folder-name-class-name">
    // your contents here..

  </view>
</template>

```

