import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '/classroom/',
  routes: [
    {
      path: '/404',
      name: '404',
      component: () => import(/* webpackChunkName: "not-found" */ './views/NotFound/NotFound'),
      meta: {
        title: '出错了',
      },
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: () => import(/* webpackChunkName: "recommend" */ './views/Recommend/Recommend.vue'),
      meta: {
        title: '推荐',
      },
    },
    {
      path: '/agreement',
      name: 'agreement',
      component: () => import(/* webpackChunkName: "agreement" */ './views/Agreement/Agreement.vue'),
      meta: {
        title: '有讲课堂用户协议',
      },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
    },
    {
      path: '/article',
      name: 'article',
      component: () => import(/* webpackChunkName: "article" */ './views/ArticleMain.vue'),
    },
    {
      path: '/category',
      name: 'category',
      component: () => import(/* webpackChunkName: "category" */ './views/Category/Category.vue'),
      meta: {
        title: '分类',
      },
    },
    {
      path: '/user',
      name: 'user',
      component: () => import(/* webpackChunkName: "user" */ './views/User/User.vue'),
      meta: {
        title: '个人主页',
      },
    },
    {
      path: '/content',
      name: 'content',
      component: () => import(/* webpackChunkName: "content" */ './views/ContentDetail/ContentDetail.vue'),
      meta: {
        title: '详情',
      },
    },
    {
      path: '/content/:id',
      name: 'content-id',
      component: () => import(/* webpackChunkName: "content" */ './views/ContentDetail/ContentDetail.vue'),
      meta: {
        title: '详情',
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      meta: {
        title: '关于我们',
      },
    },
    {
      path: '/topic',
      name: 'topic',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "topic" */ './views/Topic/Topic.vue'),
      meta: {
        title: '专题',
      },
    },
    {
      path: '/discuss',
      name: 'discuss',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "discuss" */ './views/Discuss/Discuss.vue'),
      meta: {
        title: '话题',
      },
    },
    {
      path: '/download',
      name: 'download',
      component: () => import(/* webpackChunkName: "download" */ './views/Download/Download.vue'),
      meta: {
        title: '下载有讲课堂',
      },
    },
    {
      path: '/fans',
      name: 'fans',
      component: () => import(/* webpackChunkName: "fans" */ './views/Fans/Fans.vue'),
      meta: {
        title: 'Ta的粉丝',
      },
    },
    {
      path: '/follow',
      name: 'follow',
      component: () => import(/* webpackChunkName: "attention" */ './views/Attention/Attention.vue'),
      meta: {
        title: 'Ta的关注',
      },
    },
    {
      path: '/explain',
      name: 'explain',
      component: () => import(/* webpackChunkName: "explain" */ './views/Explain/Explain.vue'),
      meta: {
        title: '规则说明',
      },
    },
    {
      path: '/distribut-instructions',
      name: 'distribut-instructions',
      component: () => import(/* webpackChunkName: "distribut-instructions" */ './views/DistributInstructions/DistributInstructions.vue'),
      meta: {
        title: '推广须知',
      },
    },
    {
      path: '/',
      redirect: '/recommend',
    },
    { path: '*', redirect: '/404' },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login/Login.vue'),
      meta: {
        title: '登录',
      },
    },
    {
      path: '/invite',
      name: 'invite',
      component: () => import(/* webpackChunkName: "invite" */ './views/InviteNew/InviteNew.vue'),
      meta: {
        title: '送你有讲课堂优惠券',
      },
    },
    {
      path: '/lottery',
      name: 'lottery',
      component: () => import(/* webpackChunkName: "lottery" */ './views/Lottery/Lottery.vue'),
      meta: {
        title: '幸运抽奖',
      },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});
