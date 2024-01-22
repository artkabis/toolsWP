


/***
** Utilisation des légendes des images de la bibliothèque de médias dans l'affichage final de lightbox rattaché à Owl-slider (dans la partie title de celle-ci)
**
***/

$ = jQuery
const pagesId = '.page-id-438, .page-id-439';//les id des pages comportant les owl-sliders
($(pagesId)) && (() => {
        $('body').on('click','.owl-stage .owl-item a', function (me) {
            const capt = $(this).parent().find('.vc_figure-caption');
            (capt.text().length) && (() => {
                const txt = capt.text();
                const title = txt.split('€')[0] + '€ <br>' + txt.split('€')[1];
                setTimeout(() => $('.mfp-content .mfp-title').html(title), 200);
            })();
        });
    })();

/***
** Gestion d'images en background reliées aux slides de owlSlider.
** Le background s'adapte en fonction des dots et du positionnement de l'url de l'image des tableaux (ici nous avons deux owlSliders donc deux tableaux différents)
** Attention à bien avoir les rows des sliders nommées : "#Slider_0", "#Slider_1", etc. Ceci permettra d'associer le bon tableau d'images : "bgImageTS_0", "bgImageTS_1", etc.
**
***/
$(window).on('load', function () {
        const bgImageTS_0 = ["url(/wp-content/uploads/sites/7840/2019/09/logement.jpg)", "url(/wp-content/uploads/sites/7840/2019/09/impot.jpg)", "url(/wp-content/uploads/sites/7840/2019/09/locatio.jpg", "url(/wp-content/uploads/sites/7840/2019/09/economie.jpg)"];
        const bgImageTS_1 = ["url(/wp-content/uploads/sites/7840/2019/09/impot.jpg)", "url(/wp-content/uploads/sites/7840/2019/09/logement.jpg)", "url(/wp-content/uploads/sites/7840/2019/09/locatio.jpg", "url(/wp-content/uploads/sites/7840/2019/09/economie.jpg)"];
        // Ajout des classes sur les dots du #Slider_0
        $('#Slider_0 .owl-dot').each(function (i, t) {
            $(this).attr('id', "Advantage-dot_" + (i));
        }) 
        
        // Ajout des classes sur les dots du #Slider_0
        $('#Slider_1 .owl-dot').each(function (i, t) {
            $(this).attr('id', "Locality-dot_" + (i));
        }) //each
        
        // Change advantage img
        $('.owl-dot, div[class*="ts-owlslider-controls-"]').on('click', function (me) {
            const idSlider = $(this).closest('div[id*="Slider_"]').attr('id').split('_')[1];
            //console.log("controle ? ", $(this).attr('class').includes('ts-owlslider-controls'), $(this).closest('.ts-vcsc-anyslider').find('.owl-dot.active').attr('id'));
            const id = $(this).attr('class').includes('ts-owlslider-controls') ? $(this).closest('.ts-vcsc-anyslider').find('.owl-dot.active').attr('id').split('_')[1] : Number($(this).context.id.split('_')[1]);
            let selectTabImages = [bgImageTS_0, bgImageTS_1];
            selectTabImages = selectTabImages[idSlider]
        
            $(this).closest('div[id*="Slider_"]').find('.advantage-img').css({ backgroundImage: selectTabImages[id], color: "blue" });
        });
        $('div[id*="Slider_"]').find('.owl-dot:first-child').trigger('click');
});
