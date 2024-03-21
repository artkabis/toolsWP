let src_fix = [];
$('img').each(function (i, t) {
    let src = $(this).attr('src');
    src = src.includes('?') ? src.split('?')[0] : src;
    (src !== undefined && src.length > 4 && src.at(0) == '/' && src.includes('.jpg')) && src_fix.push(window.location.origin + src);
});
let bgImages;
$('.vc_row').each(function(i,t){
    let bg = $(this)?.css('background');
    let bgImg = $(this)?.css('background-image');
    if(bg && bg.includes('url')){
        console.log('bg split : ', bg);
       bg = bg?.split('url(')[1].split(')')[0].replaceAll('"','');;
       bg = bg.includes('?') ? bg.split('?')[0] : bg;
        src_fix.push(bg);
    }else if(bgImg && !bgImg.includes('none')){
        bgImg = bgImg?.split('url(')[1].split(')')[0].replaceAll('"','');
        bgImg = bgImg.includes('?') ? bgImg.split('?')[0] : bgImg;
        console.log('else if bgImg : ',bgImg);
         src_fix.push(bg);
    }

})
//console.log(src_fix, src_fix.length);
src_fix.forEach((t, i) => {
    $('body').prepend(`<a class="jpg_link" href="${t}" download>${t}</a>`);
    $('a.jpg_link').css('display', 'none');
})

/*---------- DOWNLOAD JPG FILES ----------*/
document.querySelectorAll(".jpg_link").forEach(function (t, i) {
    setTimeout(function () {
        console.log( i+1 + '/' + src_fix.length);
         t.click();
    }, 1000 * i);
});
