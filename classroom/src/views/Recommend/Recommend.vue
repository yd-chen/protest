<template>
  <div class="recommend-pager">
    <top-download-banner></top-download-banner>
    <section class="scroll-list-wrap">
      <cube-scroll ref="scroll"
                   :data="recommendList"
                   :options="options"
                   @pulling-up="onPullingUp"
                   @pulling-down="onPullingDown">
        <ul class="recommend-list">
          <li class="item" v-for="(item, index) in recommendList" :key="index">
            <recommend-list :data="item" @imageLoad="onImgLoad"></recommend-list>
          </li>
        </ul>
      </cube-scroll>
    </section>
  </div>
</template>

<script>
import recommendList from '@/components/recommendList/recommendList.vue';
import topDownloadBanner from '@/components/topDownloadBanner/topDownloadBanner.vue';

import { requestRecommend } from '@/api/api';
import wxJssdkMixin from '@/mixin/wxJssdkMixin';

const RECOMMEND_LIMIT = 10;
const RECOMMEND_NEWER = 0;

export default {
  name: 'recommend',
  mixins: [wxJssdkMixin],
  components: {
    recommendList,
    topDownloadBanner,
  },
  computed: {
    options() {
      return {
        scrollbar: true,
        useTransition: false,
        pullUpLoad: true,
        pullDownRefresh: {
          txt: '刷新成功',
        },
      };
    },
  },
  data() {
    return {
      recommendList: [],
      lastContentId: 0,
      recommendLimit: RECOMMEND_LIMIT,
      recommendNewer: RECOMMEND_NEWER,
    };
  },
  created() {
    this.getRecommendList(this.lastContentId, this.recommendNewer, this.recommendLimit);
  },
  mounted() {
    this.initWxJssdk();
  },
  methods: {
    getRecommendList(contenId, isNewer, limit) {
      requestRecommend(...arguments).then((data) => {
        if (data.items && data.items.length) {
          this.lastContentId = data.items[data.items.length - 1].id;
          this.recommendList = this.recommendList.concat(data.items);
          console.log(this.lastContentId, this.recommendList);
        } else {
          this.$refs.scroll.forceUpdate();
        }
      });
    },
    refreshRecommendList(contenId, isNewer, limit) {
      requestRecommend(...arguments).then((data) => {
        if (data.items && data.items.length) {
          this.lastContentId = data.items[data.items.length - 1].id;
          this.recommendList = data.items;
          console.log(this.lastContentId, this.recommendList);
        } else {
          this.$refs.scroll.forceUpdate();
        }
      });
    },
    onPullingDown() {
      console.log('onPullingDown');
      this.lastContentId = 0;
      this.refreshRecommendList(this.lastContentId, this.recommendNewer, this.recommendLimit);
    },
    onPullingUp() {
      console.log('onPullingUp');
      this.getRecommendList(this.lastContentId, this.recommendNewer, this.recommendLimit);
    },
    onImgLoad() {
      const { scroll } = this.$refs;
      scroll.refresh();
    },
  },
};
</script>

<style scoped lang="stylus">
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"

  .recommend-pager {
    position: relative
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 100
    margin: auto
    width: 100vw
    height: 100vh
    max-width: 640px
    background: $color-background
    overflow: hidden
  }

  .scroll-list-wrap {
    position: absolute
    top: 60px
    bottom: 0
    left: 0
    right: 0
    margin: auto
    .is-safari-bottom {
      bottom: 34px
    }
  }

  .recommend-list {
    .item {
      margin-bottom: 8px
    }
  }
</style>
