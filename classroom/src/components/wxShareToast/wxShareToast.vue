<template>
  <transition name="fade">
    <div class="toast-wrapper" ref="wxShareToast" v-show="flag">
      <div class="mask" :style="maskOpacity" @click.stop="maskClick"></div>
      <div class="toast-main">
        <p>请点击页面右上角</p>
        <p>选择 <img src="@/common/images/share_icon_wechat.png" alt="share_icon_wechat.png" class="icon-wx"> 或 <img src="@/common/images/share_icon_pyq.png" alt="share_icon_pyq.png" class="icon-wx"> 分享给好友</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'wx-share-toast',
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
  },
  data() {
    return {
      flag: false,
    };
  },
  methods: {
    show() {
      this.flag = true;
      if (this.timeoutHide) {
        this.autoHideTimer && clearTimeout(this.autoHideTimer);
        this.autoHideTimer = setTimeout(() => {
          this.hide();
        }, this.time);
      }
    },
    hide() {
      this.flag = false;
      this.autoHideTimer && clearTimeout(this.autoHideTimer);
      this.$emit('hide');
    },
    maskClick() {
      this.maskClosable ? this.hide() : null;
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import "./../../common/stylus/variable.styl";

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
      height: 96px
      padding: 24px 16px
      background-color: #fff
      border-radius: 8px
      p {
        line-height: 24px;
        font-size: 14px;
        color: $color-text-l
        text-align: center;
        vertical-align: top
        .icon-wx {
          width: 24px
          height: 24px
          vertical-align: middle
        }
      }
    }
  }
</style>
