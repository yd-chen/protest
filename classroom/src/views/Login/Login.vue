<template>
  <div class="login-wrapper">
    <div class="login-way">
      <div class="verify-tag" :class="{'selected': currentMode == modes[0]}" @click="triggleTo(modes[0])">验证登录</div>
      <!-- <div class="account-tag" :class="{'selected': currentMode == modes[1]}" @click="triggleTo(modes[1])">账户登录</div> -->
    </div>

    <div class="login-form">
      <!-- 验证码登录 -->
      <div class="verify-login" v-show="currentMode == modes[0]" v-cloak>
        <div class="input-control phone-container">
          <i class="icon ic-tel"></i>
          <div class="main">
            <input class="phone-input input" id="phone-input" type="text" placeholder="请输入手机号码" v-model="phone" @focus="phone = phone || null" @blur="valueBlur('phone')">
            <label class="error-mask" for="phone-input" v-show="phone===''" v-cloak>请输入手机号码</label>
          </div>
        </div>
        <div class="input-control code-container">
          <div class="code">
            <i class="icon ic-msg"></i>
            <div class="main">
              <input class="code-input input" id="code-input" type="text" placeholder="请输入验证码" v-model="verifyCode" @focus="verifyCode = verifyCode || null" @blur="valueBlur('vcode')">
              <label class="error-mask" for="code-input" v-show="verifyCode === ''" v-cloak>请填写验证码</label>
            </div>
          </div>
          <!-- <button class="get-code-btn " :class="{'disabled': seconds !== ''}" :disabled="seconds !== ''" @click="getVerifyCode" v-text="seconds !== ''? seconds+'s' : '获取验证码'">获取验证码</button>  -->
          <button class="get-code-btn " :class="{'disabled': !phone || phone == ' ' || seconds !== ''}" :disabled="seconds !== ''" @click="getVerifyCode" v-text="seconds !== ''? seconds+'s' : '获取验证码'">获取验证码</button>
        </div>
      </div>

      <!-- 账户登录 -->
      <div class="account-login" v-show="currentMode == modes[1]" v-cloak>
         <div class="input-control account-container">
          <i class="icon ic-user"></i>
          <div class="main">
            <input class="acc-input input" id="acc-input" type="text" placeholder="请输入用户名/手机号码/邮箱" v-model="account" @focus="account = account || null" @blur="valueBlur('account')">
            <label class="error-mask" for="acc-input" v-show="account === ''" v-cloak>请输入用户名/手机号/邮箱</label>
          </div>
        </div>
         <div class="input-control pwd-container">
          <i class="icon ic-lock"></i>
          <div class="main">
            <input class="pwd-input input" id="pwd-input" type="text" placeholder="输入密码" v-model="password" @focus="password = password || null" @blur="valueBlur('password')">
            <label class="error-mask" for="pwd-input" v-show="password === ''" v-cloak>请输入密码</label>
          </div>
        </div>
      </div>
    </div>
    <button class="login-btn" :class="{'abled': phone && verifyCode || account && password}" :disabled = "!(phone && verifyCode || account && password)" @click="startToLogin(currentMode)">登录</button>

    <div class="other-login-wrap">
      <div class="other-hr">其他登录方式</div>
      <div class="other-login-list">
        <a class="wx" href="#" @click="wechatLogin"></a>
        <a class="wb" href="#"></a>
        <a class="qq" href="#"></a>
      </div>
    </div>
  </div>

</template>

<script>
import { requestVerifyCode, verifyCodeLogin, checkLogin } from '@/api/api';

const modes = [
  'verify-login', // 验证登录
  'account-login', // 账户登录
];

