/* eslint-disable */
// 获取内容详情
export const requestContentDetail = (id, ticket) => {
  const params = {
    content_id: id,
  };
  if (ticket) {
    params.ticket = ticket;
  }
  return axios.get('/api/content/detail_v3_0', {
    params,
  });
};

// 获取内容评论v3.0
export const requestComments = (id, comment_type = 0, offset = 0, limit = 10) => axios.get('/api/content/comment/get_comment_v3_0', {
  params: {
    content_id: id,
    comment_type,
    limit,
    offset
  },
}).then(res => Promise.resolve(res.data));

// 获取内容评论v3.1
export const requestComments_v3_1 = (object_type = 77, object_id, reply_limit = 3, offset = 0, limit = 10) => axios.get('/api/content/comment/get_comment_v3_1', {
  params: {
    object_type,
    object_id,
    reply_limit,
    limit,
    offset
  },
}).then(res => Promise.resolve(res.data));

// 获取详情页内容推荐
export const requestDetailRecommend = (content_id, offset = 0, limit = 10) => axios.get('/api/content/detail_recommend', {
  params: {
    content_id,
    limit,
    offset,
  },
});

// 获取详情页内容推荐-test
export const requestContentRecommend = (offset = 0, limit = 10) => axios.get('/api/content/recommend_content', {
  params: {
    limit,
    offset,
  },
});

// 获取推荐页列表
export const requestRecommend = (content_id = 0, is_newer = 1, limit = 10) => axios.get('/api/content/recommend_query', {
  params: {
    content_id,
    is_newer,
    limit,
  },
}).then(res => Promise.resolve(res.data));

// 个人主页个人信息获取
export const requestUserInfo = user_id => axios.get('/api/content/personal/info', {
  params: {
    user_id,
  },
}).then(res => Promise.resolve(res.data));

// 个人发布内容列表
export const requestUserContents = (user_id, offset = 0, limit = 10) => axios.get('/api/content/personal/query_contents_v3_0', {
  params: {
    user_id,
    offset,
    limit,
  },
}).then(res => Promise.resolve(res.data));

// 分类页列表
export const requesttopicInfo = (label_id, offset = 0, limit = 10) => axios.get('/api/content/content_type_v3_0', {
  params: {
    label_id,
    offset,
    limit,
  },
});

// 专题页详情
export const requestTopicDetail = topic_id => axios.get('/api/content/topic/query', {
  params: {
    topic_id,
  },
});

// 专题内容列表
export const requestTopicConetnts = (topic_id, offset = 0, limit = 10) => axios.get('/api/content/topic/query_content_v3_0', {
  params: {
    topic_id,
    offset,
    limit,
  },
});

// 关注列表
export const requestPersonalFollow = (user_id, offset = 0, limit = 10) => axios.get('/api/content/personal/my_follow', {
  params: {
    user_id,
    offset,
    limit,
  },
}).then(res => Promise.resolve(res.data));

// 粉丝列表
export const requestPersonalFans = (user_id, offset = 0, limit = 10) => axios.get('/api/content/personal/my_fans', {
  params: {
    user_id,
    offset,
    limit,
  },
}).then(res => Promise.resolve(res.data));

// 用户的个人课程列表
export const requestPersonalLesson = (user_id, offset = 0, limit = 10) => axios.get('/api/content/personal/query_lesson', {
  params: {
    user_id,
    offset,
    limit,
  },
}).then(res => Promise.resolve(res.data));

// 获取验证码
export const requestVerifyCode = phone => axios.get('/api/user/send_verify_code', {
  params: {
    phone,
  },
}).then(res => Promise.resolve(res));

// 验证码登录
export const verifyCodeLogin = (phone, verify_code, save_login = 1, mode = 'code-login') => axios.post('/api/user/login', {
  phone,
  save_login,
  mode,
  verify_code,
}).then(res => Promise.resolve(res));

// 检验登录
export const checkLogin = () => axios.get('/api/user/check_login').then(res => Promise.resolve(res));

// 获取用户信息
export const getUserSummaryForId = id => axios.get('/api/user/summary', {
  params: {
    id,
  },
}).then(res => Promise.resolve(res));

// 邀请下载
export const inviteBindPhone = (phone, ticket) => axios.post('/api/content/invite/bind_phone', {
  phone,
  ticket,
}).then((res) => {
  Promise.resolve(res);
});

// 国庆活动邀请下载
export const inviteActivityBindPhone = (phone, ticket) => axios.post('/api/activity/20191001/invite', {
  phone,
  ticket,
}).then((res) => {
  console.log('国庆活动邀请下载', res);
  return new Promise((resolve, reject) => {
    if (res.success) resolve(res);
    else reject(res);
  });
});

// 获取分享页面
export const getWxShareOptions = scene => axios.post('/api/wekuo_app/wx_share_options', {
  scene,
}).then(res => Promise.resolve(res));


// 获取分享页面
export const getDiscussDetail = discuss_id => axios.get('/api/content/discuss_detail', {
  params: {
    discuss_id,
  },
}).then(res => Promise.resolve(res.data));

// this.$axios.get('/api/user/check_login').then((res) => {
//   console.log(res.data);
//   // const resData = res.data;
//   // if (!resData.result) {
//   // const phone = 13631304072;
//   // this.phoneLogin(phone);
//   // }
// });

// 我的金币
export const getMyCoin = () => axios.get('/api/content/coin/my_coin').then(res => Promise.resolve(res.data));

// 抽奖请求
export const drawCoinLottery = () => axios.get('/api/content/coin_lottery/draw').then(res => Promise.resolve(res.data));

