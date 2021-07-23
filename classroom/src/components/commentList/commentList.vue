<template>
  <div class="comment-list-container">
    <ul class="comment-list" v-if="commentList && commentList.length">
      <li class="item" v-for="(comment, index) in commentList" :key="index">
        <!-- <div class="hot-sign" v-if="comment.is_hot" v-cloak>
          <i class="icon icon-hot"></i>
        </div> -->
        <div class="comment-user-zone">
          <div class="avatar-zone" @click.prevent.stop="showGuideApp()">
            <template v-if="comment.user && comment.user.id">
              <img :src="comment.user.portrait" alt="" class="avatar">
            </template>
          </div>
          <div class="info-zone">
            <h4
              v-if="comment.user && comment.user.nickname"
              class="nickname"
              @click.prevent.stop="showGuideApp()"
            >
              {{comment.user.nickname}}
            </h4>
            <div
              class="comment-conetnt"
              v-html="comment.content"
              @click.prevent.stop="showGuideApp()"
            ></div>
            <p class="time">{{comment.create_time}}</p>
            <div
              v-if="comment.replies && comment.replies.length"
              v-cloak
              class="reply-comments-wrap"
            >
              <div
                v-for="replyItem in comment.replies"
                :key="replyItem.id"
                class="reply-comments-item"
                @click.prevent.stop="showGuideApp()"
              >
                <template v-if="replyItem.reply_comment && replyItem.reply_comment.id">
                  <div class="replay-user">
                    <img class="user-portrait" v-lazy="replyItem.user.portrait" />
                    <span class="reply-nickname" v-html="replyItem.user.nickname"></span>
                  </div>
                  回复
                  <div class="replay-user">
                    <img class="user-portrait" v-lazy="replyItem.reply_comment.user.portrait" />
                    <span
                      class="reply-nickname"
                      v-html="replyItem.reply_comment.user.nickname + '：'"
                    ></span>
                  </div>
                </template>
                <div v-else v-cloak class="replay-user">
                  <img class="user-portrait" v-lazy="replyItem.user.portrait" />
                  <span class="reply-nickname" v-html="replyItem.user.nickname + '：'"></span>
                </div>
                <span class="reply-content" v-html="replyItem.content"></span>
              </div>
              <div v-if="comment.reply_count > REPLY_MORE_LIMIT" class="reply-comment-more">
                <span class="rcm-text" @click.prevent.stop="showGuideApp()">
                  查看全部{{comment.reply_count}}回复
                </span>
              </div>
            </div>
          </div>
          <div class="right-zone">
            <span class="like-btn" @click.prevent.stop="clickLikeBtn(comment, index)">
              <span v-if="comment.like_count" v-cloak class="like-text">{{comment.like_count}}</span>
              <i class="icon icon-like"></i>
            </span>
          </div>
        </div>
      </li>
      <li
        v-if="showGuideBtn"
        v-cloak
        class="guide-item border-1px border-top-1px"
        @click.prevent.stop="clickMoreComments"
      >
        <div class="open-app-btn">展开更多评论</div>
      </li>
    </ul>
    <div class="comment-empty-wrap" v-else>
      <content-empty msg="快来抢下第一条评论～"></content-empty>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import contentEmpty from '@/components/contentEmpty/contentEmpty.vue';

const REPLY_MORE_LIMIT = 3;

export default {
  name: 'comment-list',
  components: {
    contentEmpty,
  },
  props: {
    commentList: {
      type: Array,
      default() {
        return [];
      },
    },
    showGuideBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      REPLY_MORE_LIMIT
    };
  },
  methods: {
    formatTime(strTime) {
      return strTime.substring(0, 16);
    },
    clickMoreComments() {
      console.log('点击了更多评论按钮');
      this.$emit('clickMoreComments');
    },
    clickLikeBtn(...args) {
      console.log('点击了点赞按钮', ...args);
      this.$emit('onLike', ...args);
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

<style lang="stylus" scoped>
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"

  .comment-list {
    .item {
      position: relative
      padding: 16px
      background-color: #fff
      overflow: hidden
      .hot-sign {
        position: absolute
        left: 0
        top: 0
        width: 18px
        height: 18px
        .icon-hot {
          position: absolute
          top: 0
          left: 0
          display: block
          width: 100%
          height: 100%
          background: transparent url(./com_icon_hot2.png) center center no-repeat
          background-size: cover
        }
      }
      .comment-user-zone {
        position: relative
        display: flex
        .avatar-zone {
          position: relative
          width: 30px
          height: 30px
          margin-right: 8px
          .avatar {
            display: block
            width: 100%
            height: 100%
            object-fit cover
            border-radius: 50%
          }
        }
        .info-zone {
          flex: 1 1 auto;
          width: 1%
          overflow: hidden
          .nickname {
            display: block
            margin: 0 80px 4px 0
            height: 13px;
            line-height: 13px;
            color: $color-text-l;
            font-size: 13px;
            text-align: left;
            no-wrap()
          }
          .time {
            display: block
            margin-top 8px
            height: 10px;
            line-height: 10px;
            color: $color-text-l;
            font-size: 10px;
            no-wrap()
          }
        }
        .right-zone {
          position: absolute
          top: -4px
          right: 0
          .like-btn {
            display: flex
            align-items: center
            extend-click()
            .icon {
              margin-left 2px
              display: block
              width: 18px
              height: 18px
              background-repeat: no-repeat
              background-position: center center
              background-size: cover
            }
            .icon-like {
              background-image: url(./feed_icon_like_gray.png)
            }
            .like-text {
              display: block
              font-size: 11px
              color: $color-text-l
            }
          }
        }
      }
      .comment-conetnt {
        padding: 0
        display: block
        line-height: 22px;
        color: $color-text;
        font-size: 14px;
        text-align: justify
        white-space: pre-wrap
        word-break: break-all
      }
      .reply-comments-wrap {
        margin-top 12px
        padding 12px
        background:#F6F7FA;
        border-radius:4px;
        .reply-comments-item {
          font-size:14px;
          font-weight:400;
          color: $color-text;
          line-height:22px;
          vertical-align middle
          & + .reply-comments-item {
            margin-top 8px
          }
          .replay-user {
            display inline-block
            color: $color-text-l;
            line-height:22px;
            // float left
            .user-portrait {
              display inline-block
              margin: -2px 2px 0 0;
              width 16px
              height 16px
              border-radius 50%
              overflow hidden
              object-fit cover
              vertical-align middle
            }
            .reply-nickname {
              font-size:14px;
            }
          }
          .reply-content {}
        }
        .reply-comment-more {
          margin-top 12px
          font-size 0
          .rcm-text {
            display inline-block
            height:12px;
            font-size:12px;
            font-weight:400;
            color:$color-theme;
            line-height:12px;
            padding 0 12px 0 0
            background transparent url('./com_icon_arr_orange@2x.png') right center /12px 12px no-repeat
          }
        }
      }
    }
    .guide-item {
      padding: 15px 16px
      margin-bottom: 20px
      display: flex
      align-items: center
      justify-content: center
      cursor: pointer
      &::before {
        background: #f2f2f2
      }
      .open-app-btn {
        display: inline-flex
        align-items: center
        justify-content: center
        height: 14px;
        line-height: 14px;
        color: $color-theme;
        font-size: $font-size-medium;
        text-align: center;
        &::after {
          content: ''
          display: block
          margin-left: 2px
          width: 12px
          height: 12px
          background: transparent url(./com_icon_dropdown_orange.png) center center no-repeat
          background-size: cover
        }
      }
    }
  }

</style>
