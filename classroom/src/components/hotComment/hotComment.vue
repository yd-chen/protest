<template>
    <div class="hot-comment" v-if="hotComment && hotComment.id" v-cloak>
      <i class="icon icon-hotcomment"></i>
      <span class="count">{{handleCount(hotComment.like_count)}}赞</span>
      <p class="hot-comment-content"><strong class="comment-user">{{hotComment.user.nickname}}：</strong>{{hotComment.content}}</p>
    </div>
</template>

<script>
import { handleCount } from '@/common/js/utils';

export default {
  name: 'hot-comment',
  props: {
    hotComment: {
      type: Object,
      default: () => ({}),
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    handleCount,
  },
};
</script>

<style scoped lang="stylus">
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"

  .hot-comment {
    position: relative
    margin: 8px 0
    padding: 38px 12px 12px
    border-radius: 4px;
    background-color: $color-background;
    .icon-hotcomment {
      position: absolute
      left: 6px
      top: 8px
      width: 56px
      height: 30px
      background: transparent url(./hot-comment.png) center center no-repeat
      background-size: contain
    }
    .count {
      position: absolute
      right: 12px
      top: 15px
      height: 12px;
      line-height: 12px;
      color: $color-text-l;
      font-size: $font-size-small;
      text-align: right;
    }
    .hot-comment-content {
      line-height: 18px;
      text-align: justify;
      font-size: $font-size-medium;
      color: $color-text-d
      multi-line(4)
      white-space: pre-wrap
      word-break break-all
      .comment-user {
        color: $color-text;
      }
    }
  }
</style>
