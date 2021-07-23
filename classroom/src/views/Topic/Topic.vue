<template>
  <div class="category-pager">
    <top-download-banner></top-download-banner>
    <section class="scroll-list-wrap">
      <cube-scroll ref="scroll"
                   :data="recommendList"
                   :scrollEvents="['before-scroll-start', 'scroll-end', 'scroll']"
                   @before-scroll-start="scrollStart"
                   @scroll-end="scrollEnd"
                   @pulling-up="onPullingUp"
                   :options="options">
        <div class="brand"  v-if="topicInfo">
          <div class="brand_bg" :style="{'background-image': 'url(' + topicInfo.cover_img + ')'}"></div>
          <div class="brand-main">
            <div class="label-cover-img">
              <img v-lazy="topicInfo.cover_img" :key="topicInfo.cover_img" alt="">
            </div>
            <div class="labels-about">
              <h4 class="label-name" v-text="topicInfo.name"></h4>
              <router-link class="user-info" :to="{ path: 'user', query: { id: topicInfo.user.user_id }}">
                <img class="portrait" v-lazy="topicInfo.user.portrait" :key="topicInfo.user.portrait" alt="">
                <span class="nickname">{{topicInfo.user.nickname}}</span>
              </router-link>
              <div class="label-details">
                <p class="viewed-num">{{topicArticleCount}}篇内容</p>
                <p class="cont-num">{{topicInfo.subscribe_count ? computeWatchCount(topicInfo.subscribe_count) : topicInfo.subscribe_count}}订阅</p>
              </div>

              <div class="head-right-zone">
                <div class="follow-btn" @click.prevent.stop="showGuideApp">
                  <i class="icon icon-add"></i>
                  <span class="btn-text">订阅</span>
                </div>
              </div>
            </div>
          </div>
          <div class="brand-intro">
            <div class="intro-zone" @click.prevent.stop="toggleIntroShow">
              <span id="description" class="desc">{{formatText}}</span>
              <i class="icon-plus" v-show="showIconPlus" v-cloak></i>
            </div>
          </div>
        </div>
        <div class="list-container">
          <ul class="recommend-list" v-if="recommendList.length">
            <template v-for="(item, idx) in recommendList">
              <new-detail-recommend-item :recommend="item" :key="idx"></new-detail-recommend-item>
            </template>
          </ul>
          <div class="empty-container" v-show="!recommendList.length && dataReady" v-cloak>
            <content-empty msg="空空如也~"></content-empty>
          </div>
        </div>
      </cube-scroll>
    </section>
    <bottom-open-app-tip ref="bottomOpenAppTip"></bottom-open-app-tip>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import topDownloadBanner from '@/components/topDownloadBanner/topDownloadBanner.vue';
import bottomOpenAppTip from '@/components/bottomOpenAppTip/bottomOpenAppTip.vue';
import contentEmpty from '@/components/contentEmpty/contentEmpty.vue';
import newDetailRecommendItem from '@/components/detailRecommendItem/newDetailRecommendItem.vue';

import { requestTopicDetail, requestTopicConetnts } from '@/api/api';
import { handleCount } from '@/common/js/utils';
import wxJssdkMixin from '@/mixin/wxJssdkMixin';

