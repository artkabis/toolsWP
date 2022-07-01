
/***** CSS a intégrer avant l'utilisation de ce script 
.products_wrapper.isotope_wrapper {
    display: flex;
    flex-wrap: nowrap;
    margin: 0!important;
    overflow: hidden;
}
ul.products {
    position: relative;
    display: inline-flex;
    flex-wrap: nowrap;
    margin: 0!important;
    transition: left 0.3s

}
.woocommerce.columns-4 ul.products li.product {
    min-width: 250px;
    margin: 0!important;
}
button.leftBtn {
    position: absolute;
    top: 50%;
    left: -50px;
}
button.rightBtn {
    position: absolute;
    top: 50%;
    right: -50px;
}

***/

(function($){
$('.woocommerce').prepend('<button class="leftBtn">&lt;</button>')
$('.woocommerce').append('<button class="rightBtn">&gt;</button>')
    var cmp = 0;
    const isoW = $('.isotope-item ').width();
    console.log('width iso : ',isoW);
    $('.leftBtn, .rightBtn').on('click',function(me){
        //const posX = (!$('.products').css('left')) ? 0 : Number($('.products').css('left').split('px')[0]);
       // console.log('posX',posX);
        console.log('btn clicked : ',$(this).attr('class'));
        if( $(this).attr('class')==="rightBtn" ){
            cmp=cmp+1;
            var posR = Number(-isoW)* cmp
            console.log('right',posR,' iso width : ',$('.isotope-item').width(),'  cmp : ',cmp);
            setTimeout(()=>$('.products').css('left',posR+'px'),50);
        }else if($(this).attr('class')==="leftBtn"){
            cmp=(cmp!=0)?cmp-1:0;
            const posL = -Number(isoW)*cmp
            console.log('left',posL,'cmp : ',cmp);
            setTimeout(()=>$('.products').css('left',posL+'px'),50);
        }
    });
})(jQuery);
