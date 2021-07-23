<template>
  <div class="follow-btn" :style="wrapStyle" @click.prevent.stop="follow">
    <i class="icon icon-add"></i>
    <span class="btn-text">关注</span>
  </div>
</template>

<script>
export default {
  name: 'follow-button',
  props: {
    wrapStyle: {
      type: String,
      default: '',
    },
    type: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {};
  },
  methods: {
    follow() {
      this.$emit('follow-click');
    },
  },
};
</script>

<style scoped lang="stylus">
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"

  .follow-btn {
    position: relative
    width: 54px;
    height: 24px;
    display: flex
    align-items: center
    justify-content: center
    background-color: $color-theme
    background: $color-theme linear-gradient(to right, #FCB13F, #FA8C1D) 0 0 no-repeat
    border-radius: 100px
    ::before {
      content ''
      position: absolute
      top: -8px
      right: -10px
      bottom: -8px
      left: -10px
    }
    .icon-add {
      display: block
      width: 10px
      height: 10px
      margin-right: 3px
      background: transparent url(./com_icon_follow3_de.png) center center no-repeat
      background-size: 12px
    }
    .btn-text {
      font-size: 12px
      color: #fff
    }
  }
</style>
