
//Fix du bug lié au calcul de la largeur du conteneur des images -> sur la version "Freewall fluid Grid" la largeur comprend un item de plus.


//Vérification de l'existance de la galerie
($('.ts-lightbox-freewall-item')) &&((e)=>{
  //On réapplique le bon calcul pour la largeur du conteneur, soit : first-item width * nombre d'item (length). On applique une marge auto pour recentrer le bloc. 
    $('.ts-lightbox-freewall-grid-container').width($('.ts-lightbox-freewall-item').first().width()*$('.ts-lightbox-freewall-item').length).css('margin','0 auto');
})();
