/****** Bullet de navigation : correction de l'affichage des images en background qui se retrouvent pixélisées si la taille est augmentée ***/
//Id du slider revolution à adapter en fonction du vôtre.
$('#rev_slider_2_1').one('revolution.slide.onloaded', function() {
    $('.tp-bullet-image').each(function(i,t){
        const urlImg = $(this).css('background-image').replace(/\d{3}x\d{2}/,'');//replace du format (100x50) si 100x00 utiliser : /\d{3}x\d{3}/
        const lastDash = urlImg.lastIndexOf('-');
        const lastUrl = urlImg.slice(0,lastDash)+"."+urlImg.split('.').slice(-1);
        $(this).css('background-image',lastUrl);
    });
});
