<template>
  <div class="user-head">
    <div class="publish-user-wrap" @click.prevent="onJumpToUser($event)">
      <div class="avatar-zone">
        <img v-lazy="user.portrait" :key="user.portrait" alt="portrait" class="avatar">
        <img v-if="user.big_V" v-cloak class="icon-v1" src="./com_icon_v1.png" alt="v1">
      </div>
      <div class="user-info-zone">
        <h3 class="nickname">{{user.nickname}}</h3>
        <!-- <p class="intro">{{user.intro}}</p> -->
      </div>
    </div>
    <div class="head-right-zone" v-if="showRight" v-cloak>
      <!--<div class="follow-btn border-1px border-1px-full" @click.prevent.stop="followClick">-->
        <!--<i class="icon icon-add"></i>-->
        <!--<span class="btn-text">关注</span>-->
      <!--</div>-->
      <div class="follow-btn" @click.prevent.stop="followClick">
        <i class="icon icon-add"></i>
        <span class="btn-text">关注</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'publish-user',
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
    showRight: {
      type: Boolean,
      default: true,
    },
    jumpToUser: {
      type: Boolean,
      default: false,
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
            id: this.user.user_id,
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

  .user-head {
    position: relative
    height: 32px
    padding-right: 80px
    .publish-user-wrap {
      display: flex
      .avatar-zone {
        position: relative
        width: 32px
        height: 32px
        margin-right: 8px
        .avatar {
          display: block
          width: 100%
          height: 100%
          object-fit cover
          -webkit-border-radius: 50%
          -moz-border-radius: 50%
          border-radius: 50%
        }
        .icon-v1 {
          position: absolute
          right: 0
          bottom: 0
          display: block
          width: 12px
          height: 12px
        }
      }
      .user-info-zone {
        flex: 1 1 auto
        width: 1%
        display flex
        align-items center
        .nickname {
          // padding: 3px 0 8px
          font-size: 14px
          color: $color-text
          line-height: 14px
          no-wrap()
        }
        .intro {
          font-size: 12px
          color: $color-text-l
          no-wrap()
        }
      }
    }
    .head-right-zone {
      position: absolute
      right: 0
      top: 7px
      .follow-btn {
        position: relative
        width: 54px;
        height: 24px;
        display: flex
        align-items: center
        justify-content: center
        border-radius: 100px
        background-color: $color-theme
        background: $color-theme linear-gradient(to right, #FCB13F, #FA8C1D) 0 0 no-repeat
        ::before {
          content ''
          position: absolute
          top: -8px
          right: -10px
          bottom: -8px
          left: -10px
        }
        /* &::after {
          content ''
          position: absolute
          left: 0
          top: 0
          z-index: 2;
          pointer-events: none;
          box-sizing: border-box;
          transform-origin: top left;
          display: block
          border: 1px solid rgba(255, 150, 69, 1);
          border-radius: 100px
        } */
        .icon-add {
          display: block
          width: 10px
          height: 10px
          margin-right: 3px
          background: transparent url(./com_icon_follow3_de.png) center center no-repeat
          background-size: 12px
        }
        .btn-text {
          font-size: 12px
          color: #fff
        }
      }
    }
  }

</style>
