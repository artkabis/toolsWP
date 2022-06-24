
/********************************* -------- Gestion zoom scroll de la carte Mappy  (-------------------------- >>
***/
//on active l'événement pointer-events au click de la map
$(".vc_mappy-map").parent().click(function () {$(".vc_mappy-map, .leaflet-control").css("pointer-events", "auto")});
// on désactive l'évenemtn pointer-events lorsque la souris quitte la zone de la map
$( ".vc_mappy-map" ).parent().mouseleave(function() {$(".vc_mappy-map, .leaflet-control").css("pointer-events", "none")});
$( ".vc_mappy-map" ).parent().trigger('mouseleave');



//Version avec affichage du message pour l'activation du zoom
/*****************************************************    Gestion scroll zoom Mappy avancé avec texte caché **********************************************/
//Version complète --> Ajout d'un bloc before avec message et activation des interactions au clic

/*********** add mappy message and toogle scroll activation*****************/
$('.vc_mappy-map').parent().addClass('lacarte');
$('.wpb_wrapper').on('click',function(){$('.vc_mappy-map').css('pointer-events','auto');$('.wpb_wrapper .lacarte').removeClass('lacarte');});
$('.vc_mappy-map').parent().on('mouseleave',function(){$('.vc_mappy-map').css('pointer-events','none');$('.vc_mappy-map').parent().addClass('lacarte');});
$('.vc_mappy-map').parent().trigger('mouseleave');
/************ End Add Mappy message ************/
</script>
/*
Style css pour la création du after laCarte permettant d'afficher le message et de bloquer les interactions au scroll -->.
<style>
.lacarte:after {
    content: 'Cliquer pour activer la carte';
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 50%;
    font-size: 1.75em;
    font-weight: 400;
    line-height: 1.3em;
    z-index: 30000;
    text-align: center;
    color: white;
    text-shadow: 0 0 4px black;
    filter: drop-shadow(0 0 3px black);
    opacity: 0;
    transition: .25s ease-in-out all;
    transform: translate(-50%,-50%);
    cursor: pointer;
}
.lacarte:hover:before,.lacarte:hover:after{opacity:1}
.vc_mappy-map{max-height:60vh}
.leaflet-container:before {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    content: '';
    background: #eb0423;
    z-index: 2;
    mix-blend-mode: hue;
    pointer-events: none;
}
</style>
***/
