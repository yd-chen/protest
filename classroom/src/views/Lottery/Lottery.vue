<template>
  <div class="lottery-page">
    <section class="lottery-wrap">
      <img src="../../common/images/lottery_content.png" class="wrap-bg" />
      <div class="wrap-content">
        <div class="bulletin">
          <i class="icon"></i>
          <div class="msg-box">
            <template v-for="(item, index) in simulateUsers">
              <span :key="index" class="msg-item">{{ item.user.nickname }} 刚刚抽中了 {{ item.award }}</span>
            </template>
          </div>
        </div>
        <div class="lottery-outzone">
          <div class="lottery-inbox" :class="{ 'all-show': drawing }">
            <div v-for="(item, index) in awardsData" :key="index" :class="['award-' + (index + 1)]" class="item">
              <div class="i-box" :class="{ active: index === current }">
                <div class="img-zone">
                  <img :src="item.image" class="prize-img" />
                </div>
                <div class="prize-txt">{{ item.name }}</div>
              </div>
            </div>
            <div class="item btn" :class="{ 'drawing': drawing }" @click.stop="handleLotte()"></div>
          </div>
        </div>
      </div>
    </section>
    <div class="rules">
      活动规则：
      <br>
      <br>
      1、每次抽奖消耗888金币，金币不足时，可通过完成金币任务等方式获取金币；
      <br>
      <br>
      2、中奖后请在「我的奖品」中查看使用；
      <br>
      <br>
      3、奖品池根据实际情况会不定期更新，以页面最终展示的奖品为准；
      <br>
      <br>
      4、我司对上述规则保留在法律规定范围内的解释权。
    </div>
    <!-- 提示弹窗: 金币不足 -->
    <div class="dialog icons-notenought-dialog" v-show="showCoinNotEnought">
      <div class="main">
        <h4 class="title">金币不足</h4>
        <div class="sub">您的金币不够了，赶紧去做任务获取金币吧</div>
        <div class="btns">
          <div class="btn cancel" @click.stop="showCoinNotEnought = false">取消</div>
          <div class="btn to-do" @click.stop="jumpToPointPage()">做任务</div>
        </div>
      </div>
    </div>
    <!-- 提示弹窗：获得奖品 -->
    <div class="dialog prize-result-dialog">
      <div class="main">
        <div class="close-btn"></div>
        <img src="../../common/images/lottery_coin_1288@3x.jpg" class="prize-img" />
        <!-- 获得奖品：金币 -->
        <div class="sub-box yj-golden-coin">
          <div class="prize-sub">恭喜你！获得<span class="name">8888</span>金币</div>
        </div>
        <!-- 获得奖品：优惠券 -->
        <div class="sub-box yj-voucher">
          <div class="prize-sub">恭喜你！获得<span class="name"></span></div>
          <div class="tip">可在【我的优惠券】里查看</div>
        </div>
        <!-- 获得奖品：优惠券 -->
        <div class="sub-box yj-voucher">
          <div class="prize-sub">恭喜你！获得<span class="name"></span></div>
          <div class="tip">可在【我的优惠券】里查看</div>
        </div>
        <div class="btn confirm">分享</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMyCoin, drawCoinLottery } from '@/api/api';
import yj from '@/common/js/yj';
import { awardsData } from '@/config/awardsData';
import {
  simulateAwards,
  simulatePortraits,
  simulateNicknames
} from '@/config/simulate-user-data';

const COIN_COUNT_AT_LEAST = 888;
let windowTimeout;

