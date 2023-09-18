javascript:(($) => {
  const detectChange = (elemToObserve, classListen, isUpdateWindow) => {
    var prevClassState =
      elemToObserve &&
      elemToObserve.classList !== null &&
      elemToObserve.classList.contains(classListen);
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName == "class") {
          var currentClassState =
            mutation.target.classList.contains(classListen);
          if (prevClassState !== currentClassState) {
            prevClassState = currentClassState;
            (currentClassState) ? console.log("class added!") : ((isUpdateWindow) && updateWindow(),checkParagraphe(),observer.disconnect(),console.log("class removed!"));           
          }
        }
      });
    });
    elemToObserve &&
      observer.observe(elemToObserve, {
        attributes: true,
        attributeFilter: ["class"],
      });
  };
  const iframe = document.querySelector(".NEEPreviewInside");
  const checkParagraphe = ()=>{
    const iframeDocument = iframe.contentDocument;
    const paragraphes = iframeDocument.querySelectorAll(".dmNewParagraph");
    paragraphes.forEach((para) => {
      const text = para.textContent || para.innerText;
      const wordCount = text
        .split(/\s+/)
        .filter((word) => word.trim() !== "").length;
      if (wordCount > 25) {
        const charCount = text.length;
        detectChange(para, "dmNowInlineEditing", false);
        para.setAttribute(
          "title",
          ` ${wordCount} mots - ${text.length} caractères - Texte: "${text}"`
        );
      }
    });
  };
  const updateWindow=() =>{
    const iframeDocument = iframe.contentDocument;
    if (iframeDocument) {
      const newWindow = window.open(
        "",
        "Nombres de Mots par Hn",
        "width=600,height=400"
      );
      const resultsList = document.createElement("ul");

      for (let i = 1; i <= 6; i++) {
        const hnElements = iframeDocument.querySelectorAll(`h${i}`);
        hnElements.forEach((heading) => {
          const dmPara = heading.closest(".dmNewParagraph");
          detectChange(dmPara, "dmNowInlineEditing", true);
          const text = heading.textContent || heading.innerText;
          const wordCount = text
            .split(/\s+/)
            .filter((word) => word.trim() !== "").length;
          const charCount = text.length;
          heading.setAttribute(
            "title",
            `H${i}: ${wordCount} mots - ${charCount} caractères - Texte: "${text}"`
          );
          const listItem = document.createElement("li");
          if (charCount >= 50 && charCount <= 90) {
            listItem.classList.add("green-text");
          } else {
            listItem.classList.add("red-text");
          }
          listItem.textContent = `H${i}: ${wordCount} mots - ${charCount} caractères - Texte: "${text}"`;
          resultsList.appendChild(listItem);
        });
      }
      newWindow.document.body.innerHTML = "";
      newWindow.document.head.innerHTML = "";
      newWindow.document.head.innerHTML = `<style>.green-text {color: green;}.red-text {color: red;}</style>`;
      newWindow.document.body.appendChild(resultsList);
    };
  };
  updateWindow();
  checkParagraphe();
})(jQuery);
