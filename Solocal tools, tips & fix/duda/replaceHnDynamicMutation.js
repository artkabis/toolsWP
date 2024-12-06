/***** 
Exemple de cas d'utilisation sur le media slider >>>https://solocaldudaadmin.eu-responsivesiteeditor.com/site/89d42e60376b4fd2bc8889771347e00a/home?preview=true&insitepreview=true&dm_device=desktop
******/
const replaceOrRemoveNodeHn = (params) => {
    const { targetSelector, targetChild, replaceNode, classe, remove, textTransform } = params;
    const queue = [];

    const elementReplace = (params) => {
        const { targetSelector, targetChild, replaceNode, classe, remove, textTransform } = params;
        document.querySelectorAll(targetSelector)?.forEach((targetNode) => {
            targetNode.querySelectorAll(targetChild)?.forEach((childNode) => {
                if (!remove) {
                    const newNode = replaceNode ? document.createElement(replaceNode) : document.createElement("div");
                    newNode.className = `${classe ? classe : "SOMS_replace-title"}`;
                    const originalText = childNode?.textContent;
                    newNode.textContent = textTransform?.length && typeof textTransform === "string"
                        ? textTransform
                        : originalText;
                    childNode.replaceWith(newNode);
                } else {
                    childNode.remove();
                }
            });
        });
    };
    const checkInitialNodes = () => {
        const nodes = document.querySelectorAll(targetSelector);
        nodes.forEach((node) => {
            elementReplace({ targetSelector, targetChild, replaceNode, classe, remove, textTransform });
        });
    };
    const mutationCallback = (mutationsList) => {
        if (!queue.length) requestAnimationFrame(processQueue);
        queue.push(...mutationsList);
    };
    const processQueue = () => {
        queue.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((addedNode) => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        const matchesTarget = addedNode.matches(targetSelector);
                        const targetNodes = matchesTarget
                            ? [addedNode]
                            : Array.from(addedNode.querySelectorAll(targetSelector));
                        targetNodes.forEach((node) => {
                            elementReplace({ targetSelector, targetChild, replaceNode, classe, remove, textTransform });
                        });
                    }
                });
            }
        });
        queue.length = 0;
    };
    const targets = document.querySelectorAll(targetSelector);
    const observers = [];

    targets.forEach(target => {
        const targetParent = target.parentElement;
        if (targetParent) {
            const observer = new MutationObserver(mutationCallback);
            observer.observe(targetParent, { childList: true, subtree: true });
            observers.push(observer);
        }
    });

    checkInitialNodes();
    return observers;
};

export const initializeObservers = (config) => {
    const allObservers = config.map(params => {
        return replaceOrRemoveNodeHn(params);
    });
    return allObservers.flat();
};



/************ Mis en place et utilisation du script (depuis un module ESM importé) ***********/


/*
<script type="module" async >

    import * as RHN from 'https://de.cdn-website.com/12fb6ded409c4e3489847c649d17e9f6/files/uploaded/replaceOrRemoveNodesHn-1.06.mjs';
    // Exemple d'utilisation :
    const config = [
        {
            targetSelector: '[data-auto="runtime-accordion-widget"]',
            targetChild: 'h3',
            replaceNode: 'div',
            classe: 'SoMS-accordion-item-title',
            remove: false
        },
        {
            targetSelector: '[data-auto="slider-wrapper"]',
            targetChild: 'h3[data-auto="title"]',
            replaceNode: 'div',
            classe: 'SoMS-slideSlot-item-title',
            remove: false
        },
        {
            targetSelector: '.dmPhotoGallery',
            targetChild: 'h3',
            classe: 'SoMS-caption-title',
            remove: false,
            textTransform: "Texte modifié dynamiquement"
        },
        {
          targetSelector: '.flexslider ',
            targetChild: 'h3.slide-title',
            classe: 'SoMS-slide-title',
            remove: false,

        }
    ];
     const env = dmAPI.getCurrentEnvironment();
    if(env !== 'editor') {
        const handlers = RHN.initializeObservers(config);
    }
</script>
 

*/
