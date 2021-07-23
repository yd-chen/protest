<template>
  <transition name="bounceUp">
    <section class="app-open-ftwrap" v-show="appOpenTip">
      <div class="app-open-btn" @click.prevent="openAppDownload"></div>
    </section>
  </transition>
</template>

<script>
import { openAppMixin } from '@/mixin/openAppMixin';

export default {
  name: 'bottom-open-app-tip',
  mixins: [openAppMixin],
  data() {
    return {
      appOpenTip: true,
    };
  },
  methods: {
    show() {
      this.appOpenTip = true;
    },
    hide() {
      // this.appOpenTip = false;
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import "./../../common/stylus/variable.styl"

  .app-open-ftwrap {
    position: fixed
    bottom: 0
    left: 0
    right: 0
    z-index: 100
    margin: auto
    padding-top: 20px
    // background: linear-gradient(to top, rgba(255, 255, 255, 1) 0, rgba(255, 255, 255, .9) 30%, rgba(255, 255, 255, .5) 70%, rgba(255, 255, 255, .2) 100%)
    // box-shadow: 0 -10px 20px 10px rgba(255, 255, 255, .2);
    .app-open-btn {
      width: 166px
      height: 62px
      margin: 20px auto 38px
      background: url(./btn-open-in-app.png) center center no-repeat
      background-size: cover
    }
  }
</style>
