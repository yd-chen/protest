<template>
  <div class="empty-wrap">
      <div class="empty-img">
        <img class="img" src="./empty_comment.png" alt="empty_comment.png">
      </div>
      <p class="empty-text">{{msg}}</p>
  </div>
</template>

<script>
export default {
  name: 'content-empty',
  props: {
    msg: {
      type: String,
      default: '空空如也～',
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"

  .empty-wrap {
    padding: 30px 16px 30px
    .empty-img {
      .img {
        display: block
        margin: auto
        width: 255px
        height: 168px
      }
    }
    .empty-text {
      margin-top: 20px
      height: 20px;
      color: $color-text-l;
      font-size: 14px;
      text-align: center;
    }
  }
</style>
