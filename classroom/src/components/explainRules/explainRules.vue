<template>
  <section class="explain-pager">
    <ol class="explanlist">
      <li class="item" v-for="(item, index) in rules" :key="index">
        <h3 class="title"><span class="order-num" v-if="item.orderNum" v-text="item.orderNum"></span>{{item.title}}</h3>
        <p class="explan-content" v-html="item.explain"></p>
      </li>
    </ol>
  </section>
</template>

<script>
export default {
  name: 'explain-rules',
  props: {
    rules: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped lang="stylus">
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"

  .explain-pager {
    padding: 24px 16px
    min-height: 100vh
    background: #ffffff
    .explanlist {
      .item {
        margin-bottom: 25px
      }
    }
    .title {
      display: block
      margin-bottom: 5px
      font-size: $font-size-medium-x
      font-weight: 500
      line-height: 22px
      color: $color-text
      .order-num {
        color: $color-theme
      }

    }
    .explan-content {
      font-size: $font-size-medium
      line-height: 20px
      color: $color-text-l
      white-space: pre-wrap
    }
  }

  // 暗黑模式
  @media (prefers-color-scheme: dark) {
    .explain-pager {
      background-color: $darkmode-color-bg;
      .title {
        color: $darkmode-color-text
      }
      .explan-content {
        color: $darkmode-color-text-l
      }
    }
  }
</style>
