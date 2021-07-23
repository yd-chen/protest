<template>
  <div class="content-detail-wrapper">
    <top-download-banner></top-download-banner>
    <section class="scroll-list-wrap">
      <cube-scroll
        ref="scroll"
        :data="concatData"
        :options="options"
        :scrollEvents="['before-scroll-start', 'scroll-end', 'scroll']"
        @before-scroll-start="scrollStart"
        @scroll-end="scrollEnd"
        @scroll="scroll"
        @pulling-down="onPullingDown"
      >
        <div class="content-item-page">
          <div class="content-item-wrap">
            <div class="content-container" ref="contentContainer">

              <div
                class="content-image-list"
                v-if="contentData.images && contentData.images.length"
                v-cloak
              >
                <content-image
                  :cover-image-url="contentData.cover_img"
                  :title="contentData.title"
                  :description="contentData.description"
                  :data="contentData.images"
                  :publish-user-data="contentData.user"
                  @imageLoad="onImgLoad"
                ></content-image>
              </div>

              <div
                class="content-article"
                :class="{'allow-all-article':isAllowArticleAll}"
                v-if="contentData.article && contentData.article.article_url"
              >
                <content-article
                  :data="contentData.article"
                  :article-content="articleContent"
                  :publish-user-data="contentData.user"
                  ref="articleContainer"
                  @imageLoad="onImgLoad"
                ></content-article>
                <div class="unfold-field" v-if="!isAllowArticleAll" v-cloak>
                  <div class="btn-wrapper">
                    <div class="unflod-field__mask" @click.prevent.stop="allowAllArticle"></div>
                    <a
                      href="javascript:void(0)"
                      class="download-text"
                      @click.prevent="openAppDownload"
                    >打开APP阅读全文</a>
                  </div>
                </div>
              </div>
              <div
                class="content-player-container"
                v-if="contentData.video && contentData.video.video_url"
              >
                <content-player
                  ref="contentPlayerZone"
                  :cover-image-url="contentData.cover_img"
                  :title="contentData.title"
                  :video-url="contentData.video.video_url"
                  :height="videoHeight"
                  :width="videoWidth"
                  :video-cover="contentData.video.cover_url"
                  :publish-user-data="contentData.user"
                ></content-player>
              </div>
            </div>
            <div class="content-extra-wrap" v-if="contentData && contentData.id" v-cloak>
              <div class="tag-wrap">
                <content-tag :tag="contentData.label_name" @tagClick="jumpTagPage"></content-tag>
                <div class="view-wrap">
                  <span class="view-text">{{contentData.watch_count}}已看</span>
                </div>
              </div>
            </div>
            <!-- <div class="content-share" v-if="contentData && contentData.id" v-cloak>
              <div class="share-wrap">
                <div class="share-text">分享到</div>
                <div class="share-btn border-1px border-1px-full" @click.stop="showWxShareToast">
                  <img
                    class="share-icon"
                    src="@/common/images/share_icon_wechat.png"
                    alt="share_icon_wechat.png"
                  />
                  <span class="text">微信</span>
                </div>
                <div class="share-btn border-1px border-1px-full" @click.stop="showWxShareToast">
                  <img
                    class="share-icon"
                    src="@/common/images/share_icon_pyq.png"
                    alt="share_icon_wechat.png"
                  />
                  <span class="text">朋友圈</span>
                </div>
              </div>
            </div> -->
          </div>
          <div class="recommend-list-wrap" v-if="recommendList && recommendList.length" v-cloak>
            <div class="mod-title">
              <h2 class="title">相关推荐</h2>
            </div>
            <div class="recommend-list-container">
              <cube-slide ref="slide" :auto-play="false" :data="recommendList">
                <cube-slide-item v-for="(item, index) in recommendList" :key="index">
                  <detail-recommend-item-column :recommend="item" :key="index"></detail-recommend-item-column>
                </cube-slide-item>
              </cube-slide>
            </div>
          </div>
          <div class="comment-list-wrap" v-if="contentData && contentData.id && hotCommentCount" v-cloak>
            <div class="mod-title">
              <h2 class="title">
                热门评论
                <small v-if="this.hotCommentCount">({{hotCommentCount}}条)</small>
              </h2>
            </div>
            <comment-list
              :commentList="this.hotCommentList"
              :show-guide-btn="false"
              @onLike="onLike"
              @clickMoreComments="showGuideApp"
            ></comment-list>
          </div>
          <div class="comment-list-wrap" v-if="contentData && contentData.id" v-cloak>
            <div class="mod-title">
              <h2 class="title">
                最新评论
                <small v-if="this.commentCount">({{commentCount}}条)</small>
              </h2>
            </div>
            <comment-list
              :commentList="this.commentList"
              :show-guide-btn="showGuideBtn"
              @onLike="onLike"
              @clickMoreComments="showGuideApp"
            ></comment-list>
          </div>
        </div>
      </cube-scroll>
    </section>
    <!-- 页面加载展位图 -->
    <div class="tombstone" v-if="!readyContentOver" v-cloak>
      <div class="bubble">
        <div class="head">
          <div class="avatar"></div>
          <div class="head-right">
            <p class="animated-background"></p>
            <p class="animated-background"></p>
          </div>
        </div>
        <p class="animated-background"></p>
        <p class="animated-background"></p>
        <p class="animated-background"></p>
        <p class="animated-background"></p>
      </div>
    </div>
    <bottom-open-app-tip ref="bottomOpenAppTip"></bottom-open-app-tip>
    <wx-share-toast :timeout-hide="true" ref="wxShareToast" :mask-closable="true"></wx-share-toast>
  </div>