export default {
  name: 'topic',
  mixins: [wxJssdkMixin],
  components: {
    bottomOpenAppTip,
    contentEmpty,
    newDetailRecommendItem,
    topDownloadBanner,
  },
  data() {
    return {
      dataReady: false,
      recommendList: [],
      topicInfo: '',
      topicId: '',
      topicArticleCount: 0,
      showIntroFlag: false,
      formatText: '',
      showIconPlus: false,
      topicOffset: 0,
      topicLimit: 10
    };
  },
  computed: {
    options() {
      return {
        scrollbar: true,
        useTransition: false,
        pullUpLoad: true,
      };
    },
    listOptions() {
      return {
        jumpToUser: true, // 头部用户能否跳转个人主页
        showRight: true, // 显示右边按钮
      };
    },
  },
  created() {
    this.topicId = this.$route.query.id;
    this.getTopicDetail(this.$route.query.id);
    this.getTopicInfoList(this.$route.query.id, this.topicOffset, this.topicLimit);
  },
  methods: {
    formatStr(description) {
      const text = `简介：${description}`;
      let result = '';
      if (this.showIntroFlag) {
        result = text;
        this.showIconPlus = false;
      } else {
        // const ele = document.getElementById('description')
        // const baseWidth = window.getComputedStyle(ele).width
        // const baseFontSize = window.getComputedStyle(ele).fontSize
        // '48'是左右padding
        const baseWidth = `${document.body.clientWidth - 48}px`;
        const baseFontSize = '12px';
        const baseLineHeight = '18px';
        const lineNum = 2; // 行数
        const limitHeight = parseInt(baseLineHeight) * lineNum;
        const lineWidth = +baseWidth.slice(0, -2);
        const rightBlankNum = 4; // 右侧留白数

        // 设置省略号，通过创建一个div按照同样的样式逐个字符显示文本内容
        const newDiv = document.createElement('div');
        newDiv.style.width = baseWidth;
        newDiv.style.lineHeight = baseLineHeight;
        newDiv.style.fontSize = baseFontSize;
        newDiv.style.visibility = 'hidden';
        document.body.appendChild(newDiv);
        // 获取到达指定行数时的字符下标
        let targetIndex;
        for (let i = 0, len = text.length; i < len; i++) {
          newDiv.innerHTML = text.substring(0, i);
          if (newDiv.clientHeight > limitHeight) {
            targetIndex = i;
            break;
          }
        }
        document.body.removeChild(newDiv);
        result = targetIndex ? `${text.substr(0, targetIndex - rightBlankNum - 5)}...` : text;

        // 判断显示“展示”图标
        this.showIconPlus = !!targetIndex;
      }

      this.formatText = result;
    },
    handleCount,
    getTopicDetail(id) {
      requestTopicDetail(id).then((res) => {
        if (res.code === 0 && res.data) {
          this.topicInfo = res.data;
          this.formatStr(this.topicInfo.description);
        } else {
          this.$router.replace({
            path: '404',
          });
        }
      }).then(() => {
        const shareData = {};
        const shareTitle = `#${this.topicInfo.name} 这个目录非常有趣！`;
        const shareDesc = '分享你一个宝典，集合好多的知识和技能，体验到一把学到满足的感觉，真香~';
        const shareImgUrl = this.topicInfo.cover_img;

        shareData.title = shareTitle;
        shareData.desc = shareDesc;
        shareData.link = window.location.href;
        shareData.imgUrl = shareImgUrl;

        this.initWxJssdk(shareData);
      });
    },
    onPullingUp() {
      console.log('onPullingUp');
      this.getTopicInfoList(this.topicId, this.topicOffset, this.topicLimit);
    },
    getTopicInfoList(id, offset, limit) {
      requestTopicConetnts(...arguments).then((res) => {
        const resData = res.data;
        this.topicArticleCount = res.data.count;
        if (resData && resData.items.length) {
          this.recommendList = this.recommendList.concat(resData.items);
          this.topicOffset += this.topicLimit;
          this.dataReady = true;
        } else {
          console.log('没有更多数据了');
          this.dataReady = true;
          this.$refs.scroll.forceUpdate();
        }
      });
    },
    computeWatchCount(count) {
      if (count !== 'None') {
        return this.handleCount(count);
      }
      return 0;
    },
    scrollStart() {
      if (this.bottomOpenTimer) {
        clearTimeout(this.bottomOpenTimer);
      }
      this.$refs.bottomOpenAppTip.hide();
    },
    scrollEnd() {
      if (this.bottomOpenTimer) {
        clearTimeout(this.bottomOpenTimer);
      }
      this.bottomOpenTimer = setTimeout(() => {
        this.$refs.bottomOpenAppTip.show();
      }, 200);
    },
    onImgLoad() {
      const { scroll } = this.$refs;
      scroll.refresh();
    },
    showGuideApp() {
      this.setGuideAppFlag(true);
    },
    toggleIntroShow() {
      this.showIntroFlag = !this.showIntroFlag;
      this.formatStr(this.topicInfo.description);
    },
    ...mapMutations({
      setGuideAppFlag: 'SET_GUIDE_APP_FLAG',
    }),
  },
  watch: {
    $route(to, from) {
      if (to.path === '/category' && to.query.id !== from.query.id) {
        this.topicId = to.query.id;
        this.$refs.scroll.scrollTo(0, 0);
        this.topicOffset = 0;
        this.recommendList = [];
        this.getTopicInfoList(this.topicId, this.topicOffset, this.topicLimit);
        this.getTopicDetail(this.topicId);
      }
    },
  },
};
</script>

