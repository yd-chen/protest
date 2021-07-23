<template>
    <div class="empty-page">
      <img src="./page-404_39c5442.png" alt="404" class="empty-img">
      <h5 class="not-found-text">哎呀，出错了！</h5>

      <div class="list-wrap">
        <h6 class="list-title">可能的原因：</h6>
        <ul class="list">
          <li class="item">原来的页面不存在了</li>
          <li class="item">我们的服务器被外星人劫持了</li>
        </ul>
      </div>

      <router-link to="/" class="recommend-btn">去首页逛逛</router-link>
    </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style scoped lang="stylus">
@import "../../common/stylus/variable.styl";

.empty-page {
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 100
  margin: auto
  padding: 15vh 0 0
  background-color: #fff
  .empty-img {
    display: block
    width: 40vw
    height: 40vw
    max-width: 250px
    max-height: 250px
    margin: auto
  }
  .not-found-text {
    display: block
    margin-top: 25px
    text-align: center
    font-size: 20px
    font-weight: 300
    color: $color-text
  }
  .recommend-btn {
    display: flex
    align-items: center
    justify-content: center
    margin: 20px auto
    width: 188px
    height: 40px
    background-color: $color-theme
    border-radius: 100px
    font-size: 16px
    color: #ffffff
  }
}
.list-wrap {
  display: block
  margin-top: 30px
  font-size: 14px
  color: $color-text-ll
  .list-title {
    width: 220px
    margin: auto
  }
  .list {
    width: 220px
    margin: 15px auto 0
    display: block;
    padding-inline-start: 30px;
    .item {
      margin-bottom: 5px
      list-style-type: disc;
    }
  }
}
</style>
