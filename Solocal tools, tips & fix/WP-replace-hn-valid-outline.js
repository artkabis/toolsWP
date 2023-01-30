

const hnProlive = 'h5';//Vérifiez quel type de Hn a été choisi (H4,H5, etc)


//Au chargement de la page, le Hn sera replacé par un "span" ayant la classe "title". Attention, vous devrez peut-être modifier la couleur du texte.
$(window).load(function() {
    $(`.pj-prolive-content ${hnProlive}`).replaceWith(function () { return `<span class="${$(this).attr('class')}">${$(this).html()}</span>`});
});
