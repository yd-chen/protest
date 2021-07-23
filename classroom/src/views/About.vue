<template>
  <div class="about">

  </div>
</template>

<script>
import { initWxConfig } from '@/config/wxConfig';

export default {
  name: 'about',
  created() {
  },
  mounted() {
    this.initWxjssdk();
  },
  methods: {
    initWxjssdk() {
      initWxConfig().then(() => {
        wx.ready(() => {
          wx.onMenuShareAppMessage({
            title: '我是测试一回分享的标题啊', // 分享标题
            desc: '分享描述', // 分享描述
            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://talcdn.jhkong.com/upload/content/42/20190506_163552_ef8b1853?x-oss-process=image/format,jpg', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success() {
              // 用户点击了分享后执行的回调函数
              alert('分享成功了啥？');
            },
          });

          wx.onMenuShareTimeline({
            title: '我是测试一回朋友圈分享的标题啊', // 分享标题
            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://talcdn.jhkong.com/upload/content/42/20190506_163552_ef8b1853?x-oss-process=image/format,jpg', // 分享图标
            success() {
              // 用户点击了分享后执行的回调函数
              alert('朋友圈分享成功了啥？');
            },
          });
        });
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
  .about {

    font-family 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    text-align center
    color #2c3e50

  }
</style>
