const utilsFunction = (nodesArray) =>{
    console.log({nodesArray});
        nodesArray.each(function(i,t){
            console.log('all node replace : ',$(this));
            const h5TitlesTransform = $(this).html().replaceAll('h5','h3');
            $(this).html(h5TitlesTransform);
            console.log('new html h3 : ',$(this).html());
        });
 
};
 
// Gestion de la mutation du DOM
const checkDOMMutation = (classListen) => {
  let nodesToObserve = document.querySelectorAll("." + classListen).length; // Nombre total d'éléments à observer
  let cmp=0;
  const handleMutation = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const addedElements = Array.from(mutation.addedNodes);
        addedElements.forEach((node) => {
          if (String(node.classList).includes(classListen)) {
              console.log(node + ' checked');
              cmp++;
              //console.log({cmp}, 'nb items : ',document.querySelectorAll("." + classListen).length);
            (cmp === document.querySelectorAll("." + classListen).length)&& utilsFunction($("." + classListen)),observer.disconnect();
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
 
 
// Sur la page ayant le pathname "actualites", nous écoutons l'ajout des classes "accordion-item", une fois le dernier élément chargé, nous lançons la fonction "utilsDunction.
window.location.pathname=== "/" && checkDOMMutation("accordion-item");
