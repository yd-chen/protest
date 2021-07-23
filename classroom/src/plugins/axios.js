/* eslint-disable */
import Vue from 'vue';
import axios from 'axios';
import {
  Toast,
} from 'cube-ui';
import baseUrl from '@/config/setBaseUrl';
import { decodeBase64 } from '@/common/js/utils';

Vue.use(Toast);

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const config = {
  baseURL: baseUrl,
  timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  config =>
    // Do something before request is sent
    config,
  error =>
    // Do something with request error
    Promise.reject(error),
);

// Add a response interceptor
_axios.interceptors.response.use(
  (response) => {
    // Do something with response data
    if (+response.status !== 200) {
      return response;
    }
    // if(!response.data.success) {
    //   alert(response.data.message);
    //   return;
    // }
    // 解密数据
    if (response.encrypt_ver === 1 && response.data) {
      try {
        const buf = response.data.replace(/\n/g, '').split('');
        for (let i = 0; i < Math.floor(buf.length / 3); i++) {
          const c = buf[i * 3];
          buf[i * 3] = buf[i * 3 + 2];
          buf[i * 3 + 2] = c;
        }
        response.data = JSON.parse(decodeBase64(buf.join('')));
      } catch (err) {
        console.error(err);
      }
    }
    if (!response.data.success && response.data.message) {
      Toast.$create({
        time: 1000,
        type: 'txt',
        txt: response.data.message,
      }).show();
    }
    return response.data;
  },
  (error) => {
    // Do something with response error
    const { status } = error.response;
    switch (status) {
      case 500:
        console.error('error', '服务器内部错误');
        Toast.$create({
          time: 1000,
          type: 'txt',
          txt: '服务器内部错误',
        }).show();
        break;
      case 404:
        console.error('error', '未找到远程服务器');
        break;
      case 401:
        console.error('warning', '用户登陆过期，请重新登陆');
        // localStorage.removeItem('token');
        // setTimeout(() => {
        //   router.replace({
        //     path: '/login',
        //     query: {
        //       redirect: router.currentRoute.fullPath
        //     }
        //   });
        // }, 1000);
        break;
      case 400:
        console.error('error', '数据异常，详情请咨询有讲课堂服务热线');
        break;
      default:
        console.error('error', error);
    }
    return Promise.reject(error);
  },
);

Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      },
    },
    $axios: {
      get() {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
