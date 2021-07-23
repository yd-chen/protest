<template>
  <header id="header" class="header-wrap" @click.prevent.stop="">
    <div class="download">
      <div class="logo">
        <img src="../../common/images/logo_3_0.png" alt="logo">
      </div>
      <h1 id="h1" class="h1-title">有讲课堂</h1>
      <h2 id="slogan" class="slogan">在线技能学习平台</h2>
    </div>
    <div class="open-btn border-1px border-1px-full" @click.prevent="openAppDownload">
      <span class="btn-text">立即打开</span>
    </div>
  </header>
</template>

<script>
import { openAppMixin } from '@/mixin/openAppMixin';

export default {
  name: 'top-download-banner',
  mixins: [openAppMixin],
};
</script>

<style lang="stylus" scoped>
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"

  .header-wrap {
    position: fixed
    top: 0
    left: 0
    right: 0
    z-index: 10
    margin: auto
    height: 60px
    max-width: 640px
    display: flex
    align-items: center
    padding: 8px 16px
    background-color: #fff
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, .05);
  }

  .download {
    position: relative
    flex: 1 1 auto;
    width: 1%
    height: 44px
    padding-left: 52px
    .logo {
      position: absolute
      left: 0
      top: 0
      bottom: 0
      width: 44px
      height: 44px
      img {
        display: block
        width: 100%
        height: 100%
        object-fit cover
      }
    }
    .h1-title {
      display: block
      padding: 4px 0
      no-wrap()
      font-size: 16px
      font-weight: 900
      color: $color-text
      line-height: 20px
    }
    .slogan {
      display: block
      no-wrap()
      font-size: 12px
      line-height: 16px
      color: $color-text-l
    }
  }

  .open-btn {
    position: relative
    width: 78px;
    height: 28px;
    display: flex
    align-items: center
    justify-content: center
    border-radius: 100px;
    &::before {
      content: ''
      position: absolute
      top: -8px
      bottom: -8px
      left: -10px
      right: -10px
    }
    &::after {
      content: ''
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      pointer-events: none;
      box-sizing: border-box;
      transform-origin: top left;
      border: 1px solid #ff9645
      border-radius: 100px;
    }
    .btn-text {
      font-size: 14px
      color: #ff9645
    }
  }
</style>