</template>

<script>
/* eslint-disable */
import { mapMutations } from "vuex";
import contentPlayer from "@/components/contentPlayer/contentPlayer.vue";
import topDownloadBanner from "@/components/topDownloadBanner/topDownloadBanner.vue";
import bottomOpenAppTip from "@/components/bottomOpenAppTip/bottomOpenAppTip.vue";
import contentTag from "@/components/contentTag/contentTag.vue";
import wxShareToast from "@/components/wxShareToast/wxShareToast.vue";
import commentList from "@/components/commentList/commentList.vue";
import contentImage from "@/components/contentImage/contentImage.vue";
import contentArticle from "@/components/contentArticle/contentArticle.vue";
import detailRecommendItemColumn from "@/components/detailRecommendItem/detailRecommendItemColumn.vue";
import publishUser from "@/components/publishUser/publishUser.vue";

import {
  requestContentDetail,
  requestDetailRecommend,
  requestContentRecommend,
  requestComments_v3_1
} from "@/api/api";
import { TYPE_CONTENT, contentWxDescs } from "@/common/js/config";
import { getRandomInt } from "@/common/js/utils";
import { initWxConfig } from "@/config/wxConfig";
import { openAppMixin } from "@/mixin/openAppMixin";

// 滚动才显示出底部引导按钮的距离
const SHOW_BOTTOM_OFFSET = 660;

