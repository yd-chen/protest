<template>
  <div class="warning-bar">
    <i class="icon"></i>
    <span class="text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      default() {
        return ''
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~assets/stylus/mixin.styl';

.warning-bar {
  position relative
  width 100%
  height 40px
  padding-left 20px
  background #FFF5ED
  border-radius 4px
  border 1px solid #FF9645
  no-wrap()
  .icon {
    position absolute
    left 20px
    top 12px
    display inline-block
    width 16px
    height 16px
    margin-right 8px
    background url('~assets/images/backstage_police.png') center center / 16px no-repeat
  }
  .text {
    display block
    width 100% 
    padding-left 24px
    font-size 14px
    font-family PingFangSC-Regular,PingFang SC
    font-weight 400
    color #775E3D
    line-height 40px
    text-align left 
  }
}
</style>
