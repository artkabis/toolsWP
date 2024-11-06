function $$$(selector, rootNode=document.body) {
    const arr = [],traverser = node => {
        if(node.nodeType !== Node.ELEMENT_NODE) {return}
        if(node.matches(selector)) {arr.push(node)}
        const children = node.children
        if (children.length) {for(const child of children) {traverser(child)}}
        const shadowRoot = node.shadowRoot
        if (shadowRoot) {
            const shadowChildren = shadowRoot.children
            for(const shadowChild of shadowChildren) {traverser(shadowChild)}
        }
    }
    traverser(rootNode)
  console.log('arr : ',arr)
    return arr
}

var nodes = $$$('button[data-testid="uc-privacy-button"]');
nodes[0].setAttribute("style", "background-color:green!important;left:inherit;right:40px");



// Autre méthode avec MutationObserver associé à une vérification avec setTimeout


const changeDirectionUserCentrics = (userCentricsRoot) => {
  if (userCentricsRoot.shadowRoot && userCentricsRoot.shadowRoot.mode === 'open') {
    const testingChildrenNode = () => {
      const button = userCentricsRoot.shadowRoot.querySelector("[data-testid='uc-privacy-button']");
      if (button) {
        const style = document.createElement('style');
        style.textContent = `
              [data-testid='uc-privacy-button'] {
                left: auto !important; 
                right: 40px !important;
              }
            `;
        userCentricsRoot.shadowRoot.appendChild(style);
      } else {

        setTimeout(testingChildrenNode, 1000);
      }
    }
    testingChildrenNode();
  };

}

const checkDOMMutation = () => {
  const handleMutation = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const addedElements = Array.from(mutation.addedNodes);
        addedElements.forEach((node) => {
          if (String(node.id).includes("usercentrics-root")) {
            const userCentricsRoot = document.querySelector('#usercentrics-root');
            changeDirectionUserCentrics(userCentricsRoot);
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
checkDOMMutation();



/**********************************
** Utilisation de deux mutationObserver afin d'écouter le DOM principal, puis le shadowDOM
***********************************/
const applyStyleToButton = (userCentricsRoot) => {
    const button = userCentricsRoot.shadowRoot.querySelector("[data-testid='uc-privacy-button']");
    if (button) {
        button.style.cssText = `
            left: auto !important; 
            right: 40px !important;
        `;
        return true;
    }
    return false;
};

const observeShadowDOM = (userCentricsRoot) => {
    const shadowObserver = new MutationObserver(() => {
        (applyStyleToButton(userCentricsRoot)) && shadowObserver.disconnect(); 
        
    });
    shadowObserver.observe(userCentricsRoot.shadowRoot, { childList: true, subtree: true });
};

const checkDOMMutation = () => {
    const handleMutation = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (node.id && node.id.includes("usercentrics-root")) {
                        const userCentricsRoot = document.querySelector('#usercentrics-root');
                        (!applyStyleToButton(userCentricsRoot)) && observeShadowDOM(userCentricsRoot); 
                        observer.disconnect();
                    }
                });
            }
        }
    };

    const mainObserver = new MutationObserver(handleMutation);
    mainObserver.observe(document, { childList: true, subtree: true });
};

checkDOMMutation();