export default {
  name: "ContentDetail",
  mixins: [openAppMixin],
  components: {
    contentPlayer,
    topDownloadBanner,
    contentTag,
    wxShareToast,
    commentList,
    bottomOpenAppTip,
    contentImage,
    contentArticle,
    detailRecommendItemColumn,
    publishUser
  },
  computed: {
    options() {
      return {
        scrollbar: true,
        pullUpLoad: this.pullUpLoadObj,
        useTransition: false
      };
    },
    pullUpLoadObj() {
      return !this.commentNotMore;
    },
    concatData() {
      return this.commentList.concat(this.recommendList);
    }
  },
  data() {
    return {
      SHOW_BOTTOM_OFFSET,
      TYPE_CONTENT,
      contentId: 0,
      contentUserId: 0,
      contentData: {},
      commentList: [],
      hotCommentList: [],
      commentCount: 0,
      hotCommentCount: 0,
      recommendList: [],
      videoHeight: "",
      videoWidth: "",
      articleContent: "",
      showGuideBtn: false,
      readyContentOver: false,
      isAllowArticleAll: false
    };
  },
  created() {
    this.contentId = this.$route.query.id;
    this.ticketCode = this.$route.query.ticket || null;
    this.ininPageData();
  },
  mounted() {},
  methods: {
    onLike(comment, index) {
      console.log("onLike: ", ...arguments);
      this.showGuideApp();
    },
    getContentDetail(id, ticketCode) {
      requestContentDetail(id, ticketCode)
        .then(res => {
          this.contentData = res.data;
          console.log(this.contentData);
          // this.video = this.contentData.video;
          // this.getHotComments();
          if (this.contentData.content_type === TYPE_CONTENT.ext_url) {
            location.href = this.contentData.ext_url
          } else if (
            this.contentData.content_type === TYPE_CONTENT.picture &&
            this.contentData.images
          ) {
            // 图片，处理图片预览urls
            // 图片内容 TODO
            this.setReadyOver();
            this.getComments();
            this.getDetailRecommend();
          } else if (
            this.contentData.content_type === TYPE_CONTENT.video &&
            this.contentData.video
          ) {
            // 视频，处理宽高问题
            const { video } = this.contentData;
            const containerWidth = this.$refs.contentContainer.clientWidth;
            if (video.video_width / video.video_height >= 1) {
              let height =
                containerWidth / (video.video_width / video.video_height);
              height = Math.min(height, 450);
              this.videoHeight = `${height}px`;
              this.videoWidth = `${containerWidth}px`;
            } else {
              this.videoHeight = `${containerWidth}px`;
              this.videoWidth = `${containerWidth}px`;
            }
            this.contentPlayerZone = this.$refs.contentPlayerZone;
            if (this.contentPlayerZone) {
              this.contentPlayerZone.resetVideoClassName();
            }
            this.setReadyOver();
            this.getComments();
            this.getDetailRecommend();
          } else if (
            this.contentData.content_type === TYPE_CONTENT.article &&
            this.contentData.article
          ) {
            // 文章内容 TODO
            const { article } = this.contentData;
            let articleUrl =
              process.env.NODE_ENV !== "development"
                ? article.article_url
                : article.article_url.replace("http://talcdn.jhkong.com", "");
            if (window.location.protocol === "https:") {
              articleUrl = articleUrl.replace("http:", "https:");
            }
            this.$axios({
              method: "get",
              url: articleUrl,
              withCredentials: false
            }).then(articleContent => {
              this.articleContent = articleContent;
              this.setReadyOver();
              this.getComments();
              this.getDetailRecommend();
            });
          }
        })
        .then(() => {
          this.initWxJssdk();
        });
    },
    getComments() {
      requestComments_v3_1(
        77,
        this.contentId,
        3,
        this.commentOffset,
        this.commentLimit
      ).then(res => {
        const items = res.items
        this.showGuideBtn = res.count > this.commentLimit;
        // 最新评论数(已减去热门评论数)
        this.commentCount = res.count;
        this.commentOffset += this.commentLimit;
        // 热评OR最新评论
        res.items.length && items.map((item) => {
          if (item.is_hot) {
            this.hotCommentList.push(item)
            this.hotCommentCount += 1
          } else {
            this.commentList.push(item)
          }
        })
        if (this.commentOffset >= res.count) {
          this.$refs.scroll.forceUpdate();
          this.commentNotMore = true;
        }
      });
    },
    getDetailRecommend() {
      requestDetailRecommend(this.contentId).then(res => {
        // const { items } = res.data;
        // const recommendList = [];
        // let curGroup = [];
        // items.forEach((item, index, oldItems) => {
        //   curGroup.push(item);
        //   if (curGroup.length > 1) {
        //     recommendList.push(curGroup);
        //     curGroup = [];
        //   }
        // });

        // this.recommendList = recommendList;
        this.recommendList = res.data.items;
      });
    },
    getDetailRecommendTest() {
      requestContentRecommend().then(res => {
        const items = res.data;
        const recommendList = [];
        let curGroup = [];
        items.forEach((item, index, oldItems) => {
          curGroup.push(item);
          if (curGroup.length > 1) {
            recommendList.push(curGroup);
            curGroup = [];
          }
        });

        console.log(recommendList);
        this.recommendList = recommendList;
      });
    },
    showErrorUrlToast() {
      this.$createDialog({
        type: "alert",
        title: "错误",
        content: "该链接没有找到您想要的内容！"
      }).show();
    },
    ininPageData() {
      this.contentData = {};
      this.articleContent = '';
      this.commentList = [];
      this.hotCommentCount = 0;
      this.hotCommentList = [];
      this.commentCount = 0;
      this.recommendList = [];
      if (this.contentId) {
        this.getContentDetail(this.contentId, this.ticketCode);
        this.commentOffset = 0;
        this.commentLimit = 5;
        this.commentNotMore = true;
        this.readyContentOver = false;
        this.isAllowArticleAll = false;
      } else {
        this.showErrorUrlToast();
      }
    },
    onPullingDown() {
      this.getComments();
    },
    onImgLoad() {
      const { scroll } = this.$refs;
      scroll.refresh();
    },
    showWxShareToast() {
      this.$refs.wxShareToast.show();
    },
    showGuideApp() {
      this.setGuideAppFlag(true);
    },
    scrollStart() {
      this.bottomOpenTimer && clearTimeout(this.bottomOpenTimer);
      // this.$refs.bottomOpenAppTip.hide();
    },
    scrollEnd(pos) {
      // this.bottomOpenTimer && clearTimeout(this.bottomOpenTimer);
      // if (Math.abs(pos.y) > SHOW_BOTTOM_OFFSET) {
      //   this.bottomOpenTimer = setTimeout(() => {
      //     this.$refs.bottomOpenAppTip.show();
      //   }, 2000);
      // }
    },
    scroll() {
      if (
        this.contentData.content_type === TYPE_CONTENT.article &&
        this.contentData.article
      ) {
        this.$refs.articleContainer.updateImages();
      }
    },
    initWxJssdk() {
      let shareTitle = "";
      const shareDesc =
        contentWxDescs[getRandomInt(0, contentWxDescs.length - 1)];
      const shareLink = location.href;
      let shareImgUrl = "";

      if (
        this.contentData.content_type === TYPE_CONTENT.video &&
        this.contentData.video
      ) {
        shareImgUrl = this.contentData.video.cover_url;
        shareTitle = this.contentData.description
          ? this.contentData.description
          : `${this.contentData.user.nickname}发布了一个新技能`;
      }
      if (
        this.contentData.content_type === TYPE_CONTENT.picture &&
        this.contentData.images
      ) {
        shareImgUrl = this.contentData.images[0].middle_url;
        shareTitle = this.contentData.description
          ? `【视频】${this.contentData.description}`
          : `${this.contentData.user.nickname}发布了一个新技能`;
      }
      if (
        this.contentData.content_type === TYPE_CONTENT.article &&
        this.contentData.article
      ) {
        shareImgUrl = this.contentData.article.cover_url;
        shareTitle = this.contentData.article.title;
      }
      initWxConfig().then(() => {
        wx.ready(() => {
          wx.onMenuShareAppMessage({
            title: shareTitle, // 分享标题
            desc: shareDesc, // 分享描述
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareImgUrl, // 分享图标
            type: "", // 分享类型,music、video或link，不填默认为link
            dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
            success() {
              // 用户点击了分享后执行的回调函数
              console.log("分享成功了啥？");
            }
          });

          wx.onMenuShareTimeline({
            title: shareTitle, // 分享标题
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareImgUrl, // 分享图标
            success() {
              // 用户点击了分享后执行的回调函数
              console.log("朋友圈分享成功了啥？");
            }
          });
        });
      });
    },
    jumpTagPage() {
      this.$router.push({
        path: "category",
        query: {
          id: this.contentData.label_id
        }
      });
    },
    setReadyOver() {
      this.readyOverTimer && clearTimeout(this.readyOverTimer);
      this.readyOverTimer = setTimeout(() => {
        this.readyContentOver = true;
      }, 200);
    },
    allowAllArticle() {
      this.isAllowArticleAll = true;

      const { scroll } = this.$refs;
      scroll.refresh();
    },
    ...mapMutations({
      setGuideAppFlag: "SET_GUIDE_APP_FLAG"
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      console.log("beforeRouteEnter", vm.contentId)
      if (to.query.id !== vm.contentId) {
        vm.contentId = to.query.id;
        vm.ininPageData();
        console.log("beforeRouteUpdate: ", vm.contentId);
        vm.$refs.scroll.scrollTo(0, 0);
      }
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.contentId = to.query.id;
    this.ininPageData();
    console.log("beforeRouteUpdate: ", this.contentId);
    this.$refs.scroll.scrollTo(0, 0);
    next();
  }
};
</script>

<style lang="stylus" scoped>
@import './../../common/stylus/variable.styl';
@import './../../common/stylus/mixin.styl';

.content-detail-wrapper {
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  margin: auto;
  width: 100vw;
  height: 100vh;
  max-width: 640px;
  background-color: #fff;
  overflow: hidden;
}

.scroll-list-wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding-top: 60px;
}

.content-item-page {
  padding-bottom: 60px;
}

.content-container {
  .content-desc {
    display: block;
    margin-top: 12px;
  }

  .content-image-list {
    margin: 0;
  }

  .content-player-container {
    // margin-top: 10px;
  }

  .content-article {
    position: relative;
    overflow: hidden;
    max-height: 1100px;

    &.allow-all-article {
      height: auto;
      max-height: none;
    }

    .unfold-field {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      // background: linear-gradient(to top, #fff 0, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.2) 100%);
      box-shadow: 0 -10px 20px 10px rgba(255, 255, 255, 0.2);

      .btn-wrapper {
        padding: 12px 16px;
        background: #fff;
      }

      .unflod-field__mask {
        position: absolute;
        left: 0;
        right: 0;
        top: -78px;
        height: 78px;
        background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0) 0, #FFFFFF 100%);

        &::before {
          content: '';
          display: inline-block;
          background-image: url('./allow-bottom.png');
          background-repeat: no-repeat;
          background-size: contain;
          vertical-align: middle;
          margin-top: 45px;
          height: 16px;
          width: 16px;
          animation: unfold-arrow-animation 0.6s infinite alternate;
        }
      }

      .download-text {
        display: block;
        width: 100%;
        height: 37px;
        line-height: 37px;
        background-color: $color-theme;
        border-radius: 100px;
        font-size: 15px;
        color: #fff;
      }
    }
  }
}

