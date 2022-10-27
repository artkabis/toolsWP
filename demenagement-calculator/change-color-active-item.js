(window.location.pathname.includes('calculateur-volume')) &&(()=>{
    console.log('page calculateur !!! ');
    $('body').on('click','.more, .less',function(me){
        console.log('btn : ',$(this).attr('class'));
        const qty = $(this).parent().find('span[id*="categoryQuantity_"]');
        console.log('qty : ',Number(qty.text()));
        (Number(qty.text())>0) ? qty.css('color','#df0310') : qty.css('color','#000');
    });
})();
