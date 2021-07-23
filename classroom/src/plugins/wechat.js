import Vue from 'vue';

const wx = require('weixin-js-sdk');


Plugin.install = function (Vue, options) {
  Vue.wx = wx;
  window.wx = wx;
  Object.defineProperties(Vue.prototype, {
    wx: {
      get() {
        return wx;
      },
    },
    wx: {
      get() {
        return wx;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
