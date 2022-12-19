$(document).ready(function(){
    ($('body[data-role="editorBody"]').length === 0) &&(()=>{
        console.log('not editor')
        // REMPLACEMENT DES BALISES H3 PAR SPAN DANS LES WIDGETS GALERIES PHOTO
        $("h3.caption-title").each(function(){$(this).replaceWith('<span class="caption-title">' + $(this).text() + '</span>');});
        // REMPLACEMENT DES BALISES H3 PAR SPAN DANS LES WIDGETS SLIDE TITLE
        $("h3.slide-title").each(function(){$(this).replaceWith('<span class="slide-title">' + $(this).text() + '</span>');});
        // REMPLACEMENT DES BALISES H3 PAR SPAN DANS LE WIDGETS FORMULAIRE
        $("h3.dmform-title.dmwidget-title").each(function(){$(this).replaceWith('<span class="h3.dmform-title.dmwidget-title">' + $(this).text() + '</span>');});
    })();
});
