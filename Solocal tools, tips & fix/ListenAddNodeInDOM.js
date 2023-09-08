
// Gestion de la mutation du DOM
const checkDOMMutation = (classListen, utilsFunction) => {
  let nodesToObserve = document.querySelectorAll("." + classListen).length; // Nombre total d'éléments à observer
  const handleMutation = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const addedElements = Array.from(mutation.addedNodes);
        addedElements.forEach((node) => {
          if (String(node.classList).includes(classListen)) {
            utilsFunction();
            nodesToObserve--; // Marque l'élément comme "traité"
          }
        });
      }
    }
    // Si tous les éléments ont été observés et traités, arrêtez l'observation.
    if (nodesToObserve === 0) {
      observer.disconnect();
    }
  };
  const parentElement = document.body;
  const observer = new MutationObserver(handleMutation);
  const observerOptions = {
    childList: true,
    subtree: true,
  };
  observer.observe(parentElement, observerOptions);
};

// Remplacement d'une adresse e-mail qui n'est plus valide en BDD
const replaceMail = () => {
  $(".woocommerce-privacy-policy-text").html(
    String($(".woocommerce-privacy-policy-text").html()).replace(
      new RegExp(/guichard.berty@wanadoo.fr/g),
      "magasin@espace-motoculture-chauvigny.fr"
    )
  );
};

// Sur la page commande, on écoute l'ajout de woocommerce-checkout, si celui-ci arrive dans le DOM, nous remplaçons l'adresse e-mail par la bonne.
window.location.pathname.includes("command") &&
  checkDOMMutation("woocommerce-checkout-payment", replaceMail);// On écoute la mutation de la classe woocommerce-checkout-payment
