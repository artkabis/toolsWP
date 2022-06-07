/**** Sauvegarder le volume total d'un calculateur de volume et l'intégrer automatiquement sur un formulaire situé sur une autre page (devis par exmple ***/
//La page comportant le calculateur de volume (qui devra save le volume)
if(location.pathname === '/calculateur-volume/'){
    window.addEventListener("beforeunload", function () {
      ($('#listFurniture').children().length>0) && localStorage.setItem('volume', $('#total').text());//Récupération du volume total, ici la valeur est située dans l'id total
    });
}
//La page "devis" comportant le formulaire de devis (devant récupérer le volume)
if(location.pathname === '/devis/'){
  (localStorage.getItem("volume") !== null) && $('#input_37_16').val(localStorage.getItem('volume'));//Si volume (localStorage) ne vaut pas null on l’implémente à l'input (attention, vous devez chnager l'id)
}
