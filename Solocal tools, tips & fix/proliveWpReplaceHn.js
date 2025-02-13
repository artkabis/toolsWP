const utilsFunction = (nodesArray) =>{
    console.log({nodesArray});
        nodesArray.each(function(i,t){
            const h5TitlesTransform = $(this).find('button.accordion').html().replaceAll('h5','p');
            $(this).find('button.accordion').html(h5TitlesTransform);
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

// Sur la page ayant le pathname "/" (ici home), nous écoutons l'ajout des classes "accordion-item", une fois le dernier élément chargé, nous lançons la fonction "utilsDunction.
window.location.pathname=== "/" && checkDOMMutation("accordion-item");
