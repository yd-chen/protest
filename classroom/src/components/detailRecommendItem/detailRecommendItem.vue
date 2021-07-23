<template>
  <router-link :to="{ path: 'content', query: { id: recommend.id }}" class="recommend-item">
    <div class="cover-zone">
      <img class="cover" v-lazy="coverUrl">
      <i class="icon-play" v-if="recommend.content_type === TYPE_CONTENT.video"></i>
      <span class="type-image" v-else-if="recommend.content_type === TYPE_CONTENT.picture">
        <i class="icon-pic"></i>
        <span>{{recommend.images.length}}</span>
      </span>
    </div>
    <div class="recommend-main">
      <h3 class="recmmend-title">{{recommendTitle}}</h3>
      <div class="recommend-extra-info">
        <span class="name">{{recommend.user.nickname}}</span>
        <span class="name">{{recommend.watch_count}}已看</span>
      </div>
    </div>
  </router-link>
</template>

<script>
import { TYPE_CONTENT } from '@/common/js/config';

export default {
  name: 'detail-recommend-item',
  props: {
    recommend: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    coverUrl() {
      if (this.recommend.content_type === TYPE_CONTENT.video
          && this.recommend.video) {
        return this.recommend.video.cover_url;
      } if (this.recommend.content_type === TYPE_CONTENT.picture
          && this.recommend.images.length) {
        return this.recommend.images[0].middle_url;
      } if (this.recommend.content_type === TYPE_CONTENT.article
          && this.recommend.article) {
        return this.recommend.article.cover_url;
      }
      return '';
    },
    recommendTitle() {
      return this.recommend.content_type === TYPE_CONTENT.article ? this.recommend.article.title : this.recommend.description;
    },
  },
  data() {
    return {
      TYPE_CONTENT,
    };
  },
  methods: {},
};
</script>

<style lang="stylus" scoped>
  @import "./../../common/stylus/variable.styl"
  .recommend-item {
    padding: 16px
    display: flex
    .cover-zone {
      position: relative
      width: 80px
      height: 80px
      border-radius: 4px
      overflow: hidden
      margin-right: 12px
      .cover {
        display: block
        width: 100%
        height: 100%
        border-radius: 4px
        object-fit cover
      }
      .icon-play {
        position: absolute
        left: 0
        top: 0
        right: 0
        bottom: 0
        z-index: 1
        margin: auto
        display: block
        width: 36px
        height: 36px
        background: transparent url(./com_icon_cover_play.png) center center no-repeat
        background-size: 36px
      }
      .type-image {
        position: absolute
        right: 0
        bottom: 0
        width: 30px;
        height: 18px;
        padding: 0 2px
        display: flex
        align-items: center
        background-color: rgba(0, 0, 0, 0.4);
        overflow: hidden
        border-radius: 4px 0 4px 0
        line-height: 14px;
        color: #fff;
        font-size: 11px;
        font-weight: 500
        .icon-pic {
          display: block
          width: 18px
          height: 18px
          background: transparent url(./feed_icon_image.png) center center no-repeat
          background-size: 18px
        }
      }
    }
    .recommend-main {
      flex: 1 1 auto
      width: 1%
      overflow: hidden
      .recmmend-title {
        margin-bottom: 22px
        width: 100%
        height: 44px
        font-size: 16px
        color: $color-text
        line-height: 22px
        white-space: normal;
        word-wrap: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .recommend-extra-info {
        display: block
        width: 100%
        font-size: 0
        span {
          display: inline-block
          max-width: 50%
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          font-size: 12px
          color: $color-text-l
          &:not(:last-child) {
            margin-right: 16px
          }
        }
      }
    }
  }
</style>
