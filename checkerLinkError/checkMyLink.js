(function($){
 $('head').append('<style>.success{position:relative}.success:before{position:absolute;content:"Lien valide";background:green;color:white;bottom:-125%;left:0;padding:0 5px;}.error{position:relative;}.error:before{position:absolute;content:"Erreur";left:0;bottom:-125%;background:red;color:white;padding:0 5px;}.error404:before{content:"Erreur 404"}.error418:before{content:"Erreur 418"}.error503:before{content:"Erreur 503"}</style>');
 const links = $('a[href^="/events"]');//Liens à vérifier (ici les events)
//On boucle sur l'ensemnle des liens pour qu'ils soient par la suite vérifiés un-à-un.
    links.each(function () {
        var $this;
        $this = $(this); //save de la référence du lien
        $.ajax({
            url:$(this).attr('href'), //l'url checké est celle du href
            success: function () { //ajout de la classe success si la requête est valide
                $this.addClass('success');
            },
            error: function (jqXHR, status, er) {
                $this.addClass('error');//Ajour de la classe error par défaut
                //On vérifie le status et détermine quelle erreur est renvoyée
                switch (jqXHR.status) {   
                    case 404:
                    $this.addClass('error404');//Ajour de la classe error404 (si erreur 404)
                  break;
                    case 418 : 
                    $this.addClass('error418');//Ajour de la classe error418
                  break;
                         case 503 : 
                    $this.addClass('error503');//Ajour de la classe error503
                  break;
                }
            }
        });
    });
})(jQuery);
