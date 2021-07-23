/* eslint-disable */
export const requestWxJssdkSign = req => axios.get('/api/weixin/jssdk_sign', {
  params: req,
});
