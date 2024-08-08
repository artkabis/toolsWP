$=jQuery;
const stylesWarning = {backgroundColor:'#FF0000',padding: '50px'}
const checkCookyFalse = () => {
    $('.dmNewParagraph').each(function(i,t){
        const txt = $(this).text()
        if(txt.includes(`Attention il est indispensable d'accepter les cookies`)){
            $(this).css(stylesWarning)
        }
    });
}
window.location.pathname.includes('checkout/payment') && checkCookyFalse();

/***
Il serait peut-être possible d'ajouter un élément pointant vers le CTA de consentement afin de guider l'utilisateur sur la démarche d'acceptation des cookies


.dm_wrapper:before {
    content: '<=';
    position: fixed;
    bottom: 8vh;
    left: 6vw;
    transform: rotate(-29deg);
    z-index: 10;
}

Site exemple : https://www.secrets-dabeilles.fr/boutique/checkout/payment
***/
