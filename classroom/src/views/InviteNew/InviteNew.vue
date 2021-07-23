<template>
  <div class="pager">
    <div class="logo">
      <img src="../../common/images/logo.png" alt="logo" class="ico">
      <h1 class="logo-name">有讲课堂</h1>
    </div>
    <i class="icon-adorn-left"></i>
    <i class="icon-adorn-right"></i>
    <div class="invite-user-wrap">
      <div class="user-zone">
        <div class="avatar-zone">
          <img v-lazy="inviteUserInfo.portrait" alt="" class="avatar">
        </div>
        <h2 class="nickname" v-html="inviteUserInfo.nickname"></h2>
        <p class="tip-text">送你一份好礼</p>
      </div>
    </div>
    <i class="icon-adorn-coin"></i>
    <div class="invite-main">
      <img src="./invite-red-pag.png" alt="" class="red-pag-bg">
      <div class="invite-info-wrap needsclick" v-if="!isInviteSelf" v-cloak>
        <input type="tel" class="input-control needsclick" v-model.number.trim="beInvitedTel" @blur="inputBlur"
               placeholder="请输入手机号">
        <div class="submit-btn needsclick" @click.prevent.stop="submitInvition()">立即领取</div>
      </div>
      <div class="invite-info-wrap needsclick" v-else v-cloak>
        <div class="submit-btn needsclick" @click.prevent.stop="showWxShareToast()">分享邀请</div>
      </div>
    </div>
    <wx-share-toast :timeout-hide="true"
                    ref="wxShareToast"
                    :mask-closable="true"></wx-share-toast>
  </div>
</template>

<script>
import {
  requestUserInfo,
  inviteBindPhone,
  getWxShareOptions,
  inviteActivityBindPhone,
} from '@/api/api';
import {
  checkPhone,
} from '@/common/js/utils';
import { openAppMixin } from '@/mixin/openAppMixin';
import wxJssdkMixin from '@/mixin/wxJssdkMixin';

import wxShareToast from '@/components/wxShareToast/wxShareToast.vue';

export default {
  name: 'invite-new',
  mixins: [openAppMixin, wxJssdkMixin],
  components: {
    wxShareToast,
  },
  data() {
    return {
      beInvitedTel: '',
      inviteUserId: 0,
      ticket: '',
      inviteUserInfo: {},
      submitting: false,
      isInviteSelf: false,
    };
  },
  created() {
    this.ticket = this.$route.query.ticket;
    this.isInviteSelf = this.$route.query.is_invite_share === '1';
    console.log(this.ticket, this.isInviteSelf);
    this.getUserInfoFotTicket();
  },
  methods: {
    getUserInfoFotTicket() {
      requestUserInfo(this.ticket).then((data) => {
        this.inviteUserInfo = data;
      }).then(() => {
        const shareData = {};

        shareData.title = '学好课，上有讲';
        shareData.desc = `你的好友${this.inviteUserInfo.nickname}现邀请你加入有讲课堂，领取红包`;
        shareData.link = `${window.location.origin + window.location.pathname}?ticket=${this.ticket}`;
        shareData.imgUrl = this.inviteUserInfo.portrait;
        console.log(shareData);
        this.initWxJssdk(shareData);
      });
    },
    submitInvition() {
      if (!checkPhone(this.beInvitedTel)) {
        const toast = this.$createToast({
          time: 1000,
          type: 'txt',
          txt: '请输入正确的手机号',
        });
        toast.show();
        return false;
      }

      inviteBindPhone(this.beInvitedTel, this.ticket).then(() => {
        // this.$createToast({
        //   time: 1000,
        //   type: 'txt',
        //   txt: '绑定成功！',
        //   onTimeout: () => {
        //     this.openAppDownload();
        //   },
        // }).show();
        console.log('inviteBindPhone done');
        this.openAppDownload();
      }).catch((err) => {
        console.log(err);
      });
    },
    inputBlur() {
      window.scroll(0, 0);
    },
    showWxShareToast() {
      this.$refs.wxShareToast.show();
    },
  },
};
</script>