<style scoped lang="stylus">
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"
  .category-pager {
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 1
    margin: auto
    width: 100vw
    height: 100vh
    max-width: 640px
    background: $color-background
  }
  .scroll-list-wrap {
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 10
    margin: auto
    padding-top: 60px;
  }


  .brand {
    width 100%
    min-height 241px
    position relative
    z-index: 2
    overflow hidden

    .brand_bg {
      position absolute
      left: 0
      right: 0
      top: 0
      bottom: 0
      margin: auto
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      -webkit-filter blur(30px)
      filter blur(30px)
      transform: scale(1.5);
      &::after {
        content: ''
        position: absolute
        left: 0
        right: 0
        top: 0
        bottom: 0
        margin: auto
        background-color: rgba(0, 0, 0, .6)
      }
    }
    .brand-bg {
      position absolute
      width 100%
    }
    .brand-main {
      margin: auto
      width 100%
      display flex
      padding: 72px 16px 16px
      .label-cover-img {
        position: relative
        width 109px
        height 109px
        overflow: hidden
        margin 0 12px 0 0
        img {
          position: absolute
          left: 0
          right: 0
          top: 0
          bottom: 0
          margin: auto
          display: block
          width 100%
          height 100%
          border-radius 8px
          overflow: hidden
          object-fit cover
        }
      }
      .labels-about {
        position: relative
        flex: 1 1 auto;
        width: 1%
        .label-name {
          max-height 48px
          margin 1px 0 12px
          line-height 24px
          color #fff
          font-size 20px
          text-align left
          font-weight: 900
          multi-line(2)
        }
        .user-info {
          position relative
          margin-bottom 12px
          .portrait {
            position absolute
            top 0
            left 0
            width 24px
            height 24px
            border-radius 100%
          }
          .nickname {
            width 100%
            padding-left 28px
            font-size 12px
            font-weight 400
            color #DADADA
            text-align left
            line-height 24px
            multi-line(1)
          }
        }
        .label-details {
          position absolute
          bottom 0
          left 0
          display: flex
          flex-direction row
          height 12px
          line-height 12px
          color #fff
          font-size 12px
          text-align left
          p {
            &+p {
              margin-left: 4px
            }
          }
        }
        .head-right-zone {
          position: absolute
          right: 0
          bottom: 0
          .follow-btn {
            position: relative
            width: 62px
            height: 26px;
            display: flex
            align-items: center
            justify-content: center
            background-color: $color-theme
            background: $color-theme linear-gradient(to right, #FCB13F, #FA8C1D) 0 0 no-repeat
            border-radius: 14px
            ::before {
              content ''
              position: absolute
              top: -8px
              right: -10px
              bottom: -8px
              left: -10px
            }
            .icon-add {
              display: block
              width: 10px
              height: 10px
              margin-right: 3px
              background: transparent url(./com_icon_follow3_de.png) center center no-repeat
              background-size: 12px
            }
            .btn-text {
              font-size: 12px
              color: #fff
            }
          }
        }
      }
    }

    .brand-intro {
      margin: 0 16px 24px
      &::before {
        content ''
        position: absolute
        top: -5px
        bottom: -5px
        width: 100%vf
      }
      .intro-zone {
        position: relative
        display: flex
        align-items: center
        padding: 10px 8px
        border-radius 4px
        background: rgba(255, 255, 255, 0.05)
        font-size: 12px
        line-height: 18px
        color: $color-text-ll
        .icon-plus {
          position absolute
          right 8px
          bottom 10px
          display: inline-block
          width: 50px
          height: 18px
          background url(./btn_see_more@2x.png) center center no-repeat
          background-size cover
        }
        // .desc {
        //   display block
        //   font-size 12px
        // }
        .see-more {
          display inline-block
          min-width: 50px
          height: 18px
          background url(./btn_see_more@2x.png) center center no-repeat
          background-size cover
        }
        &::after {
          content: ''
          position: absolute
          right: 0
          top: 0
          bottom: 0
        }
        .intro-tit {
          display: block
          font-weight: 500
          color: #ffffff
        }
        .intro-text {
          no-wrap();
        }
        .icon {
          position: absolute
          right: 0
          top: 0
          bottom: 0
          margin: auto
          width: 12px
          height: 12px
          display: flex
          align-items: center
          justify-content: center
          background: transparent url(./com_icon_arr_3.png) center center no-repeat
          background-size: 12px
        }
      }
    }
  }

  .intro-details-dialog {
    position: absolute
    left: 16px
    top: 191px
    z-index: 10
    .mask {
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      margin: auto
      width: 100%
      height: 100%
      background-color: transparent
    }
    .details-body {
      position: relative
      z-index: 2
      width: 248px;
      padding: 12px
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.16);
      background-color: #fff
      border-radius: 8px
      &::before {
        content: ' ';
        position: absolute;
        bottom: 100%;
        left: 20px
        width: 0;
        height: 0;
        border: solid transparent;
        border-width: 9px;
        border-bottom-color: #fff;
      }
      .detail-title {
        margin-bottom: 8px
        height: 14px;
        line-height: 14px;
        color: $color-text;
        font-size: 14px;
        font-weight: 500
        text-align: left;
      }
      .details-main {
        line-height: 20px;
        color: $color-text-d
        font-size: 14px;
        text-align: justify;
      }
      .detail-close {
        extend-click()
        position: absolute
        right: -5px
        bottom: -5px
        width: 24px
        height: 24px
        border-radius: 50%
        background: transparent url(./com_icon_close2.png) center center no-repeat
        background-size: 24px
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .list-container {
    position relative
    z-index 2
    background #ffffff
    border-radius 12px 12px 0 0
    overflow hidden
    margin-top -12px
    .recommend-list {
      padding-bottom: 60px
      .item {
        padding: 8px 16px

      }
    }
  }

  .empty-container {
    // height: calc(100vh - 241px);
    padding-bottom: 60px
    display flex
    align-items center
    justify-content center
  }

</style>
