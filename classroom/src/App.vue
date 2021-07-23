<template>
  <div id="app">
    <guide-open-app-alert :mask-closable="true" ref="guideAppToast"></guide-open-app-alert>
    <guide-browser-open></guide-browser-open>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>
<script>
import guideOpenAppAlert from '@/components/guideOpenAppAlert/guideOpenAppAlert.vue';
import guideBrowserOpen from '@/components/guideBrowserOpen/guideBrowserOpen.vue';

export default {
  components: {
    guideOpenAppAlert,
    guideBrowserOpen,
  },
};
</script>
<style lang="stylus">
  body {
    font-size: 16px
    line-height: 1.5
    color: #4a4a4a
  }

  #nav
    position: relative
    z-index: 1
    padding 30px
    display: flex
    align-items: center
    justify-content: center
    a
      display: inline-flex
      padding: 10px 20px
      font-weight bold
      color #2c3e50
      &.router-link-exact-active
        color #42b983

  ._lazy_placeholder {
    display: inline-flex
    align-items: center
    justify-content: center
    margin: auto
    background: #eee url(./common/images/loading.gif) center center no-repeat
    background-size: 32px
  }

  .article-main-pal {
      img {
        max-width: 100%
      }
      .img-loading {
        background-color: #eeedeb;
        border: 1px solid #eeedeb;
        background-size: 22px;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url(./common/images/loading.gif);
      }
      .img-loadederror {
        background-color: #eeedeb;
        border: 1px solid #eeedeb;
        background-size: 40px;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url(./common/images/loadederror.png);
      }
  }
  [v-cloak] {
    display: none !important
  }
</style>
