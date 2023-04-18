javascript:(($)=>{
    $('img').each(function(i,t){
        const href = $(this).attr('href') === 0 || $(this).attr('href') !== null;
        const alt = href ? $(this).attr('alt') : 'NO ALT';
        ($(this).attr('data-src')) && $(this).attr('src',$(this).attr('data-src'));
        (alt)?console.log(alt,this) : console.error('NO ALT >>> ',this);
    });
})(jQuery);
