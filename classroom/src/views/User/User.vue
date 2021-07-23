<template>
  <div class="pager user-pager">
    <top-download-banner></top-download-banner>
    <section class="scroll-list-wrap">
      <cube-scroll ref="scroll"
                   :data="scrollListData"
                   :scrollEvents="['before-scroll-start', 'scroll-end']"
                   @before-scroll-start="scrollStart"
                   @scroll-end="scrollEnd"
                   :options="options">
        <section class="user-info-wrap">
          <div class="bg-image" :style="bgStyle"></div>
          <div class="user-header">
            <div class="info-main">
              <div class="nickname-zone">
                <h2 class="nickname">{{userInfo.nickname}}</h2>
              </div>
              <div class="user-id">ID：{{userInfo.user_id}}</div>
            </div>
            <div class="avatar-zone">
              <img v-lazy="userInfo.portrait" :key="userInfo.portrait"
                   :large="userInfo.portrait"
                   :preview="preview" alt="portrait" class="avatar">
            </div>
          </div>
          <div class="user-platfom-relationship">
            <i class="icon big-v" v-if="userInfo.big_V"></i>
            <i class="icon is-lecturer" v-if="userInfo.is_lecturer"></i>
          </div>
          <div class="user-intro">{{userInfo.intro || '暂无简介'}}</div>

          <div class="user-extra-wrap">
            <div class="extra-list">
              <router-link class="item" :to="{ path: 'follow', query: { id: userInfo.user_id }}">关注
                <span class="sum">
                  {{userInfo.follow_count ? handleCount(userInfo.follow_count) : userInfo.follow_count}}
                </span>
              </router-link>
              <router-link class="item" :to="{ path: 'fans', query: { id: userInfo.user_id }}">粉丝
                <span class="sum">
                  {{userInfo.fans_count ? handleCount(userInfo.fans_count) : userInfo.fans_count}}
                </span>
              </router-link>
            </div>
            <div class="head-right-zone">
              <div class="follow-btn" @click.prevent.stop="showGuideApp">
                <i class="icon icon-add"></i>
                <span class="btn-text">关注</span>
              </div>
            </div>
          </div>
        </section>
        <div class="tabs-lists-wrap">
          <nav v-if="personalLessonList.length" v-cloak>
            <cube-tab-bar
              v-model="selectedLabelSlots"
              show-slider>
              <cube-tab v-for="(item, index) in labelTabs" :label="item.label" :key="index">
                <div class="tab-text">{{item.label}}</div>
              </cube-tab>
            </cube-tab-bar>
          </nav>
          <transition name="slideFade">
            <section class="mod-block-section" v-show="selectedLabelSlots === labelTabs[0].label">
              <ul class="recommend-list" v-if="contentList && contentList.length" v-cloak>
                <template v-for="(item, idx) in contentList">
                  <new-detail-recommend-item :recommend="item" :key="idx"></new-detail-recommend-item>
                </template>
              </ul>
              <div class="empty-wrap" v-show="dataReady && !contentList.length" v-cloak>
                <content-empty></content-empty>
              </div>
            </section>
          </transition>

          <transition name="slideFade">
            <section class="mod-block-section" v-show="selectedLabelSlots === labelTabs[1].label">
              <ul class="series-list">
                <li class="item" v-for="(item, index) in personalLessonList" :key="index">
                  <series-list-item :data="item" :options="testOption"></series-list-item>
                </li>
              </ul>
            </section>
          </transition>
        </div>

      </cube-scroll>
    </section>
    <bottom-open-app-tip ref="bottomOpenAppTip"></bottom-open-app-tip>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import newDetailRecommendItem from '@/components/detailRecommendItem/newDetailRecommendItem.vue';
import seriesListItem from '@/components/seriesListItem/seriesListItem.vue';
import bottomOpenAppTip from '@/components/bottomOpenAppTip/bottomOpenAppTip.vue';
import topDownloadBanner from '@/components/topDownloadBanner/topDownloadBanner.vue';
import contentEmpty from '@/components/contentEmpty/contentEmpty.vue';

import { requestUserInfo, requestUserContents, requestPersonalLesson } from '@/api/api';
import { handleCount } from '@/common/js/utils';
import wxJssdkMixin from '@/mixin/wxJssdkMixin';

const USER_LABEL_TABS = [
  {
    label: '分享',
  }, {
    label: '课程',
  },
];