export default {
  data() {
    return {
      awardsData,
      showCoinNotEnought: false,
      drawing: false,

      current: 0,
      speed: 200,
      diff: 15,
      award: {},
      time: 0,

      simulateUsers: [],
      num: 0,
      timerCount: ''
    };
  },
  created() {
    this.loadSimulateUsers();
  },
  mounted() {
    this.controlMarign();
  },
  methods: {
    // 金币数
    getMyCoinData() {
      getMyCoin().then((data) => {
        console.log('金币数', data.coin);
        if (data.coin < COIN_COUNT_AT_LEAST) {
          this.showCoinNotEnought = true;
        } else {
          // 开始抽奖
          // console.log('开始抽奖');
          this.time = Date.now();
          this.speed = 200;
          this.diff = 15;
          this.drawPrize();
        }
      });
    },
    handleLotte() {
      if (this.drawing) return;
      this.getMyCoinData();
    },
    move() {
      this.drawing = true;
      windowTimeout = setTimeout(() => {
        this.current += 1;
        if (this.current > 7) {
          this.current = 0;
        }
        if (this.award.extra_data.key && (Date.now() - this.time) / 1000 > 2) {
          this.speed += this.diff;
          if ((Date.now() - this.time) / 1000 > 4 && this.award.extra_data.key === this.awardsData[this.current].key) {
            clearTimeout(windowTimeout);
            setTimeout(() => {
              this.prizeConfirm(this.award);
            }, 1200);
            return;
          }
        } else {
          this.speed -= this.diff;
        }
        this.move();
      }, this.speed);
    },
    drawPrize() {
      drawCoinLottery().then((data) => {
        // console.log('抽奖接口返回', data);
        this.award = data;
        this.move();
      });
    },
    prizeConfirm(data) {
      const prizeName = data.name;
      const prizeImg = data.image;
      const prizeKey = data.extra_data.key;
      const dialog = document.getElementsByClassName('prize-result-dialog')[0];
      const prizeImage = dialog.getElementsByClassName('prize-img')[0];
      const confirmBtn = dialog.getElementsByClassName('confirm')[0];
      const closeBtn = dialog.getElementsByClassName('close-btn')[0];
      const subBox = dialog.getElementsByClassName('sub-box');
      const coinBox = subBox[0];
      const voucherBox = subBox[1];
      const othersBox = subBox[2];
      prizeImage.src = prizeImg;
      prizeImage.onload = () => {
        const clearDialogData = () => {
          if (prizeKey === 'coin_1288') {
            // 金币
            coinBox.style.display = 'none';
          } else if (prizeKey === 'voucher_20') {
            // 优惠券
            voucherBox.style.display = 'none';
            voucherBox.getElementsByClassName('name')[0].innerHTML = '';
          } else {
            othersBox.style.display = 'none';
            othersBox.getElementsByClassName('name')[0].innerHTML = '';
          }
          confirmBtn.innerHTML = '';
          dialog.style.display = 'none';
        };

        if (prizeKey === 'coin_1288') {
          // 金币
          coinBox.style.display = 'block';
          confirmBtn.innerHTML = '再抽一次';
        } else if (prizeKey === 'voucher_20') {
          // 优惠券
          voucherBox.style.display = 'block';
          voucherBox.getElementsByClassName('name')[0].innerHTML = prizeName;
          confirmBtn.innerHTML = '去看看';
        } else {
          // 其他奖品
          othersBox.style.display = 'block';
          othersBox.getElementsByClassName('name')[0].innerHTML = prizeName;
          confirmBtn.innerHTML = '分享';
        }
        dialog.style.display = 'flex';
        confirmBtn.addEventListener('click', () => {
          clearDialogData();
          if (prizeKey === 'coin_1288') {
            // 金币
            this.getMyCoinData();
          } else if (prizeKey === 'voucher_20') {
            // 优惠券
            const postData = {
              event: 'my_voucher'
            };
            yj.jumpPage(postData);
          } else {
            // 其他奖品
            // 微信分享好友
            const postData = {
              type: 1,
              options: {
                title: '我在有讲课堂抽中了888金币，你也来试试手气吧',
                desc: '学技能 上有讲',
                link: 'https://mp.weixin.qq.com/s/EDJ2Q0MzBlUvjcjwHR53wA',
                imgUrl: 'https://alcdn.yojiang.cn/manual/fr-share-icon_0903.png'
              }
            };
            yj.invokShare2(postData);
          }
        });
        closeBtn.addEventListener('click', () => {
          clearDialogData();
        });
        setTimeout(() => {
          this.drawing = false;
        }, 200);
      };
    },
    jumpToPointPage() {
      const postData = {
        event: 'my_point'
      };
      yj.jumpPage(postData);
    },
    getRandomArrayElements(arr, count) {
      const shuffled = arr.slice(0);
      let i = arr.length;
      const min = i - count;
      let temp;
      let index;
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
      }
      return shuffled.slice(min);
    },
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    loadSimulateUsers() {
      const count = 50;
      const shuffledPortraits = this.getRandomArrayElements(
        simulatePortraits,
        count
      );
      const shuffledNicknames = this.getRandomArrayElements(
        simulateNicknames,
        count
      );
      const items = [];
      for (let i = count - 1; i >= 0; i--) {
        const ret = {};
        ret.user_id = i + 1;
        ret.user = {
          portrait: shuffledPortraits[i],
          nickname: shuffledNicknames[i].substring(0, 1) + '***'
        };
        const random = this.getRandomInt(0, simulateAwards.length - 1);
        ret.award = simulateAwards[random];
        items.push(ret);
      }
      this.simulateUsers = this.simulateUsers.concat(items);
      console.log('用户:', this.simulateUsers.length);
      setTimeout(() => {
        this.loadSimulateUsers();
        // 50个用户滚动完需要50(个)*3000(ms)*28(px)=4200000ms
      }, 80000);
    },
    controlMarign() {
      const dom = document.getElementsByClassName('msg-item')[0];
      if (this.num === 0) {
        dom.style.marginTop = 0;
      }
      this.timerCount && clearTimeout(this.timerCount);
      dom.style.marginTop = -1 * this.num * 28 + 'px';
      this.num++;
      this.timerCount = setInterval(() => {
        this.controlMarign();
      }, 3000);
    },
  }
};
</script>

