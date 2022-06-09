(function($){
$('img[data-action="Download"]').each(function(i,t){
    console.log(t);
    $(this).trigger('click')
    alert('Next >>');//Permet d'attendre le download avant de pouvoir passer au média suivant
});
})(jQuery)
