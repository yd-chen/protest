<template>
  <div class="content-article-container">
    <div class="article-cover-zone">
      <img v-lazy="data.cover_url" :key="data.cover_url" preview="1000000" alt="article_cover" class="cover-img"
            @load="onImgLoad">
    </div>
    <h2 class="article-title">{{data.title}}</h2>
    <div v-if="publishUserData && publishUserData.id" class="user-wrap">
      <publish-user :user="publishUserData" :jump-to-user="true" @follow="showGuideApp"></publish-user>
    </div>
    <div class="hr-line border-bottom-1px"></div>
    <article ref="articleContainer">
      <div class="article article-main-pal" ref="articleMainContainer" v-html="processHtml(articleContent)"></div>
    </article>
  </div>
</template>

<script>
/* eslint-disable */
import { mapMutations } from 'vuex';
import {
  hasClass, addClass, removeClass, getData,
} from '@/common/js/dom';
import publishUser from '@/components/publishUser/publishUser.vue';

const WINDOW_HEIGHT = window.innerHeight;
const WINDOW_WIDTH = Math.min(window.innerWidth, 640);
const defaultLazyPic = require('./img-placeholder.gif');

export default {
  name: 'content-article',
  components: {
    publishUser,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    articleContent: {
      type: String,
      default: '',
    },
    publishUserData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    articleWidth() {
      return WINDOW_WIDTH - 24 * 2;
    },
  },
  data() {
    return {
      finished: true,
      imageSizes: {},
      imageId: 0,
    };
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.updateImages();
      this.onImgLoad();
    });
  },
  methods: {
    showGuideApp() {
      this.setGuideAppFlag(true);
    },
    processHtml(html) { // 处理原来富文本 替换html的图片
      html = html.replace(/<img [^>]*style=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
        // capture,返回每个匹配的字符串  match,返回img标签
        match = match.replace(`style="${capture}"`, '');
        return match;
      });
      html = html.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
        // capture,返回每个匹配的字符串  match,返回img标签
        const widthPattern = new RegExp('\\sdata-width=[\'"](.*?)[\'"]');
        const heightPattern = new RegExp('\\sdata-height=[\'"](.*?)[\'"]');
        const matchWidth = match.match(widthPattern);
        const matchHeight = match.match(heightPattern);

        if (location.protocol === 'https:') {
          match = match.replace('http://', 'https://');
        }
        let sizeUrl = capture.split('?')[0];
        // console.log(sizeUrl);

        if (matchWidth && matchHeight) {
          const realWidth = matchWidth[1];
          const realHeight = matchHeight[1];

          // 兼容 auto 的情况
          if (realHeight === 'auto' || realWidth === 'auto') {
            match = match.replace(/\sheight=/, ` style="max-width: 100%; height: auto; object-fit: cover;" preview="1000000" large="${sizeUrl}" data-pswp-uid="1" height=`);
            return match;
          }
          const aWidth = Math.min(realWidth, this.articleWidth);
          const aHeight = Math.floor(realHeight * aWidth / realWidth);

          match = match.replace(/\sheight=/, ` style="width: ${aWidth}px; height: ${aHeight}px; object-fit: cover;" large="${sizeUrl}" data-pswp-uid="1" class="img-loading" height=`);
          match = match.replace(/\ssrc=/, ` src="${defaultLazyPic}" lazy-src=`);
          return match;
        }

        sizeUrl = process.env.NODE_ENV !== 'development' ? sizeUrl : sizeUrl.replace('http://talcdn.jhkong.com', '');
        this.$axios({
          method: 'get',
          url: sizeUrl,
          params: {
            'x-oss-process': 'image/info',
          },
          withCredentials: false,
        }).then((res) => {
          this.imageId += 1;
          const imageSize = {
            id: this.imageId,
            width: res.ImageWidth.value,
            height: res.ImageHeight.value,
          };
          this.imageSizes[this.stripProtocol(capture)] = imageSize;

          setTimeout(this.setupPlaceHolders, 100);
        });
        match = match.replace(/\ssrc=/, ` src="${defaultLazyPic}" lazy-src=`);
        return match;
      });
      this.finished = false;
      return html;
    },
    setupPlaceHolders() { // 原图像换成一个loading灰色块
      const lazySrcImgs = this.$refs.articleContainer.querySelectorAll('img[lazy-src]');
      lazySrcImgs && lazySrcImgs.forEach((elem, i, oldLazySrcImgs) => {
        const lazySrc = elem.getAttribute('lazy-src');
        const imageItem = this.imageSizes[this.stripProtocol(lazySrc)];

        if (imageItem) {
          const className = `_lazy_image_${imageItem.id}`;
          if (hasClass(elem, className)) return;
          addClass(elem, className);
          // elem.style.display = 'none';

          // 适应页面尺寸
          let imageWidth = imageItem.width || 100;
          let imageHeight = imageItem.height || 100;

          let parent = elem.parentElement;
          while (parent && parent.innerWidth == 0) {
            parent = parent.parentElement;
          }
          if (parent && parent.clientWidth < imageWidth) {
            imageHeight = Math.floor(imageHeight * parent.clientWidth / imageWidth);
            imageWidth = parent.clientWidth;
          }

          elem.style.height = `${imageHeight}px`;
          elem.style.width = `${imageWidth}px`;

          // const placeHolder = document.createElement('SECTION');
          //
          // addClass(placeHolder, '_lazy_placeholder');
          // getData(placeHolder, 'id', imageItem.id);
          // placeHolder.style = `width: ${imageWidth}px; height: ${imageHeight}px;`;
          //
          // const contain = elem.parentElement;
          // contain.insertBefore(placeHolder, elem);

          console.log('setupPlaceHolders');

          this.finished = false;
          setTimeout(this.updateImages, 100);
        }
      });
    },
    updateImages() {
      if (this.finished) {
        return;
      }

      const lazySrcImgs = this.$refs.articleContainer.querySelectorAll('img[lazy-src]');
      const images = Array.from(lazySrcImgs);

      images && images.map((elem) => {
        const rect = elem.getBoundingClientRect();
        if (rect.top <= WINDOW_HEIGHT * 0.8 && rect.top >= 0) {
          if (getData(elem, 'loading')) {
            return;
          }

          let lazySrc = elem.getAttribute('lazy-src');
          // let imageItem = this.imageSizes[this.stripProtocol(lazySrc)];
          getData(elem, 'loading', 1);

          // 压缩图片的操作
          const resizeWidth = elem.clientWidth || this.articleWidth;
          console.log('elem.clientWidth', elem.clientWidth)
          console.log('this.articleWidth', this.articleWidth)
          console.log('resizeWidth', resizeWidth)
          lazySrc = `${lazySrc}?x-oss-process=image/resize,w_${resizeWidth}`;

          const errorReload = (e) => {
            const el = e.target;
            addClass(el, 'img-loading');
            removeClass(el, 'img-loadederror');
            setElementUrl();
          };

          const setElementUrl = () => {
            const imageObj = new Image();
            imageObj.src = lazySrc;
            imageObj.onload = () => {
              elem.setAttribute('src', lazySrc);
              // preview="1000000"

              if (elem.closest('a')) {
                console.log('[图片有超链接]')
              } else {
                elem.setAttribute('preview', 1000000);
              }
              elem.removeAttribute('lazy-src');
              elem.removeAttribute('data-loading');
              elem.removeAttribute('class');
              this.onImgLoadTimer && clearTimeout(this.onImgLoadTimer);
              this.onImgLoadTimer = setTimeout(() => {
                this.onImgLoad();
              }, 200);
            };
            imageObj.onerror = () => {
              elem.setAttribute('src', defaultLazyPic);
              addClass(elem, 'img-loadederror');
              removeClass(elem, 'img-loading');
              elem.addEventListener('click', errorReload, false);
            };
          };
          setElementUrl();
        }
      });

      if (images.length === 0) {
        this.finished = true;
      }
    },
    stripProtocol(url) {
      if (!url) return url;
      return url.replace('http:', '').replace('https:', '');
    },
    onImgLoad() {
      // console.log('imageLoad');
      this.$previewRefresh();
      this.$emit('imageLoad');
    },
    checkBigPicture() {
      this.$previewRefresh();
    },
    // exceptLinkImg() {
    //   const Imgs = this.$refs.articleContainer.querySelectorAll('img');

    //   Imgs && Imgs.map((elem) => {
    //     if (elem.closest('a')) {
    //       console.log('[图片有超链接]')
    //       elem.
    //     }
    //   })
    // },
    ...mapMutations({
      setGuideAppFlag: 'SET_GUIDE_APP_FLAG',
    }),
  },

};
</script>

<style lang="stylus" scoped>
  @import "./../../common/stylus/variable.styl"

  .content-article-container {
    .article-cover-zone {
      position: relative
      padding-top: 56%
      overflow: hidden
      .cover-img {
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        display: block
        width: 100%
        height: 100%
        margin: auto
        object-fit cover
      }
    }
    .article-title {
      position: relative
      display: block
      margin 16px 16px 4px
      word-wrap: break-word
      line-height: 30px
      color: $color-text;
      font-size: 20px;
      font-weight: 800
      text-align: justify;
    }
    .hr-line {
      margin: 0 24px
      height: 1px
      background-color: #F2F2F2
    }
  }

  .article {
    font-size: 16px
    line-height: 28px
  }

  .user-wrap {
    padding 24px 16px
  }

</style>
