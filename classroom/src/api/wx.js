// eslint-disable-next-line import/no-cycle
import { wxAppId } from '@/config/wxConfig';

// eslint-disable-next-line
export const getWxConfig = currentUrl => axios.get('/api/weixin/jssdk_sign', {
  params: {
    wxappid: wxAppId,
    url: currentUrl,
  },
});
