javascript:(()=>{
    (function($){
        $('.table thead tr[role="row"] th:first-child').html('<button class="copyInfos">Copy infos</button>');
        $('.copyInfos').on('click',function(me){
            const brique = $('.table tbody > tr td:nth-child(7)').text();
            const qualif = $('.table tbody > tr td:nth-child(9)').text();
            navigator.clipboard.writeText(`${brique} / ${qualif}`);
            alert('Élément copié !!!');
        });
        
        })(jQuery);
})();