.content-extra-wrap {
  display: block;
  position: relative;
  margin: 8px 16px 0;
  height: 24px;

  .view-wrap {
    float: right;
    display: block;
    margin-top: 4px;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    text-align: right;

    .view-text {
      color: $color-text-ll;
    }
  }
}

.share-wrap {
  padding: 28px 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .share-text {
    margin-right: 14px;
    height: 20px;
    line-height: 20px;
    color: $color-text-l;
    font-size: 14px;
    text-align: center;
  }

  .share-btn {
    position: relative;
    padding: 0 8px;
    height: 28px;
    margin: 0 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &::before {
      content: '';
      position: absolute;
      top: -5px;
      bottom: -5px;
      left: -5px;
      right: -5px;
    }

    &::after {
      content: '';
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      pointer-events: none;
      box-sizing: border-box;
      transform-origin: top left;
      border: 1px solid #E5E5E5;
      border-radius: 100px;
    }

    .share-icon {
      display: block;
      width: 24px;
      height: 24px;
      margin-right: 2px;
      object-fit: cover;
    }

    .text {
      color: rgba(153, 153, 153, 1);
      font-size: 14px;
      text-align: center;
      font-family: PingFangSC-Regular;
    }
  }
}

.content-item-wrap {
  margin-bottom 24px
}