export default {
  name: 'user',
  mixins: [wxJssdkMixin],
  components: {
    newDetailRecommendItem,
    bottomOpenAppTip,
    contentEmpty,
    seriesListItem,
    topDownloadBanner,
  },
  computed: {
    options() {
      return {
        scrollbar: true,
        useTransition: false,
      };
    },
    listOptions() {
      return {
        jumpToUser: false, // 头部用户能否跳转个人主页
        showRight: false, // 显示右边按钮
      };
    },
    scrollListData() {
      return this.selectedLabelSlots === USER_LABEL_TABS[0].label ? this.contentList : this.personalLessonList;
    },
    testOption() {
      return { jumpToSeries: true };
    },
  },
  data() {
    return {
      dataReady: false,
      userId: 0,
      userInfo: {},
      contentList: [],
      bgImageUrl: '',
      bgStyle: '',
      preview: 100000,
      selectedLabelSlots: USER_LABEL_TABS[0].label,
      labelTabs: USER_LABEL_TABS,
      personalLessonList: [],
    };
  },
  created() {
    if ((this.$route.query && this.$route.query.id)) {
      this.userId = this.$route.query.id;
      this.getUserInfo();
      this.requestPersonalLesson();
    }
  },
  mounted() {
  },
  methods: {
    handleCount,
    getUserInfo() {
      requestUserInfo(this.userId).then((data) => {
        console.log(data);
        if (!data) {
          this.$router.replace({
            path: '404',
          });
          return;
        }
        this.userInfo = data;
        this.preview = this.userInfo.user_id;
        this.bgImageUrl = this.userInfo.portrait;
        this.$previewRefresh();
      }).then(() => {
        const shareData = {};

        shareData.title = `${this.userInfo.nickname}-个人简介`;
        shareData.desc = `我关注了${this.userInfo.nickname}好久了，${this.userInfo.nickname}教会了我好多东西，推荐你关注~`;
        shareData.link = window.location.href;
        shareData.imgUrl = this.userInfo.portrait;

        this.initWxJssdk(shareData);
      });
    },
    requestUserContents() {
      requestUserContents(this.userId).then((data) => {
        if (data && data.items) {
          this.contentList = data.items;
          this.dataReady = true;
        }
      });
    },
    requestPersonalLesson() {
      requestPersonalLesson(this.userId).then((data) => {
        console.log(data);
        try {
          this.personalLessonList = this.personalLessonList.concat(data.items);
        } catch (err) {
          console.log(err);
        }
      }).then(() => {
        this.requestUserContents();
      });
    },
    onImgLoad() {
      const { scroll } = this.$refs;
      scroll.refresh();
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
    showGuideApp() {
      this.setGuideAppFlag(true);
    },
    ...mapMutations({
      setGuideAppFlag: 'SET_GUIDE_APP_FLAG',
    }),
  },
  watch: {
    $route(to) {
      if (to.path === '/user' && this.userId !== to.query.id) {
        this.userId = to.query.id;
        this.$refs.scroll.scrollTo(0, 0);
        this.personalLessonList = [];
        this.userInfo = {};
        this.getUserInfo();
        this.requestPersonalLesson();
      }
    },
    bgImageUrl() {
      this.bgStyle = `background-image:url(${this.bgImageUrl})`;
    },
  },
};
</script>

<style scoped lang="stylus">
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"

  .pager {
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 100
    margin: auto
    width: 100vw
    height: 100vh
    max-width: 640px
    background: #fff
    overflow: hidden
  }

  .user-info-wrap {
    position: relative
    width: 100%
    padding: 0 16px 33px
    overflow: hidden
    .bg-image {
      position: absolute
      left: 0
      right: 0
      top: 0
      bottom: 0
      margin: auto
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
      filter: blur(15px);
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
    .user-header {
      position: relative
      display: flex
      padding: 72px 0 8px
      .info-main {
        flex: 1 1 auto
        width: 1%
        .nickname-zone {
          display: flex
          align-items: center
          .nickname {
            display: block
            padding: 12px 0
            no-wrap()
            font-size: 24px
            font-weight: 900
            color: #ffffff
          }
          .right-b-v1 {
            margin-left: 14px
            width: 92px
            height: 24px;
            background: transparent url(./icon_b_v1.png) 0 center no-repeat
            background-size: 92px 24px
          }
        }
        .user-id {
          display: block
          max-width: 100%
          no-wrap()
          line-height: 12px;
          color: $color-text-ll;
          font-size: 12px;
        }
      }
      .avatar-zone {
        width: 72px
        height: 72px
        overflow: hidden
        border-radius: 50%
        margin-left: 12px
        .avatar {
          width: 100%
          height: 100%
          object-fit cover;
          overflow: hidden
          border-radius: 50%
        }
      }
    }
    .user-platfom-relationship {
      .icon {
        position relative
        display inline-block
        width 74px
        height 20px
        margin-right 4px
        margin-bottom 12px
        &.big-v {
          background url(./daren_icon@2x.png) center center / 74px 20px no-repeat
        }
        &.is-lecturer {
          background url(./jiangshi_icon@2x.png) center center / 74px 20px no-repeat
        }
      }
    }
    .user-intro {
      position relative
      height 12px
      margin-bottom 15px
      font-size 12px
      font-weight 400
      color $color-text-ll
      line-height 12px
      text-align left
      no-wrap()
    }
    .user-extra-wrap {
      position: relative
      padding-right: 80px
      .extra-list {
        display: flex
        align-items: center
        .item {
          margin-right: 20px
          line-height: 14px;
          color: $color-text-ll;
          font-size: 14px;
          text-align: left;
          .sum {
            font-size: 20px
            font-weight: 900
            color: #ffffff
          }
        }
      }
      .head-right-zone {
        position: absolute
        right: 0
        top: -5px
        .follow-btn {
          position: relative
          width: 62px;
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
  .tabs-lists-wrap {
    position relative
    margin-top -12px
    border-radius: 14px 14px 0 0
    background #fff
    overflow hidden
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

  .recommend-list {
    position: relative
    background-color: $color-background
    .item {
      margin-bottom: 8px
    }
  }

  .tab-text {
    display: flex
    align-items: center
    justify-content: center
    height: 30px
  }
  .mod-block-section {
    display: block
    padding-bottom: 60px
  }
  .series-list {
    position: relative
    .item {
    }
  }
</style>

<style>
.cube-tab-bar-slider {
  width: 18px;
}
</style>
