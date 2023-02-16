(function($){
const items = $('.Website-search > .third-block');
let tableauAnnonceurs=[]
items.each(function(i,t){
    const enseigne = $(this).find('.company-name').text();
    const site_url = $(this).find('a').attr('href');
    const epj = $(this).find('.client-code').text().split(' : ')[1]
    const url = new URL(site_url).href;
    console.log(url);
    if(epj!== undefined){
        tableauAnnonceurs.push({enseigne:enseigne,site_url:new URL(site_url).href,'epj':Number(epj)});
    }
});
    const cleanArray = tableauAnnonceurs.filter(Boolean)
    console.table(cleanArray);
})(jQuery)

