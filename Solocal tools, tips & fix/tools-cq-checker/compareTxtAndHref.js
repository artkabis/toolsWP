javascript:(()=>{
    (function($) {
        let infosLinks = [];
        $('#Content a, #site_content a').each(function(i, t) {
            const href = $(this).attr('href');
            const txt = $(this)[0].textContent;
            console.log(href);
            const isAncor = href ? href.includes('#') : false;
            const linkId = `link-${i + 1}`;
            infosLinks.push({
                linkId: linkId,
                href:href,
                'text link :  ': txt,
                'is ancor': isAncor
            })
        });
        console.table(infosLinks);
    }
    )(jQuery)
})()
