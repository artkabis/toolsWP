/**** Sauvegarder le volume total d'un calculateur de volume et l'intégrer automatiquement sur un formulaire situé sur une autre page (devis par exmple ***/
//La page comportant le calculateur de volume (qui devra save le volume)
if(location.pathname === '/calculateur-volume/'){
    window.addEventListener("beforeunload", function () {
      ($('#listFurniture').children().length>0) && localStorage.setItem('volume', $('#total').text());//Récupération du volume total, ici la valeur est située dans l'id total
    });
}
//La page "devis" comportant le formulaire de devis (devant récupérer le volume)
if(location.pathname === '/devis/'){
  (localStorage.getItem("volume") !== null) && $('#input_37_16').val(localStorage.getItem('volume'));//Si volume (localStorage) ne vaut pas null on l’implémente à l'input (attention, vous devez chnager l'id)
}





/***** Gravityform : gestion dynamique des conditions logiques en fonction du bouton cliqué (gestion via localStorage ) *****/
/***** Si le lien concerne une demande de visite, alors le formulaire s'adaptera pour la checkbox demande de visite soit cochée ****/
// BTN-UX (desktop & mobile
$('.logo').append('<div class="btn-ux-container"><a class="btn-ux" href="tel:0442188585"><i class="fa fa-phone"></i><p class="txt-btn-ux">Nous appeler <br><span class="second-line">au 04 42 18 85 85</span></p></a><a class="btn-ux" href="/demande-brochure/"><i class="fa fa-paperclip"></i><p class="txt-btn-ux">Demande <br><span class="second-line">de brochure</span></p></a><a id="btnVisite" class="btn-ux" href="/contact/"><i class="fa fa-hand-o-right"></i><p class="txt-btn-ux">Visiter <br><span class="second-line">la résidence</span></p></a></div>');
$('body').prepend('<div class="btn-ux-container-mob"><a class="btn-ux-mob" href="tel:0442188585"><i class="fa fa-phone"></i>Nous appeler <br><span class="second-line">au 04 42 18 85 85</span></a><a id="btnVisite" class="btn-ux-mob" href="/contact/"><i class="fa fa-hand-o-right"></i>Visiter <br><span class="second-line">la résidence</span></a>');


/**** Gestion des conditions logiques du gravityform (formulaire) checkbox automatisé en fonction du lien cliqué : visite ou contact (si visite > formulaire lié à cette catégorie) ***/
if($('a#btnVisite').length >0){
    (localStorage.getItem('form-visite') === null) && localStorage.setItem('form-visite', "0");//si aucun localStorage lié à form-visite valeur par défaut 0 ()
    $('a#btnVisite').children().css('pointer-events','none');//Désactivation des événements click sur les enfants de btnVisite
    //Au click de de btnVisite (après le logo)
    $('a#btnVisite').on('click',function(me){
        localStorage.setItem('form-visite', "1");//on implémente 1 à form-visite du localStorage (alors affichage des éléments du formulaire lié à la demande de visite).
    });
    $('a[id!=btnVisite]').on('click',function(me){
        $(this).attr('href').includes("/contact/") && localStorage.setItem('form-visite', "0");//si navigation vers contact un reste le localStorage form-visite pour un affichage gravityform standard
    });
    
    //Si nous sommes sur la page contact : check de form-visite : 1 formulaire avec champ visite, 0 simple demande de contact
    if(window.location.pathname === '/contact/'){
        /*** Gestion des radios button en fonction des conditions logiques GF ***/
        if(localStorage.getItem('form-visite') === "1"){
            $('#choice_35_12_0').removeAttr('checked');
            $('#choice_35_12_1').trigger('click').attr('checked','checked');
            //0 = pas de demande de visite
        }else if(localStorage.getItem('form-visite') === "0"){
            $('#choice_35_12_1').removeAttr('checked');
            $('#choice_35_12_0').trigger('click').attr('checked','checked');
        }
    }
}