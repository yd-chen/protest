<template>
  <div class="content-image-container">
    <div class="content-cover-zone">
      <img v-lazy="coverImageUrl" :key="coverImageUrl" preview="1000000" class="cover-img" />
    </div>
    <h2 class="content-title">{{title}}</h2>
    <div v-if="publishUserData && publishUserData.id" class="user-wrap">
      <publish-user :user="publishUserData" :jump-to-user="true" @follow="showGuideApp"></publish-user>
    </div>
    <div class="hr-line border-bottom-1px"></div>
    <div class="image-container" :class="getContainerCls" ref="imageContainer">
      <div class="image-item" :key="index" v-for="(item, index) in data">
        <div class="image-wrap" @click.prevent.stop="">
          <img class="image"
              :width="item.img_width"
              :height="item.img_height"
              :key="item.middle_url"
              v-lazy="item.middle_url"
              alt="content-image"
              @load="onImgLoad">
          <div class="sign-angle" v-if="item.signText" v-cloak>
            <span :class="getSignCls(item.signText)">{{item.signText}}</span>
          </div>
          <img class="image-hidden"
              :src="item.img_url"
              :preview="previewInt"
              :large="item.img_url"
              alt="content-image">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRandomInt } from '@/common/js/utils';
import publishUser from '@/components/publishUser/publishUser.vue';

export default {
  name: 'content-image',
  components: {
    publishUser,
  },
  props: {
    coverImageUrl: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    publishUserData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    getContainerCls() {
      return this.data && this.data.length > 1 ? 'many-image-container' : 'single-image-container';
    },
  },
  data() {
    return {
      previewInt: getRandomInt(1, 999999),
    };
  },
  created() {
    this.data.forEach((img) => {
      img.signText = this.getSignText(img);
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.$previewRefresh();
    });
  },
  methods: {
    onImgLoad() {
      this.$emit('imageLoad');
    },
    getSignText(item) {
      if (item.format === 'gif') {
        return 'GIF';
      } if (this.isLongImage(item)) {
        return '长图';
      }
      return '';
    },
    isLongImage(item) {
      if (item.img_height / item.img_width > 2 && item.img_width > 320) {
        return true;
      } if (item.img_width / item.img_height > 2 && item.img_height > 320) {
        return true;
      }
      return false;
    },
    getSignCls(text) {
      return text === 'GIF' ? 'gif-text' : 'text';
    },
  },
  watch: {
    data(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.previewInt = getRandomInt(1, 999999);
      }
    },
  },
};
</script>

<style scoped lang="stylus">
  .content-image-container {
    .content-cover-zone {
      position: relative
      padding-top: 56%
      overflow: hidden
      .cover-img {
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        display: block
        width: 100%
        height: 100%
        margin: auto
        object-fit cover
      }
    }
    .content-title {
      position: relative
      display: block
      margin 16px 16px 4px
      word-wrap: break-word
      line-height: 30px
      color: $color-text;
      font-size: 20px;
      font-weight: 800
      text-align: justify;
    }
    .user-wrap {
      padding 24px 16px
    }
    .hr-line {
      margin: 0 24px
      height: 1px
      background-color: #F2F2F2
    }
  }
  .image-container {
    display: block
    font-size: 0
    margin-right: -5px
    margin-bottom: -5px
    .image-item {
      display: inline-block
      width: 33.33333333%
      padding: 0 5px 5px 0
      .image-wrap {
        position: relative
        padding-top: 100%
        border-radius: 4px
        overflow: hidden
        .image-hidden {
          position: absolute
          top: 0
          left: 0
          right: 0
          bottom: 0
          z-index: 3
          opacity: 0
          border-radius: 4px
          display: block
          width: 100%
          height: 100%
          object-fit cover
        }
        .image {
          position: absolute
          top: 0
          left: 0
          right: 0
          bottom: 0
          border-radius: 4px
          display: block
          width: 100%
          height: 100%
          object-fit cover
        }
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
      }
    }
    &.single-image-container {
      .image-item {
        width: 66.66666666%
      }
    }
  }
</style>
