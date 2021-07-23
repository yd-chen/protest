$('.shopBtn').click(function(e) {
    e.preventDefault();
    _hmt.push(['_trackEvent', 'to shop', 'link']);
    window.location.href = './../shop.html';
});

$('.shareBtn').click(function(e) {
    e.preventDefault();
    $('.sMask').fadeIn();;
    _hmt.push(['_trackEvent', 'share card', 'click']);
});

$('.close').click(function(e) {
    e.preventDefault();
    $('.mask').fadeOut();;
});

$('.m-header-SP').addClass('is-show')

$('.p-result-main__card_img').click(function() {
    $('.cMask').fadeIn();
    _hmt.push(['_trackEvent', 'save card', 'click']);
})

$('.testAgain').on('touchstart', function() {
    _hmt.push(['_trackEvent', 'test again', 'click']);
})

$('.p-result-main__card_img').append('<p class="lookCard">点击查看塔罗牌</p>');

// setTimeout(function() {
//     $('.upImg').fadeOut()
// }, 5000)