/******
Utilisation : 

- Créer deux row : la première avec la classe "rowProlive", la seconde avec la classe rowNewProlive". 
- Dans la première row (rowProlive) insérez le widget Prolive

********/

const customProlive = () =>{
        var cmp = 0;
        var titles;
        if ($('#pj-prolive-hc-social_post').length) {
            console.log('social post detected : ', $('#pj-prolive-hc-social_post'.length));
            $('.rowProlive').css('transform', 'scale(0)');
            $('.pj-prolive-content .accordion-item').each(function (i, t) {
                $('#pj-prolive-hc-' + (i + 1) + ' .accordion').trigger('click');
                titles = $(this).find('.title-content').text();
                cmp++;
                img = $(this).find('.left-column img');
                $(this).find('.left-column img').wrap('<a href="' + img.attr('src') + '" data-lightbox="image prolive">');
                $('.rowNewProlive').append(`<div class="colProlive-${cmp}"></div>`);
                $('.colProlive-' + cmp).html($(this).find('.panel-container').html());
                $('.colProlive-' + cmp).find('.right-column').prepend(`<div class="content-title"><h4 class="title">${titles}</h4></div>`);
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
            console.log('widthGrid : ', widthGrid, 'string gridSize : ', String(widthGrid).split(',').join(' '));

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



// Sur la page ayant le pathname "actualites", on écoute l'ajout des accordion-item, Dès qu'ils ont tous été chargés, nous lançon la fonction "customProlive"
window.location.pathname.includes("actualites") && checkDOMMutation("accordion-item", customProlive);
