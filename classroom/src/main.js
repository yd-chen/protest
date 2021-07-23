import Vue from 'vue';
import './cube-ui';
import './plugins/axios';
import './plugins/ios-bridge';
// import './plugins/wechat';
import VueLazyload from 'vue-lazyload';
import preview from 'vue-photo-preview';
import NProgress from 'nprogress';
import App from './App.vue';
import router from './router';
import store from './store/index';
import 'nprogress/nprogress.css';

import 'vue-photo-preview/dist/skin.css';
import './common/stylus/index.styl';

import './common/css/classroom-iframe.css';
import './common/css/main.css';

const FastClick = require('fastclick');

if (process.env.NODE_ENV !== 'production') {
  const VConsole = require('./../node_modules/vconsole/dist/vconsole.min.js');
  new VConsole();
}

Vue.config.productionTip = false;

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 2,
  error: require('@/common/images/default.jpg'),
  loading: require('@/common/images/default.jpg'),
  filter: {
    // progressive (listener, options) {
    //   // 第三方图片我们会填写全地址
    //   const isCDN = /talcdn.jhkong.com/
    //   if (isCDN.test(listener.src)) {
    //     listener.el.setAttribute('lazy-progressive', 'true');
    //     listener.loading = `${listener.src}${listener.src.indexOf('x-oss-process=image') > -1 ? '/' : '?x-oss-process='}blur,r_50,s_30/quality,q_70`;
    //   }
    // },
  },
});

// FastClick.attach(document.body);

// 简单配置
NProgress.inc(0.2);
NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

const previewOption = {
  fullscreenEl: false,
  zoomEl: false,
  arrowEl: true,
  preloaderEl: false,
};
Vue.use(preview, previewOption);

router.beforeEach((to, from, next) => {
  NProgress.start();
  console.log(to.name);
  /* 路由發生變化修改頁面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();

  // store.commit('settoken', localStorage.getItem('token'));
  // if(to.meta.requireAuth) { //即将要去的页面要求登录
  //   if(store.state.token) { //已经登录
  //     next()
  //   } else { //未登录
  //     next({
  //       path: '/login',
  //       query: {
  //         redirect: to.fullPath,
  //       }
  //     })
  //   }
  // } else { //没有登录权限要求
  //   next();
  // }
});
router.afterEach(() => {
  NProgress.done();
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
