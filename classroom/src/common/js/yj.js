import { isAndroid, isIos } from './utils';
import iosBridge from '@/plugins/ios-bridge';

const yj = {};

// 跳转页面
yj.jumpPage = (data) => {
  try {
    if (isAndroid()) {
      window.android.postData(JSON.stringify(data));
    }
    if (isIos()) {
      window.webkit.messageHandlers.YouJangAppAction.postMessage(JSON.stringify(data));
    }
  } catch (err) {
    console.log(err);
  }
};

// 发起分享（不弹分享到哪选择框）
yj.invokShare2 = (data) => {
  return new Promise((resolve, reject) => {
    try {
      if (isAndroid()) {
        console.log('android share');
        window.android.invokShare2(JSON.stringify(data));
      }
      if (isIos()) {
        // window.webkit.messageHandlers.invokShare2.postMessage(JSON.stringify(data))
        iosBridge((bridge) => {
          // 调用iOS方法:
          bridge.callHandler('invokShare2', data, (response) => {
            console.log('JS got response', response);
            resolve(response);
          });
        });
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

export default yj;
