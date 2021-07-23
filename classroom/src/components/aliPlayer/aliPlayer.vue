<template>
  <div class="ali-player-wrapper" ref="playerWrap" :style="getCoverStyle">
    <div class="stop-placeholder prism-player" v-show="placeholderCoverShow" :style="getCoverStyle">
      <img class="placeholder-cover" :src="videoCover" alt="">
      <div class="prism-big-play-btn" v-show="playerPauseHide" @click.prevent.stop="onClickPlay"></div>
    </div>
    <div class="prism-player" v-show="!playerPauseHide" ref="prismPlayer" :id="playerId"></div>
  </div>
</template>

<script>
import { loadAsync } from '@/common/js/utils.js';

const AliplayerJsSrc = '//g.alicdn.com/de/prismplayer/2.8.1/aliplayer-h5-min.js';
const BIG_PLAY_BTN_WIDTH = 48;
const BIG_PLAY_BTN_HEIGHT = 48;

export default {
  name: 'Aliplayer',
  props: {
    videoUrl: {
      type: String,
      default: '',
    },
    videoCover: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '210px',
    },
    playsinline: {
      type: Boolean,
      default: false,
    },
    solePlayerId: {
      type: String,
      default: '',
    },
  },
  computed: {
    getCoverStyle() {
      return `width: ${this.width}; height: ${this.height};`;
    },
    playerId() {
      return this.solePlayerId ? this.solePlayerId : `aliplayer_${Math.random().toString(36).substr(2)}`;
    },
  },
  data() {
    return {
      scriptTagStatus: 0,
      isReload: false,
      instance: null,
      placeholderCoverShow: true,
      playerPauseHide: false,
    };
  },
  created() {
    const _this = this;
    if (window.Aliplayer !== undefined) {
      _this.initAliPlayer();
    } else {
      this.loadAsync({
        fileType: 'js',
        src: AliplayerJsSrc,
        success: (successUrl) => {
          console.log('请求成功!');
          _this.initAliPlayer();
        },
        error: () => {
          console.log('请求失败!');
        },
      });
    }
  },
  mounted() {
  },
  methods: {
    loadAsync,
    initAliPlayer() {
      const _this = this;
      console.log(_this.playerId);
      const bigPlayX = (parseInt(_this.width) - BIG_PLAY_BTN_WIDTH) / 2;
      const bigPlayY = (parseInt(_this.height) - BIG_PLAY_BTN_HEIGHT) / 2;
      this.instance = new Aliplayer({
        id: _this.playerId,
        width: _this.width,
        height: _this.height,
        autoplay: false,
        preload: true,
        controlBarVisibility: 'click',
        playsinline: false, // H5是否内置播放，有的Android浏览器不起作用。
        x5LandscapeAsFullScreen: false, // 声明TBS全屏播放是否横屏，默认值为true。
        source: _this.videoUrl,
        cover: _this.videoCover,
        skinLayout: [
          {
            name: 'bigPlayButton',
            align: 'blabs',
            x: bigPlayX,
            y: bigPlayY,
          },
          {
            name: 'H5Loading',
            align: 'cc',
          },
          {
            name: 'errorDisplay',
            align: 'tlabs',
            x: 0,
            y: 0,
          },
          {
            name: 'infoDisplay',
          },
          {
            name: 'tooltip',
            align: 'blabs',
            x: 0,
            y: 56,
          },
          {
            name: 'thumbnail',
          },
          {
            name: 'controlBar',
            align: 'blabs',
            x: 0,
            y: 0,
            children: [
              {
                name: 'progress',
                align: 'blabs',
                x: 0,
                y: 44,
              },
              {
                name: 'playButton',
                align: 'tl',
                x: 15,
                y: 12,
              },
              {
                name: 'timeDisplay',
                align: 'tl',
                x: 10,
                y: 7,
              },
              {
                name: 'fullScreenButton',
                align: 'tr',
                x: 10,
                y: 12,
              },
              {
                name: 'volume',
                align: 'tr',
                x: 5,
                y: 10,
              },
            ],
          },
        ],
      }, ((player) => {
        console.log('播放器创建好了。');
        player.on('playing', () => {
          console.log('播放中');
          _this.placeholderCoverShow = false;
          _this.playerPauseHide = false;
        });
        player.on('pause', () => {
          console.log('暂停了');
          _this.placeholderCoverShow = true;
          _this.playerPauseHide = true;
        });
        player.on('ended', () => {
          const playWrap = _this.$refs.playerWrap;
          const playerBigPlay = Array.from(playWrap.querySelectorAll('.prism-big-play-btn'));
          console.log(playerBigPlay);
          playerBigPlay.forEach((bigPlay) => {
            bigPlay.classList.add('replay');
          });
        });
      }));
    },
    play() {
      this.instance.play();
    },
    onClickPlay() {
      this.$emit('playClick');
      this.play();
    },
  },
};
</script>

<style lang="stylus">
  @import url(//g.alicdn.com/de/prismplayer/2.8.1/skins/default/aliplayer-min.css);
  .ali-player-wrapper {
    position: relative;
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
        object-fit: cover;
      }
      .prism-big-play-btn {
        position: absolute
        display: block
      }
    }
  }

  .prism-player .prism-cover {
    background-size: cover;
    background-repeat: no-repeat;
  }

  .prism-player .prism-big-play-btn {
    width: 48px
    height: 48px
    left: 50% !important;
    top: 50% !important;
    bottom: auto !important;
    right: auto !important;
    transform: translate(-50%, -50%);
    background: url(./com_icon_cover_play.png) center center no-repeat;
    background-size: contain;
  }

  .prism-player .prism-big-play-btn.replay {
    background: url(./com_icon_cover_replay.png) center center no-repeat;
    background-size: contain;
  }

  .prism-player .prism-big-play-btn .outter {
    width: 48px
    height: 48px
    border: 0 none;
  }
</style>