export default {
  name: 'Login',
  data() {
    return {
      defaultSeconds: 60,
      seconds: '',
      timeGo: '',
      modes,
      currentMode: modes[0], // 登录类型：“手机验证码登录”
      phone: null,
      verifyCode: null,
      account: null,
      password: null,
      valueOf: [
        { // 验证登录
          phone: null,
          vcode: null,
        },
        { // 账户登录
          account: null,
          password: null,
        },
      ],
    };
  },
  methods: {
    triggleTo(mode) {
      if (this.currentMode == mode) {
        return;
      }
      this.phone = null;
      this.verifyCode = null;
      this.account = null;
      this.password = null;
      this.currentMode = mode;
    },
    valueBlur(type) {
      if (type == 'phone' && (!this.phone || this.phone == ' ')) {
        this.phone = '';
      } 2;
      if (type == 'vcode' && (!this.verifyCode || this.verifyCode == ' ')) {
        this.verifyCode = '';
      }
      if (type == 'account' && (!this.account || this.account == ' ')) {
        this.account = '';
      }
      if (type == 'password' && (!this.password || this.password == ' ')) {
        this.password = '';
      }
    },
    countDown() {
      this.seconds = this.defaultSeconds;
      this.defaultSeconds -= 1;
      if (this.defaultSeconds < 0) {
        clearInterval(this.timeGo);
        this.defaultSeconds = 60;
        this.seconds = '';
      }
    },
    getVerifyCode() {
      const _this = this;
      if (!this.phone) {
        this.phone = '';
        return;
      }

      requestVerifyCode(_this.phone).then((data) => {
        console.log(data);
        if (!data) {
          return;
        }
        if (_this.timeGo) {
          clearInterval(_this.timeGo);
        }
        _this.timeGo = setInterval(_this.countDown, 1000);
      });
    },
    startToLogin(curMode) {
      const _this = this;
      if (curMode == modes[0]) { // 验证码登录
        if (!_this.phone || !_this.verifyCode) {
          return;
        }
        const params = {
          phone: _this.phone,
          verify_code: _this.verifyCode,
        };
        verifyCodeLogin(_this.phone, _this.verifyCode).then((res) => {
          console.log(res);
          if (res.data) { // 登录成功
            _this.$store.commit('settoken', res.data.result);
            window.localStorage.setItem('token', res.data.result);

            // 路由是否带参，带参就去到重定向参数地址，否则就去首页
            if (_this.$route.query.redirect) {
              _this.$router.replace({ path: _this.$route.query.redirect });
            } else {
              _this.$router.replace({ path: '/recommend' });
            }
          }
        });
      } else {}
    },
    wechatLogin() {
      const _this = this;
      let wxLoginUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx581593f1bcbfaaa8&redirect_uri={redirect_uri}&response_type=code&scope=snsapi_base&state=2#wechat_redirect';

      const originUri = `https://api.yojiang.cn/api/weixin/login/oauth2?next=${window.location.href}`;

      const encodedUrl = encodeURIComponent(originUri);

      wxLoginUrl = wxLoginUrl.replace('{redirect_uri}', encodedUrl);

      console.log(originUri, encodedUrl, wxLoginUrl);
      setTimeout(() => {
        // window.location.href = wxLoginUrl;
        _this.goBack();
      }, 2500);
    },
    goBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/recommend');
    },
    checkLogin() {
      const _this = this;
      checkLogin().then((res) => {
        const { result } = res.data;
        console.log('已登录？', res.data.result);
        if (res.data.result) { // 状态：已经登录
          _this.$store.commit('settoken', result);
          window.localStorage.setItem('token', result);
        } else {
          console.log('未登录');
          window.localStorage.moveItem('token');
        }
      });
    },
  },
  created() {
    // console.log(this.$route);
    this.checkLogin();
  },
};
</script>