<style scoped lang="stylus">
  @import "./../../common/stylus/variable.styl"
  @import "./../../common/stylus/mixin.styl"

  .pager {
    position: relative
    z-index: 100
    margin: auto
    width: 100%
    height: 100vh
    max-width: 640px
    min-width: 320px
    background: #CA1D1F
    background: radial-gradient(circle at 50% 50%, #FF8A63, #CA1D1F);
    overflow: hidden
  }

  .logo {
    position: absolute
    top: 16px
    left: 16px
    z-index: 1
    display: inline-flex
    align-items: center
    .ico {
      display: block
      width: 24px
      height: 24px
    }
    .logo-name {
      margin-left: 4px
      height: 14px;
      line-height: 14px;
      color: #fff;
      font-size: $font-size-medium;
      text-align: center;
    }
  }

  .icon-adorn-left {
    position: absolute
    left: 0
    top: -64px
    width: 162px
    height: 183px
    opacity: .83
    background: transparent url(./adorn-left.png) center center no-repeat
    background-size: 162px 183px
  }

  .icon-adorn-right {
    position: absolute
    right: 0
    top: 7px
    width: 76px
    height: 120px
    opacity: .65
    background: transparent url(./adorn-right.png) center center no-repeat
    background-size: 76px 120px
  }

  .icon-adorn-coin {
    position: absolute
    top: 8%
    left: 0
    right: 0
    display: block
    margin: auto
    width: 100%
    padding-bottom: 82.93%
    background: transparent url(./adorn-coin.png) center center no-repeat
    background-size: contain
  }

  .invity-activity-bg {
    position: absolute
    top: 28%
    left: 0
    right: 0
    display: block
    margin: auto
    width: 77%
    &.not-self {
      top: 17vh
      width: 86%
    }
  }

  .invite-user-wrap {
    position: relative
    z-index: 1
    display: block
    margin: 10vh auto 0
    .user-zone {
      .avatar-zone {
        display: block
        width: 64px
        height: 64px
        padding: 2px
        margin: auto
        border-radius: 50%
        background-color: #ffffff
        overflow: hidden
        .avatar {
          display: block
          width: 60px
          height: 60px
          border-radius: 50%
          overflow: hidden
        }
      }
      .nickname {
        max-width: 80%
        display: block
        margin: 10px auto 0
        height: 16px;
        line-height: 16px;
        color: #fff;
        font-size: $font-size-medium-x;
        font-weight: 500
        text-align: center;
        no-wrap();
      }
      .tip-text {
        max-width: 80%
        display: block
        margin: 10px auto 0
        height: 16px;
        line-height: 16px;
        color: rgba(255, 255, 255, .6);
        font-size: $font-size-small;
        text-align: center;
        no-wrap();
      }
    }
  }

  .invite-main {
    position: absolute
    top: 30%
    left: 0
    right: 0
    margin: auto
    width: 100%
    max-width: 375px
    height: 428px
    .red-pag-bg {
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0
      width: 95%
      height: auto
      display: block
      margin: auto
    }
    .invite-info-wrap {
      position: absolute
      top: 47%
      left: 11%
      right: 11%
      bottom: 20%
      z-index: 1
      .input-control {
        display: block
        width: 88%;
        height: 44px;
        padding: 10px 24px
        margin: auto
        border-radius: 100px;
        background-color: #fff;
        color: $color-text;
        font-size: 14px;
        text-align: left;
        outline: none
        &::placeholder {
          color: $color-text-l;
        }
      }
      .submit-btn {
        display: flex
        align-items: center
        justify-content: center
        width: 88%;
        height: 44px;
        padding: 10px 24px
        margin: 20px auto
        border-radius: 100px;
        background-color: #FED26D
        background: linear-gradient(#FFFAB6, #FED26D);
        box-shadow: 0px 6px 12px 0px rgba(128, 8, 8, 0.2);
        color: #E52A0E;
        font-size: 18px;
        font-weight: 500
        text-align: center;
      }
    }
  }

  @media screen and (max-width: 355px) {
    .invite-user-wrap {
      .user-zone {
        .avatar-zone {
          width: 58px
          height: 58px
          padding: 2px
          .avatar {
            width: 54px
            height: 54px
          }
        }
        .nickname {
          font-size: $font-size-medium-x;
        }
      }
    }

    .invite-main {
      height: 375px
      .red-pag-bg {
        width: 92%
      }
      .invite-info-wrap {
        top: 46.5%
        .input-control {
          height: 40px;
          padding: 8px 24px
        }
        .submit-btn {
          height: 40px;
          padding: 8px 24px
        }
      }
    }
  }

</style>
