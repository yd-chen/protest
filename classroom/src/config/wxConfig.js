/* eslint-disable */
import { getWxConfig } from '@/api/wx';

let appId = '';
switch (process.env.NODE_ENV) {
  case 'development':
    appId = '2';
    break;
  case 'alpha':
    appId = '2';
    break;
  case 'production':
    appId = '2';
    break;
}
export const wxAppId = appId;
export const initWxConfig = () => {
  const currentUrl = window.location.href.split('#')[0];

  return getWxConfig(currentUrl).then((res) => {
    const signRspData = res.data;

    const configApiList = [
      'onMenuShareAppMessage',
      'onMenuShareTimeline',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'hideMenuItems',
      'chooseWXPay',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'startRecord',
      'stopRecord',
      'uploadVoice',
      'onVoiceRecordEnd',
      'playVoice',
      'stopVoice',
      'onVoicePlayEnd',
      'downloadVoice',
      'updateAppMessageShareData', // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
      'updateTimelineShareData', // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
    ];

    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: signRspData.app_id, // 必填，公众号的唯一标识
      timestamp: signRspData.timestamp, // 必填，生成签名的时间戳
      nonceStr: signRspData.nonce, // 必填，生成签名的随机串
      signature: signRspData.sign, // 必填，签名，见附录1
      jsApiList: configApiList,
    });

    wx.ready(() => Promise.resolve());
  });
};
