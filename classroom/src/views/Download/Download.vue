<template>
  <div class="download">
    <div class="app-loading" v-show="loadingTip" v-cloak>
      <div class="">正在下载...</div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import {
  isIos, isAndroid, isWechat, isMobile, isYoJiangApp, isWeibo, isQQ,
} from '@/common/js/utils';
import { APKDownloadUrl, AppStoreUrl, TenYingStoreUrl } from '@/config/index';

export default {
  name: 'download',
  data() {
    return {
      loadingTip: false,
    };
  },
  mounted() {
    if (isWeibo()) {
      this.setGuideBrowserOpenFlag(true);
      return;
    }
    if (isIos()) {
      window.location.href = AppStoreUrl;
    } else if (isWechat()) {
      window.location.href = TenYingStoreUrl;
    } else if (isAndroid()) {
      window.location.href = TenYingStoreUrl;
    } else {
      this.loadingTip = true;
      window.location.href = APKDownloadUrl;
    }
  },
  methods: {
    ...mapMutations({
      setGuideBrowserOpenFlag: 'SET_GUIDE_BROWSER_FLAG',
    }),
  },
};
</script>

<style lang="stylus" scoped>
  .app-loading {
    margin-top: 50px;
    font-size: 16px;
    color: #404040;
    text-align: center;
  }
</style>
