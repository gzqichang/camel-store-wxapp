import wepy from 'wepy';
import {
  go2page,
  loading,
  showToast,
  showModal,
  parseTime,
  parse2Float,
  hasUserInfo,
  checkUserInfo,
  permissionCallback,
  checkIOS,
} from '../utils';


export default class UtilsMixin extends wepy.mixin {
  // 辅助类函数

  // 解析时间为 2000-10-10 10:10 的格式
  parseTime = parseTime;

  // 保留两位小数点
  parse2Float = parse2Float;

  // 获取当前页面路径
  getCurrentPath = () => {
    /* eslint-disable no-undef */
    const pages = getCurrentPages();
    const {route} = pages[pages.length - 1];
    return route;
  };

  // Toast
  showToast = showToast;

  // Loading
  loading = loading;

  // Modal
  showModal = showModal;

  // Go Back & Go To Page
  go2page = go2page;

  // Check User Info
  hasUserInfo = hasUserInfo;

  checkUserInfo = checkUserInfo;

  permissionCallback = permissionCallback;

  // Copy Text
  copyText = (data) => {
    wepy.setClipboardData({
      data,
      success: () => {
        wepy.showToast({title: '复制成功'});
      },
    });
  };

  // Save to Album
  savePhoto2Album = (path) => {
    const onFail = () => this.showToast('保存失败');
    const onFailAuth = () => this.showToast('请在小程序设置中打开“保存到相册”的权限');
    const savePic = () => {
      wepy.saveImageToPhotosAlbum({
        filePath: path,
        success: () => this.showToast('已保存到相册'),
        fail: onFail,
      });
    };

    wepy.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum'])
          wepy.authorize({
            scope: 'scope.writePhotosAlbum',
            success: savePic,
            fail: onFailAuth,
          });
        else
          savePic();
      },
      fail: onFail,
    });
  };

  // Set Title
  setTitle(param = '') {
    if (typeof param === 'string')
      param = {title: param};
    wepy.setNavigationBarTitle(param);
  };

  // select video
  chooseVideo = (fields) => {
    wepy.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      complete: () => {
        console.log('选择视频完成');
      },
      ...fields,
    });
  };
  /*
   * Parse String to Wechat City Array
   *
   * @param:
   *  str: '上海市上海市徐汇区'
   *
   * @return:
   *  <Array> ['上海市', '上海市', '徐汇区']
   */
  parseRegion = (text) => {
    let str = text;
    let region = [];
    let reg = [
      /\S[^省|市|区]+[省|市|区]/,
      /\S[^市|区]+[市|区]/,
      /\S[^市|区|县]+[市|区|县]/,
    ];

    for (let r of reg) {
      const rs = r.exec(str);
      if (rs !== null) {
        region.push(rs[0]);
        str = str.replace(rs[0], '');
      }
    }

    return region;
  };

  // check system is IOS
  checkIOS = checkIOS;

  onLoad() {
    // Set Title
    if (
      this.$parent && this.$parent.globalData
    ) {
      const title = this.$parent.globalData.appName || '';
      this.setTitle(title);
    }
  }
}
