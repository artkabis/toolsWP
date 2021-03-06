

/***** Détecter la première visite et le nombre d'occurrence sans prendre en compte update de la page (F5) afin de personnaliser le message de bienvenue ****/

if(window.location.pathname ==='/'){// Si visite sur la Home page
    var nb = null;//Compteur de visite à null
    setTimeout(testVisite,300);//Appel de la fonction après 300ms
    function testVisite(){
        const reloaded = (performance.getEntriesByType("navigation")[0].type === 'reload')?true:false;//Détection du refresh de la page (si reload alors true)
        console.log('reloaded : ',performance.getEntriesByType("navigation")[0].type);
    	if( !localStorage.getItem('visiteHome')){//Si la valeur en localStorage et le compteur ne sont pas initialisés.
    	    localStorage.setItem('visiteHome', 1);//on redéfinit la valeur de la variable du localStorage avec la variable locale.
            $('#welcomePopup').fadeIn(300);//On affiche le message de bienvenue
    	}else if(Number(localStorage.getItem('visiteHome'))>0 && !reloaded){//si la valeur numérique de visiteHome est supérieure à 0 et qu'update vaut false
    	    nb=Number(localStorage.getItem('visiteHome')) + 1;//nb vaut la valeur dans le localStorage + 1
    	    localStorage.setItem('visiteHome', nb);//on met à jour visiteHome
    		 $('#welcomePopup').fadeOut(0);//Le message de bienvenue n'est plus visible
    	}
    }
}
