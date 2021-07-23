<template>
  <div class="home">
    <router-link to="/login">登录登录</router-link>

    <cube-input v-model="loginPhone" :placeholder="phonePlaceholder" :clearable="clearable"></cube-input>
    <cube-button @click="getVerifyCode(loginPhone)">获取验证码</cube-button>
    <cube-input v-model="codeValue" :placeholder="codePlaceholder" :clearable="clearable"></cube-input>

    <cube-button @click="phoneLogin(codeValue)">登录</cube-button>

    <hr>

    <cube-button @click="checkLogin()">checkLogin</cube-button>

    <hr>

    <cube-button @click="getBoughtList()">getBoughtList</cube-button>

    <hr>

    <cube-button @click="getVipInfo()">getVipInfo</cube-button>

    <hr>

    <cube-button @click="getLoginInfo()">getLoginInfo</cube-button>

    <hr>

    <cube-button @click="WeChatLogin()">WeChat Login</cube-button>

    <hr>

    <cube-button @click="logout()">logout</cube-button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  components: {
  },
  data() {
    return {
      loginPhone: '',
      codeValue: '',
      clearable: {
        visible: true,
        blurHidden: true,
      },
      phonePlaceholder: '手机号码',
      codePlaceholder: '验证码',
    };
  },
  created() {
    this.checkLogin();
  },
  methods: {
    phoneLogin(code) {
      console.log('phoneLogin', code);
      const params = {
        phone: this.loginPhone,
        save_login: 1,
        mode: 'code-login',
        verify_code: code,
      };

      this.$axios.post('/api/user/login', params).then((res) => {
        console.log(res);
      });
    },
    getVerifyCode(phone) {
      console.log(this.loginPhone);
      console.log(phone);
      this.$axios.get('/api/user/send_verify_code', {
        params: {
          phone,
        },
      }).then((res) => {
        console.log(res);
      });
    },
    checkLogin() {
      this.$axios.get('/api/user/check_login').then((res) => {
        console.log(res.data);
        // const resData = res.data;
        // if (!resData.result) {
        // const phone = 13631304072;
        // this.phoneLogin(phone);
        // }
      });
    },
    getBoughtList() {
      this.$axios.get('/api/lesson/bought_list').then((res) => {
        console.log(res.data);
      });
    },
    getVipInfo() {
      this.$axios.get('/api/user/vip_info').then((res) => {
        console.log(res.data);
      });
    },
    getLoginInfo() {
      this.$axios.get('/api/user/login_info').then((res) => {
        console.log(res.data);
      });
    },
    logout() {
      this.$axios.get('/live_/user/del_session').then((res) => {
        console.log(res.data);
      });
    },
    WeChatLogin() {
      let wxLoginUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx581593f1bcbfaaa8&redirect_uri={redirect_uri}&response_type=code&scope=snsapi_base&state=2#wechat_redirect';

      const originUri = `https://api.yojiang.cn/api/weixin/login/oauth2?next=${window.location.href}`;

      const encodedUrl = encodeURIComponent(originUri);

      wxLoginUrl = wxLoginUrl.replace('{redirect_uri}', encodedUrl);

      console.log(originUri, encodedUrl, wxLoginUrl);
      setTimeout(() => {
        // window.location.href = wxLoginUrl;
        console.log('?');
      }, 2500);
    },
  },
};
</script>

<style lang="stylus" scoped>
  .home {
    padding: 15px

  }
</style>
