<template>
  <div class="user-info-wrap">
    <el-image :src="'http://talcdn.jhkong.com/upload/user_portrait/2761142/1576481993.jpeg'" class="avatar" />
    <div class="nickname">请叫我白糖，只因为我甜的纯粹~</div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/stylus/mixin.styl"

.user-info-wrap {
  position relative
  width 144px
  padding 10px 0
  .avatar {
    position absolute
    width:40px;
    height:40px;
    box-shadow:0px 0px 16px 0px rgba(0,0,0,0.16);
    border:2px solid rgba(255,255,255,1);
    border-radius 100%
  }
  .nickname {
    width 100%
    margin-top 12px
    height:16px;
    padding-left 48px
    font-size:16px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:16px;
    multi-line(1)
  }
}
</style>