<style scoped lang="stylus">
  .none {
    display: none
  }
  .login-wrapper {
    position relative
    width 100vw
    max-width 640px
    min-height 100vh
    margin auto
    background-image: -webkit-gradient(linear,left top,left bottom,from(#FA8C1D),to(#FCB13F));
    background-image: linear-gradient(to bottom,#FA8C1D,#FCB13F);
    padding-top 1px
    button {
      margin: 0;
      padding: 0;
      border: 1px solid transparent;
      outline: none;
      background-color: transparent;
    }
    .login-way {
      margin 8vh auto 4vh
      display flex
      flex-direction row
      align-items center
      justify-content center
      color rgba(255, 255, 255, .5)
      font-size 24px
      >div {
        position relative
        height 28px
        line-height 28px
        text-align center
        margin auto 20px
      }
      >div:not(:last-child)::after {
        content ''
        display inline-block
        width 2px
        height 24px
        background-color rgba(255, 255, 255, .5)
        position absolute
        right -20px
        top 2px
      }
      .selected {
        color #fff
      }
    }
    .login-form {
      display block
      width 80%
      background-color #ffffff
      border-radius 4px
      overflow hidden
      margin auto
      .icon {
        display inline-block
        margin-right: 10px;
        width: 20px;
        height: 20px;
      }
      .main {
        position relative
        flex 1
        display flex
      }
      .error-mask {
        position: absolute;
        width: 100%;
        height: 32px;
        background: #fff;
        left: 0;
        line-height: 32px;
        // font-size: 15px;
        color: #FC7265;
        background gba(255, 192, 203, 0.43)
      }
      input {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        overflow: hidden;
        height: 32px;
        font-size: 16px;
        outline: 0;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        &::-webkit-input-placeholder {
          color #aaa
        }
      }
      .input-control {
        padding: 7px 12px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        &:first-child {
          border-bottom 1px solid #eee
        }
      }
      .verify-login {
        width 100%
        .phone-container {
          .ic-tel {
            background url(/icon_phone.png) no-repeat center center
            background-size 20px
          }
        }
        .code-container {
          display flex
          flex-direction row
          align-items center
          .code {
            display flex
            flex-direction row
            align-items center
            width: calc(100% - 84px);
            .ic-msg {
              background url(/icon_msg.png) no-repeat center center
              background-size 20px
            }
            .main {
              width calc(100% - 30px)
              .code-input {
                width 100%
              }
            }
          }
          .get-code-btn {
            width: 84px;
            height: 32px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            border-radius: 4px;
            background-color: #000;
            font-size: 12px;
            color: #fff;
          }
          .disabled {
            background-color #bebebe
          }
        }
      }
      .account-login {
        .account-container {
          .ic-user {
            background url(/icon_user.png) no-repeat center center
            background-size 20px
          }
        }
        .pwd-container {
          .ic-lock {
            background url(/icon_lock.png) no-repeat center center
            background-size 20px
          }
        }
      }
    }

    .login-btn {
      width 80%
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      height: 44px;
      border-radius: 3px;
      background-color: #bebebe;
      font-size: 18px;
      font-weight: 500;
      color: #fff;
      margin 30px auto auto
    }
    .abled {
      background-color #000
    }
    .other-login-wrap {
      // position absolute
      // left 0
      // right 0
      // bottom 0
      // width 100%
      // background pink
      margin-top 25vh
      .other-hr {
        position relative
        width 110px
        margin auto
        font-size 14px
        text-align center
        color #cd881d
        // background #ededde
        &::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: -50px;
          margin: auto;
          display: block;
          width: 50px;
          height: 1px;
          background-color: #cd881d;
        }
        &::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          right: -50px;
          margin: auto;
          display: block;
          width: 50px;
          height: 1px;
          background-color: #cd881d;
        }
      }
      .other-login-list {
        width 100%
        display flex
        justify-content space-evenly
        >a {
          display inline-block
          width 40px
          height 40px
          border-radius 50%
          margin-top 10px
          margin-bottom 10px
        }
        .wx {
          // background #58bc46 url(/wechat.png) no-repeat center center
          background url(/wechat.png) no-repeat center center
          background rgba(88, 188, 70, .5) url(/wechat.png) no-repeat center center
        }
        .wb {
          // background #e90e24 url(/weibo.png) no-repeat center center
          background url(/weibo.png) no-repeat center center
          background rgba(233, 14, 36, .5) url(/weibo.png) no-repeat center center
        }
        .qq {
          // background #3caae3 url(/qq.png) no-repeat center center
          background url(/qq.png) no-repeat center center
          background rgba(60, 170, 227, .5) url(/qq.png) no-repeat center center
        }
      }
    }
  }


</style>
