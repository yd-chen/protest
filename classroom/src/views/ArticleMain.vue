<template>
  <div class="article-pager">
    <article class="content-article-container" ref="articleContainer">
    </article>
  </div>
</template>

<script>
import strHtmlLazyload from 'stringhtml-lazy-img';
// import contentArticle from '@/components/contentArticle/contentArticle.vue';

import { TYPE_CONTENT } from '@/common/js/config';
import { isYoJiangApp, isIos } from '@/common/js/utils';
import {
  requestContentDetail,
} from '@/api/api';

export default {
  name: 'article-main',
  components: {
    // contentArticle,
  },
  data() {
    return {
      TYPE_CONTENT,
      contentData: {},
      articleData: {},
      articleContent: '',
    };
  },
  created() {
    this.isYoJiangApp = isYoJiangApp();
    this.isIos = isIos();
    this.contentId = this.$route.query.id;
    this.getContentDetail(this.contentId);
  },
  mounted() {},
  methods: {
    renderArticleData(title, coverUrl, articleUrl) {
      this.$axios({
        method: 'get',
        url: articleUrl,
        withCredentials: false,
      }).then((articleContent) => {
        articleContent = `<h2 class="article-title">${title}</h2><div class="hr-line border-bottom-1px"></div><div class="article-main-pal"><div class="article-cover-zone"><img src="${coverUrl}" alt="article_cover" class="img-loading" width="750" height="420"></div></div><div class="article article-main-pal" ref="articleMainContainer">${articleContent}</div>`;
        this.articleContent = articleContent;
        console.log(articleContent);
        this.initStrLazyImg(articleContent);
        if (this.isYoJiangApp) {
          setTimeout(() => {
            window.android.afterRender();
          }, 20);
        }
      });
    },
    getContentDetail(id) {
      requestContentDetail(id).then((res) => {
        this.contentData = res.data;
        this.articleData = this.contentData.article;
        if (this.contentData.content_type === TYPE_CONTENT.article && this.contentData.article) {
          // 文章内容 TODO
          const { article } = this.contentData;

          const articleUrl = process.env.NODE_ENV !== 'development' ? article.article_url : article.article_url.replace('http://talcdn.jhkong.com', '');
          this.$axios({
            method: 'get',
            url: articleUrl,
            withCredentials: false,
          }).then((articleContent) => {
            articleContent = `<h2 class="article-title">${this.articleData.title}</h2><div class="hr-line border-bottom-1px"></div><div class="article-main-pal"><div class="article-cover-zone"><img src="${this.articleData.cover_url}" alt="article_cover" class="img-loading" width="750" height="420"></div></div><div class="article article-main-pal" ref="articleMainContainer">${articleContent}</div>`;
            this.articleContent = articleContent;
            console.log(articleContent);
            this.initStrLazyImg(articleContent);
            if (this.isYoJiangApp) {
              setTimeout(() => {
                window.android.afterRender();
              }, 100);
            }
          });
        }
      });
    },
    onImgLoad() {
      console.log('onImgLoad');
    },
    initStrLazyImg(text) {
      new strHtmlLazyload(this.$refs.articleContainer, text, {
        ableLazyLoad: true, // 开启懒加载，替换图片
        urlResizeType: 'auto', // 图片路径压缩，oss：阿里，qiniu: 七牛， none: 不压缩，auto：根据配置链接自适应,必须填写ossUrlPrefix, qiniuUrlPrefix
        isYojiangApp: this.isYoJiangApp, // 是否是在有讲APP
        imgBigCheck: true,
        ossUrlPrefix: 'alcdn.yojiang.cn',
        qiniuUrlPrefix: 'img.yojiang.cn',
        ableRatio: this.isIos, // 是否开启按屏幕像素比获取图片
      });
    },
  },
};
</script>

<style lang="stylus">

  @import "./../common/stylus/variable.styl"

  .article-pager {
    padding: 0 16px
    background-color: #ffffff
  }
  .content-article-container {
    padding-bottom: 200px
    .article-title {
      position: relative
      display: block
      margin-bottom: 24px
      word-wrap: break-word
      line-height: 34px
      color: $color-text;
      font-size: 24px;
      font-weight: 800
      text-align: justify;
    }
    .hr-line {
      margin: 24px 8px
      height: 1px
      background-color: #F2F2F2
    }
    .article-cover-zone {
      position: relative
      margin-bottom: 24px
      overflow: hidden
      img {
        display: block
        margin: auto
        object-fit cover
      }
    }
  }

  .article {
    font-size: 16px
    line-height: 28px
  }
</style>
