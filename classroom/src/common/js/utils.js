/* eslint-disable */
// 获取随机整数
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// 数组洗牌
export function shuffle(arr) {
  const _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    const j = getRandomInt(0, i);
    const t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}

// 节流函数
export function debounce(func, delay) {
  let timer;

  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function isIos() {
  const clientTexts = ['iPhone', 'iPad'];
  for (let i = 0; i < clientTexts.length; i++) {
    if (navigator.userAgent.indexOf(clientTexts[i]) > -1) {
      return true;
    }
  }
  return false;
}

export function isAndroid() {
  return navigator.userAgent.indexOf('Android') > -1;
}

export function isMobile() {
  const clientTexts = ['iPhone', 'iPad', 'Android', 'Mobile'];
  for (let i = 0; i < clientTexts.length; i++) {
    if (navigator.userAgent.indexOf(clientTexts[i]) > -1) {
      return true;
    }
  }
  return false;
}

export function isPC() {
  return !isMobile();
}

export function isWechat() {
  return navigator.userAgent.indexOf('MicroMessenger') > -1;
}

export function isWeibo() {
  return navigator.userAgent.toLowerCase().indexOf(' weibo') > -1;
}

export function isQQ() {
  return navigator.userAgent.toLowerCase().indexOf(' qq/') > -1;
}


// 有讲app
export function isYoJiangApp() {
  return navigator.userAgent.indexOf(' YoJiang') > -1 || navigator.userAgent.indexOf(' native-code') > -1;
}

/**
 * 字符串后四位转化为万
 * @param {String} num
 * @return {String}
 */
export const handleCount = (num) => {
  if (isNaN(Number(num))) {
    return 0;
  }
  if (num > 1e4) {
    const ret = Number((num / 1e4).toFixed(1));
    return `${ret}万`;
  }
  if (num < 0) {
    return 0;
  }
  return num;
};

export const decodeBase64 = (s) => {
  const e = {};
  let i;
  let b = 0;
  let c;
  let x;
  let l = 0;
  let a;
  let r = '';
  const w = String.fromCharCode;
  const L = s.length;
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (i = 0; i < 64; i++) {
    e[A.charAt(i)] = i;
  }
  for (x = 0; x < L; x++) {
    c = e[s.charAt(x)];
    b = (b << 6) + c;
    l += 6;
    while (l >= 8) {
      ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a));
    }
  }
  return r;
};

export const checkPhone = (phone) => {
  if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
    return false;
  }
  return true;
};