<style scoped lang="stylus">
@import "./../../common/stylus/variable.styl"
@import "./../../common/stylus/mixin.styl"
.lottery-page {
  width: 100%
  max-width 640px
  min-height: 100vh;
  margin auto
  padding 0 16px 45px
  background url(/lottery_bg.jpg) repeat-y
  background-size 100%
}
.lottery-wrap {
  position relative
  margin-bottom 16px
  .wrap-bg {
    width 100%
  }
  .wrap-content {
    position absolute
    left 0
    bottom 0
    width 100%
    padding 0 16px 16px
    .bulletin {
      position relative
      width: 100%;
      height: 28px;
      margin-bottom 16px
      background: rgba(176,98,8,0.08);
      border-radius: 14px;
      font-size:12px;
      font-weight:400;
      color: #BB6213;
      line-height: 28px;
      text-align center
      overflow hidden
      .icon {
        position absolute
        top 0
        left 0
        display inline-block
        width 25.402%
        height 100%
        background url('../../common/images/task_icon_horn@2x.png') center right no-repeat
        background-size 12px
      }
      .msg-box {
        position absolute
        top 0
        left 27.331%
        height 28px;
        .msg-item {
          display block
          margin-top 0
          text-align left
        }
      }
    }
  }
}
.lottery-outzone {
  position relative
  width 100%
  padding-bottom 100%
  .lottery-inbox {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    margin: auto;
    .item {
      position: absolute;
      display: inline-block;
      width: 32.4759%;
      padding-top: 32.4759%;
      border-radius 2px
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      &.award-1 {
        top 0
        left 0
      }
      &.award-2 {
        top 0
        left 33.762%
      }
      &.award-3 {
        top 0
        right 0
      }
      &.award-4 {
        top 33.762%
        right 0
      }
      &.award-5 {
        right 0
        bottom 0
      }
      &.award-6 {
        left 33.762%
        bottom 0
      }
      &.award-7 {
        left 0
        bottom 0
      }
      &.award-8 {
        top 33.762%
        left 0
      }
      &.btn {
        top 33.762%
        left 33.762%
        background url(../../common/images/lottery_btn_default.png) center center no-repeat
        background-size cover
        &.drawing {
          background url(../../common/images/lottery_btn_drawing.png) center center no-repeat
          background-size cover
        }
      }
      .i-box {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        margin: auto;
        padding: 8px 0;
        background #fff
        text-align center
        .img-zone {
          position: relative;
          display inline-block
          width 63.367%
          padding-top 63.367%
          // background pink
          .prize-img {
            position absolute
            top 0
            left 0
            width 100%
            height 100%
            background-size 100%
          }
        }
        .prize-txt {
          margin-top 5px;
          font-size:12px;
          font-weight:400;
          color: $color-text;
          line-height:12px;
        }
      }
    }
    &.all-show {
      .item {
        .i-box::after {
          content: '';
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background-color: rgba(120,60,0,0.3);
          z-index: 1;
        }
        .i-box.active::after {
          background-color: transparent;
        }
      }
    }
  }
}
.rules {
  font-size: 14px;
  font-weight: 400;
  color: rgba(255,255,255,1);
  line-height: 20px;
}
.dialog {
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  width 100%
  height 100%
  background:rgba(0,0,0,0.4);
  z-index 1000
}
.icons-notenought-dialog {
  display flex
  align-items center
  justify-content center
  .main {
    width 78.667%
    max-width 295px
    padding-top 16px
    border-radius 8px
    background-color #fff
    .title {
      width: 100%;
      font-size: 18px;
      font-weight: 500;
      color: $color-text;
      line-height: 24px;
      text-align center
    }
    .sub {
      width: 100%;
      margin 14px 0 24px
      padding 0 24px
      font-size: 15px;
      font-weight: 400;
      color: rgba(25,25,25,0.44);
      line-height: 20px;
      text-align center
    }
    .btns {
      display flex
      width: 100%;
      height: 51px;
      background: rgba(255,255,255,1);
      border-radius: 0px 0px 8px 8px;
      border-top 1px solid #E9E9E9
      .btn {
        flex 1
        font-size:18px;
        font-weight:400;
        color: $color-text-l;
        line-height 50px
        text-align center
        &:not(:last-child) {
          border-right 1px solid #E9E9E9
        }
        &.to-do {
          font-weight: 500;
          color: $color-theme;
        }
      }
    }
  }
}
.prize-result-dialog {
  display none
  align-items center
  justify-content center
  .main {
    position relative
    width 78.667%
    max-width 295px
    padding-top 20px
    border-radius 8px
    background-color #fff
    .close-btn {
      position absolute
      top 0
      right 0
      width 48px
      height 48px
      background url(../../common/images/com_icon_close_gray@2x.png) center center no-repeat
      background-size 24px
      z-index 1
    }
    .prize-img {
      display block
      width 33.898%
      margin auto
      object-fit cover
    }
    .sub-box {
      display none
      padding 12px 0 32px
      .prize-sub {
        width: 100%;
        font-size: 18px;
        font-weight: 500;
        color: $color-text;
        line-height: 24px;
        text-align center
        span {
          color $color-theme
        }
      }
      .tip {
        margin-top 12px
        font-size 14px
        font-weight 400
        color $color-text-l
        line-height 14px
        text-align center
      }
    }
    .btn {
      width 100%
      height: 50px;
      border-top 1px solid #E9E9E9
      font-size: 18px;
      font-weight: 500;
      color: $color-theme;
      line-height: 49px;
      text-align center
    }
  }
}

@media screen and (max-width: 340px) {
.lottery-page {
  padding 0 10px 45px
  .lottery-wrap {
    .wrap-content {
      padding 0 10px 10px
      .lottery-outzone {
        .lottery-inbox {
          .item {
            .i-box {
              .prize-txt {
                font-size:10px;
                font-weight:400;
                color: $color-text;
                line-height:12px;
              }
            }
          }
        }
      }
    }
  }
}
}
</style>
