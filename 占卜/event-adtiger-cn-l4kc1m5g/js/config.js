var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?e29b90da35309519f9e3970b5521072d";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();


var utm = GetQueryString('utm');

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}

if (window.location.href.indexOf('shop') == -1 && window.location.href.indexOf('result') == -1) {
    localStorage.setItem('utm', utm);
}

let storageData = localStorage.getItem('utm');

console.log(storageData)

var httpRequest = new XMLHttpRequest();
httpRequest.open('POST', 'https://event.adtiger.cn/agete/2019/xmas/api/shareConfig.php', true);
httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
console.log(encodeURIComponent(window.location.href))
httpRequest.send('url=' + encodeURIComponent(window.location.href));

httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (data.error == 0) {
            wx.config({
                debug: false,
                appId: data.data.appid,
                timestamp: data.data.timestamp,
                nonceStr: data.data.noncestr,
                signature: data.data.signature,
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
            });
            wx.ready(function() {

                wx.onMenuShareTimeline({
                    title: "想要遇见更加闪耀的自己?借助塔罗牌的力量，让自己的魅力焕然一新。", // 分享标题
                    link: 'https://event.adtiger.cn/agete/2019/xmas/?utm=' + storageData, // 分享链接
                    imgUrl: "https://event.adtiger.cn/agete/2019/xmas/img/w.jpg", // 分享图标
                    success: function() {},
                    cancel: function() {}
                });
                wx.onMenuShareAppMessage({
                    title: "agete——Enjoy Change", // 分享标题
                    desc: "想要遇见更加闪耀的自己?借助塔罗牌的力量，让自己的魅力焕然一新。", // 分享描述
                    link: 'https://event.adtiger.cn/agete/2019/xmas/?utm=' + storageData, // 分享链接
                    imgUrl: "https://event.adtiger.cn/agete/2019/xmas/img/w.jpg",
                    type: '',
                    dataUrl: '',
                    success: function() {},
                    cancel: function() {}
                });
            })
        } else {
            alert('分享错误')
        }
    }
};