<template>
  <div class="userinfo-container">
    <el-popover
      placement="bottom"
      width="176"
      trigger="hover"
      popper-class="user-signout-popper"
    >
      <div class="to-sign-out">退出登录</div>
      <div class="userinfo-wrap" slot="reference">
        <el-avatar class="avator" :size="40" src="" @error="errorHandler">
          <img src="~assets/images/default_radius_portrait@2x.png"/>
        </el-avatar>
        <span class="nickname">主主叫白糖，甜嚯嚯嚯嚯嚯</span>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    errorHandler() {
      return true
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~assets/stylus/mixin.styl';
@import '~assets/stylus/variable.styl';
.userinfo-container {
  position relative
  width 144px
  height 100%
}
.to-sign-out {
  margin-left 12px
  padding-left 24px
  height:14px;
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color $color-text-d
  line-height:14px;
  background url('~assets/images/icon_exit_default@2x.png') center left / 16px 16px no-repeat
  &:hover {
    cursor pointer
  }
}
.userinfo-wrap {
  position absolute
  top 0
  left 0
  width 144px
  height 100%
  &:hover {
    cursor pointer
  }
  .el-avatar {
    position absolute
    left 0
    top 12px
  }
  .nickname {
    display inline-block
    width 100%
    height 16px
    margin-top 22px
    padding-left 48px
    font-size 16px
    font-family PingFangSC-Regular,PingFang SC
    font-weight 400
    color $color-text-l
    line-height 16px
    multi-line(1)
  }
}
</style>