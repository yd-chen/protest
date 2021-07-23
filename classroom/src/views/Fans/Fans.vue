<template>
  <div class="view-wrapper">
    <section class="scroll-list-wrap" ref="scrollListWrap">
      <cube-recycle-list class="list" ref="indexList" :infinite="infinite" :size="size" :on-fetch="onFetch">
        <template slot="item" slot-scope="{ data }">
          <user-list
          :data="data"
          :jump-to-user="true"
          @follow="showGuideApp">
          </user-list>
        </template>
        <template slot="noMore">
          <div>
            <div class="empty-wrap" v-if="!fansData.length && firstReady" v-cloak>
              <content-empty></content-empty>
            </div>
            <div class="pullup-after" v-else>
              <span class="no-more-text">没有更多数据了</span>
            </div>
          </div>
        </template>
      </cube-recycle-list>
    </section>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import contentEmpty from '@/components/contentEmpty/contentEmpty.vue';
import userList from '@/components/userList/userList.vue';

import { requestPersonalFans } from '@/api/api';

const LIMIT = 30;
export default {
  name: 'fans',
  components: {
    contentEmpty,
    userList,
  },
  computed: {
    options() {
      return {
        scrollbar: true,
        useTransition: true,
        pullUpLoad: true,
      };
    },
  },
  data() {
    return {
      firstReady: false,
      fansData: [],
      limit: LIMIT,
      size: LIMIT,
      offset: 300,
      hasMore: true,
      fansOffset: 0,
      infinite: false,
    };
  },
  created() {
    if ((this.$route.query && this.$route.query.id)) {
      this.userId = this.$route.query.id;
      this.fansOffset = 0;
      // this.initPage();
    } else {
      this.$router.replace('404');
    }
  },
  methods: {
    getPersonalFans(userId, offset, limit) {
      requestPersonalFans(...arguments).then((data) => {
        this.firstReady = true;
        if (!data.items.length) {
          this.hasMore = false;
          return this.$refs.scroll.forceUpdate(false);
        }

        this.fansOffset += this.limit;
        this.fansData = this.fansData.concat(data.items);

        this.$nextTick(() => {
          // 检测第一次请求回来的数据有没有满屏，如果没有满屏，并且还有数据，就再请求一次
          if (!this.checkFullScreen()) {
            this.getPersonalFans(this.userId, this.fansOffset, this.limit);
          }
        });
      });
    },
    onPullingUp() {
      console.log('onPullingUp event');
      if (!this.hasMore) {
        return this.$refs.scroll.forceUpdate(false);
      }

      this.getPersonalFans(this.userId, this.fansOffset, this.limit);
    },
    onFetch() {
      return new Promise((resolve) => {
        requestPersonalFans(this.userId, this.fansOffset, this.limit).then((data) => {
          this.fansData = this.fansData.concat(data.items);
          this.firstReady = true;
          this.fansOffset += this.limit;
          resolve(data.items);
        });
      });
    },
    handleClick(data) {
      console.log(data);
    },
    follow() {
      alert('follow');
    },
    initPage() {
      this.getPersonalFans(this.userId, this.fansOffset, 100);
    },
    showGuideApp() {
      this.setGuideAppFlag(true);
    },
    checkFullScreen() {
      this.scrollListWrap = this.$refs.scrollListWrap;
      this.list = this.$refs.list;
      return this.list.clientHeight > this.scrollListWrap.clientHeight;
    },
    ...mapMutations({
      setGuideAppFlag: 'SET_GUIDE_APP_FLAG',
    }),
  },
  watch: {
    $route(to, from) {
      if (to.path === '/fans' && this.userId !== to.query.id) {
        this.userId = to.query.id;
        this.fansOffset = 0;
        this.fansData = [];
        this.hasMore = true;
        this.$refs.indexList.reset();
      }
    },
  },
};
</script>

<style scoped lang="stylus">
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"

  .scroll-list-wrap {
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    margin: auto
  }

  .view-wrapper
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
    background-color: #fff
    overflow: hidden
  .list
    margin: 0 auto
    padding: 0
    list-style-type: none
    text-align: center
  .pullup-after {
    display: flex
    align-items: center
    justify-content: center
    padding: 10px
    .no-more-text {
      font-size: 14px
      line-height: 22px
      color: $color-text-ll
    }
  }
  .empty-wrap {
    margin: 30% auto 30px
  }
</style>
