/***** Gestion du formulaire, en fonction du paramètre passé dans l'url (bouton en page formation) l'option du select sera modifiée et donc enverra une confirmation personnalisée en fonction de la formation ciblée 

Exemple de déploiement : https://ingetelbet202209131530.site-privilege.pagesjaunes.fr/formation/plaquettes-formations?formation=EFIT03
****/

/***** Gestion du formulaire, en fonction du paramètre passé dans l'url (bouton en page formation) l'option du select sera modifiée et donc enverra une confirmation personnalisée en fonction de la formation ciblée ***/
const pageFormFormation = "/formation/plaquettes-formations";
const path = window.location.pathname;

if(path.includes(pageFormFormation)){
    const paramFormation = window.location.search.split('=')[1].toLowerCase();
    ($('#input_47_1').length>0) && (()=>{
        $('#input_47_1 option').each(function(t,i){
            const valOption = $(this).val().toLowerCase();
            (valOption.includes(paramFormation)) && $(this).attr('selected','selected');
            
        });
    })();
}





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


/******************************************************************************************************************************************************************/
/******************************************************************************************************************************************************************/




/***** Gravityform : gestion dynamique des conditions logiques en fonction du bouton cliqué (gestion via localStorage ) *****/
/***** Si le lien concerne une demande de visite, alors le formulaire s'adaptera pour la checkbox demande de visite soit cochée ****/
// BTN-UX (desktop & mobile
$('.logo').append('<div class="btn-ux-container"><a class="btn-ux" href="tel:0442188585"><i class="fa fa-phone"></i><p class="txt-btn-ux">Nous appeler <br><span class="second-line">au 04 42 18 85 85</span></p></a><a class="btn-ux" href="/demande-brochure/"><i class="fa fa-paperclip"></i><p class="txt-btn-ux">Demande <br><span class="second-line">de brochure</span></p></a><a id="btnVisite" class="btn-ux" href="/contact/"><i class="fa fa-hand-o-right"></i><p class="txt-btn-ux">Visiter <br><span class="second-line">la résidence</span></p></a></div>');
$('body').prepend('<div class="btn-ux-container-mob"><a class="btn-ux-mob" href="tel:0442188585"><i class="fa fa-phone"></i>Nous appeler <br><span class="second-line">au 04 42 18 85 85</span></a><a id="btnVisite" class="btn-ux-mob" href="/contact/"><i class="fa fa-hand-o-right"></i>Visiter <br><span class="second-line">la résidence</span></a>');


/******************************************************************************************************************************************************************/
/******************************************************************************************************************************************************************/



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

/******************************************************************************************************************************************************************/
/******************************************************************************************************************************************************************/


/******************** Debug lien politique de vie privée GravityForms (vous devez modifier l'id comportant votre lien) ***/
    if( $('#label_39_5_1 a').attr('href') !== '/protection-de-la-vie-privee/'){
    $('#label_39_5_1 a').remove();
    $('#label_39_5_1').append('<a href="/protection-de-la-vie-privee/" target="_blan" rel="noopener noreferrer">politique de protection de la vie privée du site</a>');
}

/******************************************************************************************************************************************************************/
/******************************************************************************************************************************************************************/




/********************** Woocommerce : détection des prix valant 0 € ajout d'un bouton demande de devis dans le shop et sauvegarde du titre du produit dans le Gravityforms *****************************/
var t,tt,title;
if(window.location.href.indexOf("/shop/") === -1){
    $('.woocommerce-Price-amount').each(function(i,t){
        t = $(this);
        tt =t.text();
        if($(this).text().includes('0,00')){
            title = $(this).parents('.isotope-item').find('.desc a').text();
            $(this).find('.image_frame a').on('click',function(me){
                localStorage.setItem('produit', title);
            });
            $(this).closest('.product_tag-prix').append('<div class="infoPrice"> <i class="ts-awesome-phone-square"></i>Demander votre Devi</div>');
            $(this).closest('.price').remove();
        }
    });
}

if(window.location.href.indexOf("/shop/") > -1 && $('.summary .price .amount').text().includes('0,00')){
    localStorage.setItem('produit', $('.product_title').text());
    $('.product_title').after('<div class="btn-rs"><a class="my-btn" href="/devis/"><i class="ts-awesome-phone-square"></i>Demander votre Devis</a></div>');
    $('.summary .price').remove();
}
(location.pathname === '/devis/' && localStorage.getItem("produit") !== null) && $('#input_38_14').val(localStorage.getItem('produit'));

/******************************************************************************************************************************************************************/
/******************************************************************************************************************************************************************/







/******************** Gravityforms Blocage des mails en fonction du numéro de téléphone, si le numéro est au format valide français le mail est envoyé, sinon une redirection est faite sur la page d'accueil ********************/
if($('.gform_wrapper').find('.gform_button[type="submit"]')){
    var phone,$form=$('.gform_wrapper'), btn =  $form.find('.gform_button[type="submit"]'), saveFuncClick = btn.attr('onclick'), saveFuncKeyP =  btn.attr('onkeypress');
    btn.attr('onkeypress':'','onclick':''));
    /***** Bloquer un seul numéro lors de l'envoi du formulaire ***************/
    if(window.location.pathname === '/contact/'){
        var phone,$form=$('.gform_wrapper');
        var btn =  $form.find('.gform_button[type="submit"]');
        var saveFuncClick = btn.attr('onclick');
        var saveFuncKeyP =  btn.attr('onkeypress');
        btn.attr('onkeypress','');
        btn.attr('onclick','');
        $('.ginput_container_phone input').on('input',function(){
            phone = String($(this).val());
            firstN = phone.replace(/\D/g, ""); 

            //Blocage d'un numéro spécifique >>
            (phone.includes('555-555-1212') || phone.includes('555 555 1212') ) ? btn.on('click',function(){window.location.pathname="/";}) : btn.attr({'onkeypress':saveFuncKeyP,'onclick',saveFuncClick);

            //Vérification de la validité du format de numéro téléphone indiqué >>
            (phone.length === 10 && firstN[0] === '0' && !phone.includes('-')|| phone.length === 13 && !phone.includes('-') && phone.includes('+33') ) ? btn.attr('onkeypress':saveFuncKeyP,'onclick':saveFuncClick,'type':'submit') : btn.attr('onkeypress':'','onclick':'','type':'button').on('click',function(){window.location.pathname="/"});                                                                                                                                    
        });
    }
}
/******************************************************************************************************************************************************************/
/******************************************************************************************************************************************************************/




