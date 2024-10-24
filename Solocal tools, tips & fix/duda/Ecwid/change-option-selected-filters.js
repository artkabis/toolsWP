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
      setTimeout(changeOption, 500);
      // Gestion de la mutation du DOM
      const checkDOMMutation = () => {
        const handleMutation = (mutationsList, observer) => {
          for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
              const addedElements = Array.from(mutation.addedNodes);
              addedElements.forEach((node) => {
                if (
                  String(node.classList).includes("ec-store__content-wrapper")
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
