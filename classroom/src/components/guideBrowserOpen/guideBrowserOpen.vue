<template>
  <transition name="bounceUp">
    <div class="wechat-download" v-show="guideBrowserOpenFlag" @click.prevent.stop="close()" v-cloak>
      <img src="./wechat_download_tip.png" alt="wechat" class="wechat-tip">
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'guide-browser-open',
  computed: {
    ...mapGetters([
      'guideBrowserOpenFlag',
    ]),
  },
  methods: {
    close() {
      this.setGuideBrowserOpenFlag(false);
    },
    ...mapMutations({
      setGuideBrowserOpenFlag: 'SET_GUIDE_BROWSER_FLAG',
    }),
  },
};
</script>

<style lang="stylus" scoped>
  .wechat-download {
    position fixed
    left 0
    top 0
    height 100vh
    width 100%
    z-index 1000
    background-color rgba(0, 0, 0, 0.7)
    .wechat-tip {
      max-width: 100%
      text-align center
      margin-top 10%
      padding-left 5%
      padding-right 5%
    }
  }
</style>
