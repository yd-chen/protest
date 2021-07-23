<template>
  <div class="desc-zone">
    <p class="desc" v-html="description" :style="lineClampStyle"></p>
  </div>
</template>

<script>
const DESC_LINE_HEIGHT = 22;

export default {
  name: 'content-desc',
  props: {
    description: {
      type: String,
      default: '',
    },
    numberOfLines: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    lineClampStyle() {
      return this.numberOfLines !== 5 ? `-webkit-line-clamp: ${this.numberOfLines}; max-height: ${this.descMaxHeight}px` : '';
    },
    descMaxHeight() {
      return this.numberOfLines * this.lineHeight;
    },
  },
  data() {
    return {
      lineHeight: DESC_LINE_HEIGHT,
    };
  },
};
</script>

<style lang="stylus" scoped>
  @import "./../../common/stylus/variable.styl"

  .desc-zone {
    .desc {
      position: relative
      max-height: 22 * 5 px
      font-size: 16px
      font-weight 300
      line-height: 28px
      color: $color-text
      word-wrap: break-word
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      text-align: justify
    }
  }
</style>
