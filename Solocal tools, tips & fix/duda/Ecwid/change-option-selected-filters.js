$(window).on("load", function () {
  const env = dmAPI.getCurrentEnvironment();
  if (env !== "editor") {
    if (window.location.pathname.includes("/boutique")) {
      const changeOption = () => {
        const storeDetected = $(".ec-store__content-wrapper").length;
        if (storeDetected) {
          $(".ec-store__content-wrapper .form-control__select").each(function (
            i,
            t
          ) {
            $(this)
              .find("option")
              .each(function (i, t) {
                const val = $(this).text().replaceAll("Prix", "Capacité");
                if ($(this).attr("value") == "priceAsc") {
                  $(this).attr("selected", true).trigger("click");
                  $(this).parent()[0].value = "priceAsc";
                  $(this).parent()[0].dispatchEvent(new Event("change"));
                }
                $(this).text(val);
              });
          });
        }
      };
      // Gestion de la mutation du DOM
      const checkDOMMutation = () => {
        const handleMutation = (mutationsList, observer) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
              const addedElements = Array.from(mutation.addedNodes);
              addedElements.forEach((node) => {
                //console.log('list class muted : ', String(node.classList), 'elem trie detected : ',String(node.classList).includes("ec-store__content-wrapper") || String(node.classList).includes("grid__sort"));
                if (
                  String(node.classList).includes("ec-store__content-wrapper") || String(node.classList).includes("grid__sort") || String(node.classList).includes("ec-store--medium-product-images")
                ) {
                  changeOption();
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
      window.location.pathname.includes("/boutique") && checkDOMMutation();
    }
  }
});
