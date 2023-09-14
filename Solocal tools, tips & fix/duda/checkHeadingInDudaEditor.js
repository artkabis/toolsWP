(($)=>{
    const detectChange = (elemToObserve,classListen)=>{
        
        var prevClassState = (elemToObserve && elemToObserve.classList!==null)&& elemToObserve.classList.contains(classListen);
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName == "class") {
                    var currentClassState = mutation.target.classList.contains(classListen);
                    if (prevClassState !== currentClassState) {
                        prevClassState = currentClassState;
                        if (currentClassState)
                            console.log("class added!");
                        else
                            console.log("class removed!");
                        updateWindow();
                    }
                }
            });
        }
        );
        (elemToObserve) && observer.observe(elemToObserve, {
            attributes: true
        });
    }
    ;
    const iframe = document.querySelector(".NEEPreviewInside");
    function updateWindow() {
        const iframeDocument = iframe.contentDocument;
        if (iframeDocument) {
            const newWindow = window.open("", "Check Heading valitity", "Nombres de Mots par Hn", "width=600,height=400");
            const resultsList = document.createElement("ul");
            for (let i = 1; i <= 6; i++) {
                const hnElements = iframeDocument.querySelectorAll(`h${i}`);
                hnElements.forEach((heading)=>{
                    const dmPara = heading.closest(".dmNewParagraph");
                    detectChange(dmPara, "dmNowInlineEditing");
                    const text = heading.textContent || heading.innerText;
                    const wordCount = text.split(/\s+/).filter((word)=>word.trim() !== "").length;
                    const charCount = text.length;
                    heading.setAttribute("title", `H${i}: ${wordCount} mots - ${charCount} caractères - Texte: "${text}"`);
                    const listItem = document.createElement("li");
                    if (charCount >= 50 && charCount <= 90) {
                        listItem.classList.add("green-text");
                    } else {
                        listItem.classList.add("red-text");
                    }
                    listItem.textContent = `H${i}: ${wordCount} mots - ${charCount} caractères - Texte: "${text}"`;
                    resultsList.appendChild(listItem);
                }
                );
            }
            newWindow.document.head.innerHTML = `<title>CheckHeading valitidy</title><style>.green-text {color: green;}.red-text {color: red;}</style>`;
            newWindow.document.body.innerHTML = "";

            newWindow.document.body.appendChild(resultsList);
        }
    }
    updateWindow();
    const observer = new MutationObserver(()=>{
        updateWindow();
    }
    );
    observer.observe(iframe, {
        childList: true,
        subtree: true
    });
}
)(jQuery);
