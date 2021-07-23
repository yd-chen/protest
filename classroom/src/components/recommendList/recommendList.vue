<template>
  <div @click.prevent.stop="selectItem(data)" class="recommend-single-wrap">
    <div class="recommend-main">
      <template v-if="data.user && data.user.id">
        <publish-user :user="data.user"
                      :show-right="options.showRight"
                      :jump-to-user="options.jumpToUser"
                      @follow="showGuideApp">
        </publish-user>
      </template>
      <div class="content-container" ref="contentContainer">
        <div class="content-desc" v-if="data.description" v-cloak>
          <content-desc :description="data.description" :number-of-lines="5"></content-desc>
        </div>

        <div class="content-image-list"
             v-if="data.images && data.images.length" v-cloak>
          <content-image :data="data.images" @imageLoad="onImgLoad"></content-image>
        </div>

        <div class="content-article" v-if="data.article && data.article.article_url">
          <div class="article-cover">
            <img v-lazy="data.article.cover_url" :key="data.article.cover_url" alt="cover" class="cover">
          </div>
          <div class="title-zone">
            <h3 class="article-title">{{data.article.title}}</h3>
          </div>
          <div class="sign-angle">
            <span class="text">文章</span>
          </div>
        </div>
        <div class="content-player-container" @click.prevent.stop=""
             v-if="data.video && data.video.video_url" v-cloak>
          <content-player :width="videoWidth"
                          :height="videoHeight"
                          :video-url="data.video.video_url"
                          :video-cover="data.video.cover_url">
          </content-player>
        </div>
      </div>
      <div class="content-extra-wrap">
        <div class="tag-wrap">
          <content-tag :tag="data.label_name"></content-tag>
          <div class="view-wrap">
            <span class="view-text">{{data.watch_count}}已看</span>
          </div>
        </div>
      </div>
      <hot-comment :hot-comment="data.comment" :comment-count="data.comment_count"></hot-comment>
    </div>
    <div class="recommend-footer">
      <div class="operate-item">
        <i class="icon icon-share"></i>
        <span class="text">分享</span>
      </div>
      <div class="operate-item" @click.prevent.stop="showGuideApp">
        <i class="icon icon-comment"></i>
        <span class="text">{{data.comment_count ? handleCount(data.comment_count) : '评论'}}</span>
      </div>
      <div class="operate-item " @click.prevent.stop="showGuideApp">
        <i class="icon icon-like"></i>
        <span class="text">{{data.like_count ? handleCount(data.like_count) : '点赞'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import publishUser from '@/components/publishUser/publishUser.vue';
import contentTag from '@/components/contentTag/contentTag.vue';
import contentDesc from '@/components/contentDesc/contentDesc.vue';
import contentImage from '@/components/contentImage/contentImage.vue';
import contentPlayer from '@/components/contentPlayer/contentPlayer.vue';
import hotComment from '@/components/hotComment/hotComment.vue';

import { handleCount } from '@/common/js/utils';

const WINDOW_WIDTH = Math.min(window.innerWidth, 640);
const VIDEO_MARGIN = 16;

export default {
  name: 'recommend-list',
  components: {
    publishUser,
    contentTag,
    contentDesc,
    contentImage,
    contentPlayer,
    hotComment,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Object,
      default: () => ({
        jumpToUser: false, // 头部用户能否跳转个人主页
        showRight: true, // 显示右边按钮
      }),
    },
  },
  computed: {
  },
  data() {
    return {
      videoHeight: '',
      videoWidth: '',
      articleContent: '',
    };
  },
  created() {
    if (this.data.video) {
      this.videoPlayerWidth = WINDOW_WIDTH - VIDEO_MARGIN * 2;
      let height = this.videoPlayerWidth / (this.data.video.video_width / this.data.video.video_height);
      height = Math.floor(height);
      this.videoHeight = `${height}px`;
      this.videoWidth = `${this.videoPlayerWidth}px`;
    }
  },
  mounted() {
  },
  methods: {
    handleCount,
    onFollow() {
      this.setGuideAppFlag(true);
    },
    onImgLoad() {
      this.$emit('imageLoad');
    },
    showGuideApp() {
      this.setGuideAppFlag(true);
    },
    selectItem(item) {
      this.$router.push({
        path: 'content',
        query: {
          id: item.id,
        },
      });
    },
    play() {
      console.log('play callback');
    },
    ...mapMutations({
      setGuideAppFlag: 'SET_GUIDE_APP_FLAG',
    }),
  },
};
</script>

<style scoped lang="stylus">
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"
.recommend-single-wrap {
  display: block
  background-color: #fff
  // box-shadow: 0px 36px 24px 12px rgba(0, 0, 0, 0.06);
  .recommend-footer {
    display: flex
    align-items: center
    justify-content: center
    margin-top: 8px
    .operate-item {
      position: relative
      flex: 1 1 auto
      width: 1%
      height: 44px
      display: flex
      align-items: center
      justify-content: center
      &:not(:last-child)::after {
        content: ''
        position: absolute
        right: 0
        top: 12px
        bottom: 12px
        margin: auto
        width: 1px
        background-color: #f2f2f2
      }
      .icon {
        display: block
        width: 24px
        height: 24px
        margin-right: 4px
        &.icon-share {
          background: transparent url(./feed_icon_share_gray.png) center center no-repeat
          background-size: 24px
        }
        &.icon-comment {
          background: transparent url(./feed_icon_comment_gray.png) center center no-repeat
          background-size: 24px
        }
        &.icon-like {
          background: transparent url(./feed_icon_like_gray.png) center center no-repeat
          background-size: 24px
        }
      }
      .text {
        color: $color-text-l;
        font-size: 14px;
      }
    }
  }
  .recommend-main {
    padding: 16px 16px 0
  }

  .content-container {
    .content-desc {
      display: block
      margin-top: 12px
    }
    .content-image-list {
      margin: 8px 0
    }
    .content-player-container {
      margin-top: 10px
    }
    .content-article {
      position: relative
      margin-top: 8px
      .sign-angle {
        position: absolute
        right: 0
        bottom: 0
        z-index: 2
        display: flex
        align-items: center
        justify-content: center
        width: 30px
        height: 18px
        border-radius: 4px 0 4px 0
        background-color: rgba(0, 0, 0, .4)
        .text {
          font-size: 11px
          color: #ffffff
          font-weight: 500
        }
        .gif-text {
          font-size: 13px
          color: #ffffff
          font-weight: 500
        }
      }
      .article-cover {
        position: relative
        width: 100%
        padding-top: 42.2%
        border-radius: 4px
        overflow: hidden
        .cover {
          position: absolute
          top: 0
          left: 0
          right: 0
          bottom: 0
          display: block
          width: 100%
          height: 100%
          border-radius: 4px
          overflow: hidden
          object-fit cover
        }
      }
      .title-zone {
        position: absolute
        top: 0
        left: 0
        right: 0
        padding: 10px 8px
        background-image linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,0))
        .article-title {
          max-height: 40px
          min-height: 20px
          font-size: 15px
          line-height: 20px
          font-weight: 800
          color: #ffffff
          word-wrap: break-word
          multi-line(2)
        }
      }
    }
  }

  .content-extra-wrap {
    display: block
    position: relative
    margin-top: 8px
    height: 24px
    .view-wrap {
      float: right
      display: block
      margin-top: 4px
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      text-align: right;
      .view-text {
        color: $color-text-ll
      }
    }
  }
}
</style>
