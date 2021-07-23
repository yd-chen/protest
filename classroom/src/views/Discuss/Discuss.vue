<template>
  <div class="discuss-pager-wrap">
    <section class="scroll-list-wrap">
      <cube-scroll
        ref="scroll"
        :options="options"
        :scrollEvents="['before-scroll-start', 'scroll-end', 'scroll']"
        @before-scroll-start="scrollStart"
        @scroll-end="scrollEnd"
        @scroll="scroll"
      >
        <div v-if="discussData" v-cloak class="discuss-pager-container">
          <div class="discuss-info-head">
            <div class="cover-zone">
              <img v-lazy="discussData.cover_img" class="cover-img" />
            </div>
            <div class="dc-info-body">
              <div class="dc-info-wrap">
                <h2 class="dc-title">{{ discussData.title }}</h2>
                <div class="dc-intro-zone" @click.prevent.stop="toggleIntroShow()">
                  <p class="dc-intro-desc" v-text="formatDescText"></p>
                  <i class="icon-plus" v-show="showIconPlus">展开</i>
                </div>
                <div v-if="discussData.prize_name" v-cloak class="dc-prize-wrap">
                  <div class="dc-prize-tit">活动奖品</div>
                  <div class="dc-prize-name" @click.prevent.stop="showGuideApp()">
                    {{ discussData.prize_name }}
                  </div>
                </div>
                <div class="dc-info-extra">
                  <div class="dc-inner-users">
                    <ul
                      v-if="discussData.portrait_list && discussData.portrait_list.length"
                      class="user-list"
                    >
                      <li
                        v-for="(item, index) in discussData.portrait_list"
                        :key="index"
                        class="item"
                      >
                        <img class="" v-lazy="item" />
                      </li>
                    </ul>
                  </div>
                  <div class="dc-view-count-zone">
                    {{ discussData.watch_count }}围观
                  </div>
                </div>
              </div>
              <div v-if="discussData.type === 1" v-cloak class="dc-positive-wrap">
                <div class="vote-button positive" @click.prevent.stop="showGuideApp()">
                  <img class="vote-bg" src="./positive_bg.png" />
                  <span class="text">{{ discussData.positive }}</span>
                </div>
                <div class="vote-button negative" @click.prevent.stop="showGuideApp()">
                  <img class="vote-bg" src="./negative_bg.png" />
                  <span class="text">{{ discussData.negative }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="comment-list-wrap" v-if="discussData && discussData.id && hotCommentCount" v-cloak>
            <div class="mod-title">
              <h2 class="title">
                热门观点
                <small v-if="this.hotCommentCount">({{hotCommentCount}}条)</small>
              </h2>
            </div>
            <comment-list
              :commentList="this.hotCommentList"
              :show-guide-btn="false"
              @onLike="onLike"
              @clickMoreComments="showGuideApp"
            ></comment-list>
          </div>
          <div
            v-if="
              discussData && discussData.id && (!hotCommentCount || (commentCount && hotCommentCount))
            "
            v-cloak
            class="comment-list-wrap"
          >
            <div class="mod-title">
              <h2 class="title">
                最新观点
                <small v-if="this.commentCount">({{commentCount}}条)</small>
              </h2>
            </div>
            <comment-list
              :commentList="this.commentList"
              :show-guide-btn="showGuideBtn"
              @onLike="onLike"
              @clickMoreComments="showGuideApp"
            ></comment-list>
          </div>
        </div>
      </cube-scroll>
    </section>
    <bottom-open-app-tip ref="bottomOpenAppTip"></bottom-open-app-tip>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
// eslint-disable-next-line camelcase
import { getDiscussDetail, requestComments_v3_1 } from '@/api/api';
import { COMMENT_OBJECY_TYPE } from '@/config/index';
import commentList from '@/components/commentList/commentList.vue';
import bottomOpenAppTip from '@/components/bottomOpenAppTip/bottomOpenAppTip.vue';

// 滚动才显示出底部引导按钮的距离
const SHOW_BOTTOM_OFFSET = 60;

export default {
  name: 'discuss',
  components: {
    commentList,
    bottomOpenAppTip
  },
  data() {
    return {
      discussData: null,
      showIconPlus: true,
      formatDescText: '',
      showIntroFlag: false,
      commentList: [],
      hotCommentList: [],
      commentCount: 0,
      hotCommentCount: 0,
      showGuideBtn: false,
    };
  },
  computed: {
    options() {
      return {
        scrollbar: true,
        pullUpLoad: this.pullUpLoadObj,
        useTransition: false
      };
    },
    pullUpLoadObj() {
      return !this.commentNotMore;
    },
    concatData() {
      return this.commentList.concat(this.recommendList);
    }
  },
  created() {
    this.initPageInfo();
  },
  methods: {
    initPageInfo() {
      this.discussData = null;
      this.discussId = +this.$route.query.id || 0;
      this.commentReplyLimit = 3;
      this.commentOffset = 0;
      this.commentLimit = 10;
      if (!this.discussId) {
        this.$router.push('/404');
        return;
      }
      this.commentNotMore = true;
      this.requistDiscussDetail();
      this.requistCommentList();
    },
    requistDiscussDetail() {
      getDiscussDetail(this.discussId).then((res) => {
        console.log('data: ', res);
        this.formatStr(res.desc);
        document.title = res.title;
        this.discussData = res;
      });
    },
    requistCommentList() {
      requestComments_v3_1(COMMENT_OBJECY_TYPE.discuss, this.discussId, this.commentReplyLimit, this.commentOffset, this.commentLimit)
        .then((res) => {
          const { items } = res;
          this.showGuideBtn = res.count > this.commentLimit;
          // 最新评论数(已减去热门评论数)
          this.commentCount = res.count;
          this.commentOffset += this.commentLimit;
          // 热评OR最新评论
          // eslint-disable-next-line
          res.items.length && items.map((item) => {
            if (item.is_hot) {
              this.hotCommentList.push(item);
              this.hotCommentCount += 1;
            } else {
              this.commentList.push(item);
            }
          });
          if (this.commentOffset >= res.count) {
            this.$refs.scroll.forceUpdate();
            this.commentNotMore = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatStr(description) {
      const text = description;
      let result = '';
      if (this.showIntroFlag) {
        result = text;
        this.showIconPlus = false;
      } else {
        const baseWidth = `${document.body.clientWidth - 32 * 2}px`;
        const baseFontSize = '14px';
        const baseLineHeight = '22px';
        const lineNum = 3; // 行数
        const limitHeight = parseInt(baseLineHeight, 10) * lineNum;
        const rightBlankNum = 4; // 右侧留白数

        // 设置省略号，通过创建一个div按照同样的样式逐个字符显示文本内容
        const newDiv = document.createElement('div');
        newDiv.style.width = baseWidth;
        newDiv.style.lineHeight = baseLineHeight;
        newDiv.style.fontSize = baseFontSize;
        newDiv.style.textAlign = 'justify';
        newDiv.style.visibility = 'hidden';
        newDiv.style.wordWrap = 'break-word';
        newDiv.style.whiteSpace = 'pre-wrap';
        document.body.appendChild(newDiv);
        // 获取到达指定行数时的字符下标
        let targetIndex;
        for (let i = 0, len = text.length; i < len; i++) {
          newDiv.innerHTML = text.substring(0, i);
          if (newDiv.clientHeight > limitHeight) {
            targetIndex = i;
            break;
          }
        }
        document.body.removeChild(newDiv);
        result = targetIndex ? `${text.substr(0, targetIndex - rightBlankNum)}...` : text;
        // 判断显示“展示”图标
        this.showIconPlus = !!targetIndex;
      }

      this.formatDescText = result;
    },
    toggleIntroShow() {
      if (!this.showIntroFlag) {
        this.showIntroFlag = !this.showIntroFlag;
        this.formatStr(this.discussData.desc);
      }
    },
    onLike(comment, index) {
      console.log('onLike: ', comment, index);
      this.showGuideApp();
    },
    showGuideApp() {
      this.setGuideAppFlag(true);
    },
    scrollStart() {
      // eslint-disable-next-line no-unused-expressions
      this.bottomOpenTimer && clearTimeout(this.bottomOpenTimer);
      this.$refs.bottomOpenAppTip.hide();
    },
    scrollEnd(pos) {
      // eslint-disable-next-line no-unused-expressions
      this.bottomOpenTimer && clearTimeout(this.bottomOpenTimer);
      if (Math.abs(pos.y) > SHOW_BOTTOM_OFFSET) {
        this.bottomOpenTimer = setTimeout(() => {
          this.$refs.bottomOpenAppTip.show();
        }, 2000);
      }
    },
    scroll() {
      console.log('scroll');
    },
    ...mapMutations({
      setGuideAppFlag: 'SET_GUIDE_APP_FLAG'
    })
  },
};
</script>

<style lang="stylus" scoped>
@import "./../../common/stylus/variable.styl"
@import "./../../common/stylus/mixin.styl"

.discuss-pager-wrap {
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  margin: auto;
  width: 100vw;
  height: 100vh;
  max-width: 640px;
  background-color: #fff;
  overflow: hidden;
}

.scroll-list-wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.discuss-pager-container {
  padding-bottom: 60px;
}
.discuss-info-head {
  position relative
  .cover-zone {
    position relative
    display block
    width 100%
    padding-bottom 56%
    .cover-img {
      position absolute
      left 0
      right 0
      top 0
      bottom 0
      width 100%
      height 100%
      object-fit cover
    }
  }
  .dc-info-body {
    position relative
    z-index 1
    margin-top -83px
    padding 14px 16px 20px
    &::before {
      content: ''
      position absolute
      top 0
      left 0
      right 0
      height 83px
      margin auto
      background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    }
    &::after {
      content: ''
      position absolute
      top 83px
      left 0
      right 0
      bottom 0
      margin auto
      background-color #fff
    }
    .dc-info-wrap {
      position relative
      z-index 2
      display block
      min-height 198px
      padding 20px 16px 24px
      background rgba(255,255,255,1)
      box-shadow 0px 0px 20px 0px rgba(0,0,0,0.08)
      border-radius 12px
      .dc-title {
        min-height 24px
        margin-bottom 16px
        font-size 18px
        font-weight 500
        color $color-text
        line-height 24px
      }
      .dc-intro-zone {
        position relative
        text-align justify
        .dc-intro-desc {
          min-height 66px
          font-size 14px
          font-weight 400
          color $color-text-l
          line-height 22px
          word-wrap break-word
          white-space pre-wrap
        }
        .icon-plus {
          position absolute
          right 0
          bottom 0
          width 28px
          height 22px
          font-size 14px
          font-weight 400
          color rgba(85,128,174,1)
          font-style normal
          line-height 22px
        }
      }
    }
    .dc-prize-wrap {
      display flex
      align-items center
      margin-top 16px
      .dc-prize-tit {
        margin-right 8px
        font-size 14px
        font-weight 400
        color $color-text
        line-height 12px
      }
      .dc-prize-name {
        position relative
        flex 1 1 auto
        width 1%
        padding-right 10px
        overflow hidden
        height 14px
        font-size 14px
        font-weight 400
        color $color-theme
        line-height 14px
        text-align right
        no-wrap()
        &::after {
          content ''
          position absolute
          right 0
          top 0
          bottom 0
          width 12px
          height 12px
          margin auto
          background transparent url(./com_icon_arr_orange@2x.png) center center / 12px no-repeat
        }
      }
    }
    .dc-positive-wrap {
      position relative
      z-index 2
      display flex
      align-items center
      margin 24px 0 0
      .vote-button {
        position relative
        display flex
        align-items center
        justify-content center
        width calc(50% + 2.63%)
        height 19.2vw
        max-height 122px
        font-size 28px
        font-weight 600
        color #fff
        line-height 28px
        &.positive {
          margin-right -2.63%
        }
        .vote-bg {
          position absolute
          left 0
          top 0
          right 0
          bottom 0
          display block
          width 100%
          height 100%
        }
        .text {
          position relative
          z-index 2
        }
      }
    }
  }
  .dc-info-extra {
    display flex
    align-items center
    margin-top 24px
    .dc-inner-users {
      flex 1 1 auto
      width 1%
      overflow hidden
      .user-list {
        display block
        white-space nowrap
        .item {
          display inline-block
          font-size 0
          & + .item {
            margin-left -4px
          }
          img {
            width 24px
            height 24px
            border-radius 50%
            overflow hidden
            object-fit cover
          }
        }
      }
    }
    .dc-view-count-zone {
      height 14px
      margin-left 10px
      font-size 14px
      font-weight 400
      color $color-text-ll
      line-height 14px
    }
  }
}
.comment-list-wrap {
  & + .comment-list-wrap {
    margin-top 16px
  }
}
.mod-title {
  padding: 12px 16px;

  .title {
    height: 20px;
    line-height: 20px;
    color: $color-text;
    font-size: 20px;
    font-weight: 600;
    text-align: left;

    small {
      font-size: 12px;
      color: $color-text-l;
    }
  }
}
</style>
