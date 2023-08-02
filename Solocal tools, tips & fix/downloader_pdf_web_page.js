(($)=>{
    $('a').each(function(i,t){
        let url = $(this).attr('href');
        let url_fix = (url !== undefined && url.length >4 && url.at(0)=='/' && url.includes('.pdf')) && window.location.origin + url;
        (url_fix) && console.log(url_fix);
        (url_fix) && $('body').prepend(`<a class="pdf_link" href="${url_fix}" download>${url_fix}</a>`)
    });
    document.querySelectorAll(".pdf_link").forEach(function (t, i) {
        if(i<=10){
              setTimeout(function () {
                t.click();
              }, 1000 * i);
        }
    });    
})(jQuery)
