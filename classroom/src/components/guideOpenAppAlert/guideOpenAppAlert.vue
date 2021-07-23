<template>
  <transition name="fade">
    <div class="toast-wrapper" ref="guideOpenApp" v-show="guideAppAlertFlag">
      <div class="mask" :style="maskOpacity" @click.stop="maskClick"></div>
      <div class="toast-main">
        <img class="logo-h5" src="./h5_logo.png" alt="h5_logo.png">
        <h2 class="app-name">有讲课堂</h2>
        <p class="app-guide-text">来有讲，与更多年轻人一起成长！</p>

        <div class="open-btn" @click.prevent.stop="openAppDownload">进入有讲</div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { openAppMixin } from '@/mixin/openAppMixin';

export default {
  name: 'guide-open-app-alert',
  mixins: [openAppMixin],
  props: {
    opacity: { // mask 透明度
      type: Number,
      default: 0.4,
    },
    maskClosable: { // click mask 能否关闭
      type: Boolean,
      default: false,
    },
    timeoutHide: { // 是否可自动隐藏
      type: Boolean,
      default: false,
    },
    time: { // 自动隐藏 timeout
      type: Number,
      default: 3000,
    },
  },
  computed: {
    maskOpacity() {
      return `opacity: ${this.opacity}`;
    },
    ...mapGetters([
      'guideAppAlertFlag',
    ]),
  },
  data() {
    return {
      flag: false,
    };
  },
  methods: {
    show() {
      this.setGuideAppFlag(true);
      if (this.timeoutHide) {
        this.autoHideTimer && clearTimeout(this.autoHideTimer);
        this.autoHideTimer = setTimeout(() => {
          this.hide();
        }, this.time);
      }
    },
    hide() {
      this.setGuideAppFlag(false);
      this.autoHideTimer && clearTimeout(this.autoHideTimer);
      this.$emit('hide');
    },
    maskClick() {
      this.maskClosable ? this.hide() : null;
    },
    ...mapMutations({
      setGuideAppFlag: 'SET_GUIDE_APP_FLAG',
    }),
  },
};
</script>

<style lang="stylus" scoped>
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"

  .toast-wrapper {
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    z-index: 1000
    margin: auto
    width: 100vw
    height: 100vh
    .mask {
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      display: block
      width: 100%
      height: 100%
      background-color: #000000
      opacity: .4
    }
    .toast-main {
      position: absolute
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: block
      width: 78vw
      max-width: 315px
      min-width: 260px
      padding: 24px 16px
      background-color: #fff
      border-radius: 8px
      .logo-h5 {
        position: absolute
        left: 0
        right: 0
        top: -48px
        z-index: 1
        display: block
        width: 96px
        height: 96px
        margin: auto
      }
      .app-name {
        display: block
        margin: 32px auto 8px
        height: 18px;
        line-height: 18px;
        color: $color-text;
        font-size: 18px;
        font-weight: 500
        text-align: center;
        no-wrap()
      }
      .app-guide-text {
        height: 15px;
        line-height: 15px;
        color: $color-text-l;
        font-size: 15px;
        text-align: center;
        white-space: nowrap
      }

      .open-btn {
        position: relative
        display: flex
        align-items: center
        justify-content: center
        width: 178px
        height: 32px;
        margin: 30px auto 0
        background-color: $color-theme
        border-radius: 100px
        line-height: 16px;
        color: #fff;
        font-size: 16px;
        &::before {
          content: ''
          position: absolute
          left: -10px
          top: -10px
          right: -10px
          bottom: -10px
        }
      }
    }
  }
</style>
