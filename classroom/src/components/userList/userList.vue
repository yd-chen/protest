<template>
  <div class="item" @click="onJumpToUser($event)">
    <div class="avatar">
      <img class="icon" v-lazy="data.portrait" :key="data.portrait" alt="avatar">
    </div>
    <div class="bubble">
      <h2 class="nickname">{{ data.nickname }}</h2>
      <p class="intro">{{ data.intro }}</p>
    </div>
    <div class="right-zone" v-if="showRight" v-cloak>
      <follow-button @follow-click="followClick"></follow-button>
    </div>
  </div>
</template>

<script>
import followButton from '@/components/followButton/followButton.vue';

export default {
  name: 'user-list',
  components: {
    followButton,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
    showRight: {
      type: Boolean,
      default: true,
    },
    jumpToUser: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
  methods: {
    followClick() {
      this.$emit('follow');
    },
    onJumpToUser(event) {
      if (this.jumpToUser) {
        event.stopPropagation();
        this.$router.push({
          path: 'user',
          query: {
            id: this.data.user_id,
          },
        });
      }
    },
  },
};
</script>

<style scoped lang="stylus">
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"

  .item
    position: relative
    display: flex
    padding: 16px
    width: 100%
    text-align: left
    .avatar
      display: block
      min-width: 40px
      width: 40px
      height: 40px
      margin-right: 8px
      border-radius: 50%
      outline: none
      .icon {
        display: block
        width: 100%
        height: 100%
        border-radius: 50%
        object-fit cover
      }
    .bubble
      flex 1 1 auto
      position: relative
      max-width: 420px
      min-width: 80px
      padding-right: 80px
      .nickname {
        display: block
        height: 20px;
        line-height: 20px;
        color: $color-text;
        font-size: 16px;
        font-weight: 400
        text-align: left;
        no-wrap()
      }
      .intro {
        margin-top: 8px
        display: block
        height: 12px;
        line-height: 12px;
        color: $color-text-ll;
        font-size: 12px;
        text-align: left;
        no-wrap()
      }
    .right-zone {
      position: absolute
      right: 16px
      top: 0
      bottom: 0
      z-index: 1
      margin: auto
      display: flex
      align-items: center
      justify-content: center
    }
</style>
