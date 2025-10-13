/******
Consignes : 

 - Avoir un row avec le module Prolive à l'intérieur et possèdant la classe : "rowProlive"
 - Avoir une seconde row qui possède la classe : "rowNewProlive"


 Explication : 
Nous écoutons l'ajout des "accordion-item" depuis le DOM via l'api MutationObserver" qui nous permet d'être certain que tous les éléments ont bien été chargés.
Nous devons dérouler chaque actu via un click  (puisque seul le contenu de la première actu est présente).
Une fois l'ensemble du contenu récupéré, nous recréons des colonnes comportant chaque actu dans la row "rowNewProlive".
Au besoin, vous pouvez utiliser du diplay grid sur la row et "widthGrid" sur le width de chaque colonne. Ceci prendra cette valeur dynamique : calc(100% / ' + children + ')





Style à ajouter dans custom CSS ou Betheme : 
.rowProlive{
   visibility:hidden
}
.rowNewProlive {
    display: flex;
    justify-content: center;
    flex-wrap:wrap;
    padding: 5vh 5vw !important;
}
div[class^="colProlive-"]{
    width: 27vw;
    background-color: #f2f2f2;
    margin: 2vh 1vw;
    display: flex;
    flex-direction: column;
}
.rowNewProlive .title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 25px;
    padding: 15px 0;
}
.rowNewProlive .left-column {
    display: inline-block;
    height: 350px;
    overflow: hidden;
}
.rowNewProlive .right-column{
   padding:20px 30px;
   display:flex;
   flex-direction:column;
   flex:1
}
.rowNewProlive .right-column .description{
   width:auto !important
}
.rowNewProlive .date{
    margin-top:auto
}
 
@media only screen and (max-width:1440px) {
    div[class^="colProlive-"] {
        width: 40vw;
    }
}
@media only screen and (max-width:962px) {
    .rowNewProlive {
        padding: 5vh 2vw !important;
    }
    div[class^="colProlive-"] {
        width: 44vw;
        margin: 2vh 2vw;
    }
    .rowNewProlive .left-column {
        height: 250px;
    }
}
@media only screen and (max-width:767px) {
    div[class^="colProlive-"] {
        width: 90vw;
    }
    .rowNewProlive .left-column {
        height: unset;
        max-height: 250px;
    }
}

*******/

const customProlive = () =>{
        var cmp = 0;
        var titles;
        if ($('#pj-prolive-hc-social_post').length) {
            console.log('social post detected : ', $('#pj-prolive-hc-social_post'.length));
            $('.rowProlive').css('transform', 'scale(0)');
            $('.pj-prolive-content .accordion-item').each(function (i, t) {
                $('#pj-prolive-hc-' + (i) + ' .accordion').trigger('click');
                titles = $(this).find('.title-content').text();
                console.log('title', titles);
                cmp++;
                img = $(this).find('.left-column img');
                $(this).find('.left-column img').wrap('<a href="' + img.attr('src') + '" data-lightbox="image prolive">');
                $('.rowNewProlive').append(`<div class="colProlive-${cmp}"></div>`);
                $('.colProlive-' + cmp).html($(this).find('.panel-container').html());
                $('.colProlive-' + cmp).find('.right-column').prepend(`<div class="content-title"><h4 class="title">${titles}</h4></div>`);
                if(!$('.right-column .description')?.length){
                    $('.content-title').after('<p class="description">'+titles+'</p>');
                }
            });
 
            $('div[class^="colProlive-"]').each(function (i, t) { });
 
            lightbox.option({
                'resizeDuration': 200,
                'wrapAround': true
            });
 
            var children = $('.rowNewProlive > div[class^="colProlive-"]').length;
            console.log('nb colProlive detected : ', children);
            var widthGrid = [];
            for (i = 0; i < children; i++) {
                widthGrid.push('calc(100% / ' + children + ')');
            }
            console.log('widthGrid : ', widthGrid, 'string gidSize : ', String(widthGrid).split(',').join(' '));
 
            setTimeout(() => {
                console.log('remove initial Prolive');
                $('.rowProlive').remove();
                const size = $('.rowNewProlive .left-column').width();
            }, 150);
        }
};
 
// Gestion de la mutation du DOM
const checkDOMMutation = (classListen, utilsFunction) => {
  let nodesToObserve = document.querySelectorAll("." + classListen).length; // Nombre total d'éléments à observer
  let cmp=0;
  const handleMutation = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const addedElements = Array.from(mutation.addedNodes);
        addedElements.forEach((node) => {
          if (String(node.classList).includes(classListen)) {
              cmp++;
              //console.log({cmp}, 'nb items : ',document.querySelectorAll("." + classListen).length);
            (cmp === document.querySelectorAll("." + classListen).length)&& utilsFunction(),observer.disconnect();
          }
        });
      }
    }
  };
  const parentElement = document;
  const observer = new MutationObserver(handleMutation);
  const observerOptions = {
    childList: true,
    subtree: true,
  };
  observer.observe(parentElement, observerOptions);
};
 
 
// Sur la page ayant le pathname "actualites", nous écoutons l'ajout des classes "accordion-item", une fois le dernier élément chargé, nous lançons la fonction liée au customProlive.
window.location.pathname.includes("actualites") && checkDOMMutation("accordion-item", customProlive);
