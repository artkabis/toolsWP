//Fonction permettant d'écouter la mise en place d'un élément dans le DOM et de lancer une fonction 
const onDomElementIsReady = (elementToWatch)=> {
        return new Promise((res, rej)=> {
          let idInterval = setInterval(()=> {
            if($(elementToWatch).length > 0) {
              clearInterval(idInterval); //suppression de l'interval
              res($(elementToWatch)); //resolution de promise (une fois la pile d'événements terminée)            
            }
          },100);
        });
      };

//Fix H4 news
$(function() {//ready dom function
    if(window.location.pathname.includes('/actualites/')){
        onDomElementIsReady('.vc_grid h4').then(el =>{
           $('.vc_grid h4').each(function(i,t){
                $(this).replaceWith(`<span style="font-size:1.2em;margin-top:10px">${t.innerText}</span>`);
           });
        });
    }
});
