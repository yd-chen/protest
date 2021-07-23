<template>
  <div v-if="data && data.id" v-cloak>
    <a class="series-single-wrap" :href="options.jumpToSeries ? data.home_url: 'javascript:;'">
      <div class="cover-zone">
        <img class="cover" v-lazy="data.cover_image" alt="cover_image">
        <p class="count">{{handleCount(data.sale_count)}}人在学</p>
      </div>
      <div class="content-container">
        <h3 class="name">{{data.name}}</h3>
        <p class="teacher">{{data.teacher_name}}</p>
        <div class="price-zone">
          <span class="old-price">¥<strong class="num">{{data.price}}</strong></span>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
import { handleCount } from '@/common/js/utils';

export default {
  name: 'series-list-item',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Object,
      default: () => ({
        jumpToSeries: true, // 可跳转系列课
      }),
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

  .series-single-wrap {
    padding: 16px
    display: flex
    background-color: #fff
    .cover-zone {
      width: 120px
      margin-right: 12px
      border-radius: 4px
      overflow: hidden
      .cover {
        display: block
        width: 120px
        height: 69px
        border-radius: 4px 4px 0 0
        object-fit cover
      }
      .count {
        display: flex
        align-items: center
        justify-content: center
        height: 18px;
        background: $color-background
        border-radius: 0 0 4px 4px
        line-height: 11px;
        color: $color-text-l;
        font-size: 11px;
        text-align: center;
      }
    }
    .content-container {
      position: relative
      flex: 1 1 auto
      width: 1%
      .name {
        height: 40px;
        line-height: 20px;
        color: $color-text;
        font-size: 15px;
        font-weight: 500
        multi-line(2);
      }
      .teacher {
        margin-top: 8px
        height: 12px;
        line-height: 12px;
        color: rgba(102, 102, 102, 1);
        font-size: 12px;
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
      }
      .price-zone {
        margin-top: 8px
        .old-price {
          height: 16px;
          line-height: 16px;
          color: rgba(252, 82, 68, 1);
          font-size: 10px;
          .num {
            font-size: 16px
            font-weight: 500
          }
        }
      }
    }
  }
</style>