/***** Correctif pour les formulaires à plusieurs pages (étapes), si seul le recaptcha n'est pas validé, une erreur empêche de reprendre l'édition du gform ****/
(function($){
    const NAME_PAGE = 'simulation-en-ligne';
    const GFORM_ID = '#gform_38';
    //Test de l'url de la page liée au formulaire
    if(window.location.pathname.includes(NAME_PAGE)){
        // Vérication du message d'erreur dans le last .validation_error rattaché au formulaire
        const isVal = $(GFORM_ID+' .validation_error').last().text().includes('Une erreur s’est produite lors de votre envoi. Les erreurs ont été mises en surbrillance plus bas.');  
        isVal && $('.gform_page').last().css('display','');//Reset du display none lié à la dernière page (celle comportant le REcaptcha)
    }
})(jQuery)
/******************************************************************************************************************************************************************/
/******************************************************************************************************************************************************************/





/*** Gestion des forumaires Gravityform avec routage d'emails - ceux-ci ne sont plus pris en charge par SLM ****/
/**** Gestionnaire de formulaire avec gestion des agences en routage - condition logique avec plusieurs mails d'envois (pour corriger le non-envoi des notifications vers le SLM du client) ****/
if($('.pj-quote-gravityform').length >2){
    const allForms = $('#cannes,#frejus,#carros,#versailles');//Tous les forms
    allForms.fadeOut(0);//On cache tous les forms
    function open($name,$pos){
    $($name).fadeIn(300);//Affichage du form en fonction de l'id cliqué
    //pos 1 : première option selected, pos 2 : le second (on choisit le bon selected et on le verrouille)

    //Attention si vous avez plusieurs select dans vos formulaires, veuillez indiquer une classe pour le select ayant les villes (depuis GF), exemple ici : selectCity
    ($pos===1) ? $($name+' .gform_body .selectCity .select option:first-child').attr('selected','selected').parent().css('pointer-events','none') : $($name+' .gform_body .selectCity select option:last-child').attr('selected','selected').parent().css('pointer-events','none');
    }
     //On écoute les boutons rattachés à openForm qui les contient
     $('.openForm a').on('click',function(){
        allForms.fadeOut(0);//Au click on cache l'ensemble des forms
        const name = $(this).attr('href');//on garde en mémoire les href (qui sont liés à l'id des row de chaque form)
        switch(name){
            case "#carros" ://carros étant dans le même form mais avec le 2eme selected 
                open('#cannes',2);
            break
            case "#cannes" :
                open('#cannes',1);
            break
            case "#versailles" :
                open('#versailles',1);
            break
            case "#issy-les-moulineaux" ://issy-les-moulineaux étant dans le même form que Versailles on utilise la seconde option mais avec le 2eme selected 
                open('#versailles',2);
            break
            default :
                open(name);
        }
    });
}



/**** Gestion des erreurs et de la progress bar négative
Ajout du titre dans les textes de progression
Gestion des retours arrière après erreur sur dernière page
 ***/
    const NAME_PAGE = 'simulation-rachat-credit';//Pathname de la page
    const GFORM_ID = '#gform_34';//ID du Gravity Form
    //Test de l'url de la page liée au formulaire
    if(window.location.pathname.includes(NAME_PAGE)){
        var maxStep = Number($('.gf_progressbar_title').text().split(' ')[3]);//Nombre maximum d'étapes
        var targetStep = Number($('.gf_progressbar_title').text().split(' ')[1]);//Numéro de l'étape en cours
        const title = $('#gform_page_'+GFORM_ID.split('_')[1]+'_'+targetStep+' .gsection_title').text();//Titre de l'étape
        $('.gf_progressbar_title').text($('.gf_progressbar_title').text()+' : '+title);//Ajout du titre
        // Vérification du message d'erreur dans le last .validation_error rattaché au formulaire
        const isVal = $(GFORM_ID+' .validation_error').last().text().includes('Une erreur s’est produite lors de votre envoi. Les erreurs ont été mises en surbrillance plus bas.');    
        (isVal && targetStep === maxStep) $('.gform_page').last().css('display','');//Reset du display none lié à la dernière page (celle comportant le REcaptcha)
        //Si une erreur est détectée à la dernière étape
        if(( isVal &&  targetStep === maxStep)){
            $('#gform_page_'+GFORM_ID.split('_')[1]+'_'+maxStep).css('display','block');//On affiche le contenu de la dernière étape
            $('.gf_progressbar_title').text('Etape '+ maxStep +' de '+maxStep+' : '+ $('#gform_page_34_'+maxStep+' .gsection_title').text());//Recontruction du texte de la progressbar avec titre de l'étape
            $('.gf_progressbar_percentage span').text('100%');
        } 
    }
