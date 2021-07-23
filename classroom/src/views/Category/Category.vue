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
            <div class="labels-about">
              <h4 class="label-name" v-text="'#' + topicInfo.label_name"></h4>
              <div class="label-details">
                <span class="viewed-num">观看 {{topicInfo.total_watch ? computeWatchCount(topicInfo.total_watch) : topicInfo.total_watch}} </span>
                <span class="cont-num">内容 {{topicInfo.count}}</span>
              </div>
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
/* eslint-disable no-unused-expressions */
import topDownloadBanner from '@/components/topDownloadBanner/topDownloadBanner.vue';
import bottomOpenAppTip from '@/components/bottomOpenAppTip/bottomOpenAppTip.vue';
import contentEmpty from '@/components/contentEmpty/contentEmpty.vue';
import newDetailRecommendItem from '@/components/detailRecommendItem/newDetailRecommendItem.vue';

import { requesttopicInfo } from '@/api/api';
import { handleCount } from '@/common/js/utils';
import wxJssdkMixin from '@/mixin/wxJssdkMixin';

export default {
  name: 'category',
  mixins: [wxJssdkMixin],
  data() {
    return {
      dataReady: false,
      recommendList: [],
      topicInfo: '',
      topicId: '',
      topicOffset: 0,
      topicLimit: 10,
    };
  },
  components: {
    topDownloadBanner,
    bottomOpenAppTip,
    contentEmpty,
    newDetailRecommendItem,
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
    pullUpLoadObj() {
      return this.pullUpLoad ? {
        txt: {
          // more: '上拉加载更多',
          noMore: '没有更多数据了~'
        }
      } : false;
    }
  },
  methods: {
    handleCount,
    onPullingUp() {
      console.log('onPullingUp');
      this.gettopicInfoList(this.topicId, this.topicOffset, this.topicLimit);
    },
    gettopicInfoList(id, offset, limit) {
      requesttopicInfo(...arguments).then((res) => {
        const resData = res.data;
        this.topicInfo = res.data;
        if (resData && resData.items.length) {
          this.recommendList = this.recommendList.concat(resData.items);
          this.topicOffset += this.topicLimit;
          this.dataReady = true;
        } else {
          console.log('没有更多数据了');
          this.dataReady = true;
          this.$refs.scroll.forceUpdate();
        }
      }).then(() => {
        const shareData = {};

        shareData.title = `#${this.topicInfo.label_name} 已更新了${this.topicInfo.count}条内容`;
        shareData.desc = `分享你一个宝典，集合好多${this.topicInfo.label_name}的知识和技能，体验到一把学到满足的感觉，真香~`;
        shareData.link = window.location.href;
        shareData.imgUrl = this.topicInfo.cover_img;

        this.initWxJssdk(shareData);
      });
    },
    computeWatchCount(count) {
      if (count !== 'None') {
        return this.handleCount(count);
      }
      return 0;
    },
    scrollStart() {
      this.bottomOpenTimer && clearTimeout(this.bottomOpenTimer);
      this.$refs.bottomOpenAppTip.hide();
    },
    scrollEnd() {
      this.bottomOpenTimer && clearTimeout(this.bottomOpenTimer);
      this.bottomOpenTimer = setTimeout(() => {
        this.$refs.bottomOpenAppTip.show();
      }, 200);
    },
    onImgLoad() {
      const { scroll } = this.$refs;
      scroll.refresh();
    },
  },
  created() {
    this.topicId = this.$route.query.id;
    this.gettopicInfoList(this.$route.query.id, this.topicOffset, this.topicLimit);
  },
  watch: {
    $route(to, from) {
      if (to.path === '/category' && to.query.id !== from.query.id) {
        this.topicId = to.query.id;
        this.$refs.scroll.scrollTo(0, 0);
        this.topicOffset = 0;
        this.recommendList = [];
        this.gettopicInfoList(this.topicId, this.topicOffset, this.topicLimit);
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
    top: 60px
    bottom: 0
    left: 0
    right: 0
    z-index: 10
    margin: auto
  }


  .brand {
    width 100%
    height 162px
    position relative
    overflow hidden
    background-color rgba(0, 0, 0, 0.3)

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
      -webkit-filter blur(0px)
      filter blur(0px)
      transform: scale(1.5);
      &::after {
        content: ''
        position: absolute
        left: 0
        right: 0
        top: 0
        bottom: 0
        margin: auto
        background-color: rgba(39, 18, 3, .6)
      }
    }
    .brand-bg {
      position absolute
      width 100%
      // -webkit-filter blur(25px)
      // filter blur(25px)

    }
    .brand-main {
      position absolute
      width 100%
      display flex
      flex-direction column
      align-items center

      .labels-about {
        .label-name {
          height 24px
          margin-top 68px
          margin-bottom 12px
          no-wrap()
          line-height 24px
          color #fff
          font-size 24px
          text-align center
          font-weight: 500
        }
        .label-details {
          display: flex
          align-items: center
          justify-content center
          height 14px
          line-height 14px
          color #fff
          font-size 14px
          span:not(:last-child) {
            margin-right: 10px
          }
        }
      }
    }

  }

  .list-container {
    position relative
    z-index 1
    margin-top -12px
    background #ffffff
    border-radius 12px 12px 0 0
    overflow hidden
    .recommend-list {
      padding-bottom: 60px
      .item {
        padding: 8px 12px

      }
    }
  }

  .empty-container {
    height: 100vh;
    margin-top -136px
    padding-top 136px
    display flex
    align-items center
    justify-content center
  }

</style>
