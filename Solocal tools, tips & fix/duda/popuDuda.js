

/** Vous devez créer un contenu bouton (widget), à placer dans une zone du site autre que head et footer. 
Utiliser ensuite le réglage en mode popup tout en ayant créé celui-ci via "créer un nouveau popup. Connectez-le au non du popup précédemment créé. 
Dernière étape, clic droit sur le bouton "modifier HTML/CSS", ajoutez dans le <a> votre nouvelle classe "homePoup" (près de dmButtonLink) **/



//En mode développeur aller site HMT/CSS > body-end.html et placer ceci : 
$( window ).on( "load", function() {
    const dateD = new Date('october 07 2022'); // date du debut d'affichage
    const dateF = new Date('october 29 2022'); // date du fin d'affichage
    const dateJ = new Date(); //date du jour
    if (dateJ >= dateD && dateJ <= dateF && $('.homePoup').length > 0) {
        // trigger sur btnPopup pour l'ouvrir
        setTimeout(function() {
            $('.homePoup').click().css('display','none');
        }, 500);
    }
});
