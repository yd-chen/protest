<template>
  <div class="cont-tag" v-if="tag" @click.prevent="onTagClick" v-cloak>
    <!-- <i class="icon icon-tag"></i> -->
    <span class="tag-text">#{{tag}}</span>
  </div>
</template>

<script>
export default {
  name: 'content-tag',
  props: {
    tag: {
      type: String,
      default: '',
    },
  },
  methods: {
    onTagClick() {
      this.$emit('tagClick');
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import "./../../common/stylus/variable.styl";

  .cont-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    height: 24px;
    border-radius: 12px;
    background-color: rgba(243, 244, 245, 1);
    .icon-tag {
      display: block
      width: 12px
      height: 12px
      margin-right: 4px
      background: transparent url(./com_icon_tag.png) center center no-repeat
      background-size: 12px
    }
    .tag-text {
      line-height: 16px;
      font-size: 12px;
      text-align: left;
      color: $color-text-l;
    }
  }
</style>
