


/***
** Utilisation des légendes des images de la bibliothèque de médias dans l'affichage final de lightbox rattaché à Owl-slider (dans la partie title de celle-ci)
**
***/
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
