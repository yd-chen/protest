import { mapMutations } from 'vuex';
import { AppStoreUrl, TenYingStoreUrl } from '@/config/index';
import { isIos, isAndroid, isWeibo } from '@/common/js/utils';

export const openAppMixin = {
  methods: {
    openAppDownload() {
      let url = '';
      if (isWeibo()) {
        console.log('isWeibo: ', isWeibo);
        this.setGuideBrowserOpenFlag(true);
        return;
      } if (isIos() && AppStoreUrl) {
        url = AppStoreUrl;
      } else if (isAndroid() && TenYingStoreUrl) {
        url = TenYingStoreUrl;
      } else {
        url = '/classroom/download';
      }
      // url = '/classroom/download';
      console.log(url);
      window.location.href = url;
    },
    ...mapMutations({
      setGuideBrowserOpenFlag: 'SET_GUIDE_BROWSER_FLAG',
    }),
  },
};
