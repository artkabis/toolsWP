$(document).ready(function(){

    dmAPI.loadScript('https://cdn.jsdelivr.net/npm/typed.js@2.0.9', function() { 
    // run init code after library loads
    var typed = new Typed('.boite-a-mots', {
        strings: ['Votre prochain système de chauffage sera une pompe à chaleur ?', 'Vous souhaitez installer un ballon thermodynamique ?'],
        typeSpeed: 30,
        backSpeed: 30,
        fadeOut: false,
        loop: true
        });
    });
});
