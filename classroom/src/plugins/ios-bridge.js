import Vue from "vue";
const setupWKWebViewJavascriptBridge = (callback) => {
  if (window.WKWebViewJavascriptBridge) {
    // eslint-disable-next-line no-undef
    return callback(WKWebViewJavascriptBridge);
  }
  if (window.WKWVJBCallbacks) {
    return window.WKWVJBCallbacks.push(callback);
  }
  window.WKWVJBCallbacks = [callback];
  window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null);
};

console.log(setupWKWebViewJavascriptBridge);
Vue.prototype.$iosBridge = setupWKWebViewJavascriptBridge;
const iosBridge = setupWKWebViewJavascriptBridge;
export default iosBridge
