const checkDOMMutation = (classListen, utilsFunction) => {
  let nodesToObserve = document.querySelectorAll("." + classListen).length; // Nombre total d'éléments à observer
  console.log({nodesToObserve},document.querySelectorAll("." + classListen));
  let cmp=0
  const handleMutation = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const addedElements = Array.from(mutation.addedNodes);
        addedElements.forEach((node) => {
          if (String(node.classList).includes(classListen)) {
              cmp++;
              console.log({cmp}, 'nb items : ',document.querySelectorAll("." + classListen).length);
            (cmp === document.querySelectorAll("." + classListen).length)&& utilsFunction(),observer.disconnect();// Une fois tous les éléments checké, on launch la fonction et disconnect "observer"
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