.recommend-list-container {
  width 100%
  padding 16px 12px 24px 12px
}

.mod-title {
  padding: 12px 16px;

  .title {
    height: 20px;
    line-height: 20px;
    color: $color-text;
    font-size: 20px;
    font-weight: 600;
    text-align: left;

    small {
      font-size: 12px;
      color: $color-text-l;
    }
  }
}

.tombstone {
  position: fixed;
  top: 60px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  margin: auto;
  max-width: 640px;
  display: block;
  opacity: 1;

  p {
    width: 100%;
    height: 0.5em;
    background-color: #ccc;
    margin: 0.5em 0;
  }
}

.bubble {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  padding: 20px 16px 0;
  background: #fff;
  color: #333;

  .head {
    display: flex;
    margin-bottom: 24px;

    .avatar {
      width: 40px;
      height: 40px;
      margin-right: 12px;
      border-radius: 50%;
      overflow: hidden;
      background-image: url('./../../common/images/default.jpg');
      background-size: cover;
      outline: none;
    }

    .head-right {
      flex: 1 1 auto;
      width: 1%;
    }
  }

  @keyframes placeHolderShimmer {
    0% {
      background-position: -468px 0;
    }

    100% {
      background-position: 468px 0;
    }
  }

  @keyframes unfold-arrow-animation {
    0% {
      transform: translate(0, 0);
    }

    100% {
      transform: translate(0, 10px);
    }
  }

  .animated-background {
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: #f6f7f8;
    background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
    background-size: 800px 104px;
    position: relative;
  }

  .cube-image-preview .cube-popup-mask {
    opacity: 1;
  }
}
.comment-list-wrap {
  & + .comment-list-wrap {
    margin-top 16px
  }
}
</style>
