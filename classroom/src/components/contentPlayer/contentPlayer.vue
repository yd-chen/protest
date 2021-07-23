<template>
  <div class="content-play-container">
    <div v-if="publishUserData && publishUserData.id" class="user-wrap">
      <publish-user :user="publishUserData" :jump-to-user="true" @follow="showGuideApp"></publish-user>
    </div>
    <div class="player-wrapper" ref="playerWrap" :style="getCoverStyle">
      <div class="stop-placeholder prism-player" v-show="placeholderCoverShow" :style="getCoverStyle">
        <div class="big-play-btn" @click.prevent.stop="onClickPlay"></div>
      </div>
      <div class="video-wrapper" :style="getCoverStyle">
        <video width="100%" height="100%"
              oncontextmenu="return false;"
              preload="metadata"
              :poster="videoCover"
              :src="videoUrl"
              @click.prevent.stop="togglePlay"
              @play="onVideoPlay"
              @playing="onVideoPlaying"
              @pause="onVideoPuse"
              @canplay="onVideoCanplay"
              @ended="onVideoEnded"
              ref="player">
        </video>
      </div>
    </div>
    <h2 class="content-title">{{title}}</h2>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { addClass, removeClass } from '@/common/js/dom';
import publishUser from '@/components/publishUser/publishUser.vue';

export default {
  name: 'content-player',
  components: {
    publishUser,
  },
  props: {
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '210px',
    },
    videoCover: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    coverImageUrl: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    publishUserData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    getCoverStyle() {
      return `width: ${this.width}; height: ${this.height};`;
    },
    player() {
      return this.$refs.player;
    },
  },
  data() {
    return {
      placeholderCoverShow: true,
      playerPauseHide: false,
    };
  },
  mounted() {
    // this.player.on('ready', () => console.log('ready fired'));
  },
  methods: {
    play() {
      this.player.play();
    },
    pause() {
      this.player.pause();
    },
    togglePlay() {
      const isPause = this.player.paused;
      isPause ? this.play() : this.pause();
    },
    onClickPlay() {
      this.$emit('playClick');
      this.play();
    },
    onVideoPlay() {
      const videosDom = document.getElementsByTagName('video');
      const videos = Array.from(videosDom);
      videos.forEach((video) => {
        if (video !== this.player) {
          video.pause();
        }
      });
    },
    onVideoPlaying() {
      this.placeholderCoverShow = false;
      this.playerPauseHide = false;
    },
    onVideoPuse() {
      this.placeholderCoverShow = true;
      this.playerPauseHide = true;
    },
    onVideoCanplay() {
    },
    onVideoEnded() {
      const bigBtn = this.$refs.playerWrap.getElementsByClassName('big-play-btn')[0];
      addClass(bigBtn, 'replay');
      this.player.src = this.videoUrl;
    },
    resetVideoClassName() {
      const bigBtn = this.$refs.playerWrap.getElementsByClassName('big-play-btn')[0];
      removeClass(bigBtn, 'replay');
    },
    showGuideApp() {
      this.setGuideAppFlag(true);
    },
    ...mapMutations({
      setGuideAppFlag: 'SET_GUIDE_APP_FLAG',
    }),
  },
};
</script>

<style scoped lang="stylus">
  @import "./../../common/stylus/variable.styl"

  .content-play-container {
    .user-wrap {
      padding 12px 16px
    }
    .content-title {
      position: relative
      display: block
      margin 16px
      word-wrap: break-word
      line-height: 30px
      color: $color-text;
      font-size: 20px;
      font-weight: 800
      text-align: justify;
    }
  }
  .player-wrapper {
    position: relative;
    background-color: #000
    .video-wrapper {
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      video {
        object-fit contain
      }
    }
    .stop-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100
      margin: auto;
      .placeholder-cover {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .big-play-btn {
        position: absolute
        top: 50%
        left: 50%
        transform translate(-50%, -50%)
        width: 48px
        height: 48px
        display: block
        background: url(./com_icon_cover_play.png) center center no-repeat;
        background-size: contain;
        &.replay {
          background: url(./com_icon_cover_replay.png) center center no-repeat;
          background-size: contain;
        }
      }
    }
  }

</style>
