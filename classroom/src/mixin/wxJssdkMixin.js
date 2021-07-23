import { initWxConfig } from '@/config/wxConfig';
import { WX_SHARE_DEFAULT_DATA } from '@/config/index';

const wxJssdkMixin = {
  methods: {
    initWxJssdk(shareData = {}) {
      const shareConfig = Object.assign({}, WX_SHARE_DEFAULT_DATA, shareData);

      initWxConfig().then(() => {
        // eslint-disable-next-line
        wx.ready(() => {
          // eslint-disable-next-line
          wx.onMenuShareAppMessage({
            title: shareConfig.title, // 分享标题
            desc: shareConfig.desc, // 分享描述
            link: shareConfig.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareConfig.imgUrl, // 分享图标
            type: shareConfig.type, // 分享类型,music、video或link，不填默认为link
            dataUrl: shareConfig.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
            success() {
              // 用户点击了分享后执行的回调函数
              console.log('分享成功了啥？');
            },
          });

          // eslint-disable-next-line
          wx.onMenuShareTimeline({
            title: shareConfig.title, // 分享标题
            link: shareConfig.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareConfig.imgUrl, // 分享图标
            success() {
              // 用户点击了分享后执行的回调函数
              console.log('朋友圈分享成功了啥？');
            },
          });
        });
      });
    },
  },
};

export default wxJssdkMixin;
