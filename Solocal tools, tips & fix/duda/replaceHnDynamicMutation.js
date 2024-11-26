/***** 
Exemple de cas d'utilisation sur le media slider >>>https://solocaldudaadmin.eu-responsivesiteeditor.com/site/89d42e60376b4fd2bc8889771347e00a/home?preview=true&insitepreview=true&dm_device=desktop
******/
export const replaceOrRemoveNodeHn = (params) => {
    const { targetSelector, targetChild, replaceNode, classe, remove } = params;

    const checkInitialNodes = () => {
        const nodes = document.querySelectorAll(targetSelector);
        nodes.forEach((node) => {
            elementReplace({ targetSelector, targetChild, replaceNode, classe, remove });
        });
    };

    checkInitialNodes();

    const mutationCallback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((addedNode) => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        const matchesTarget = addedNode.matches(targetSelector);
                        const targetNodes = matchesTarget
                            ? [addedNode]
                            : Array.from(addedNode.querySelectorAll(targetSelector));
                        targetNodes.forEach((node) => {
                            elementReplace({ targetSelector, targetChild, replaceNode, classe, remove });
                        });
                    }
                });
            }
        }
    };


    const observer = new MutationObserver(mutationCallback);
    observer.observe(document.body, { childList: true, subtree: true });
};

const elementReplace = (params) => {
    const { targetSelector, targetChild, replaceNode, classe, remove } = params;
    document.querySelectorAll(targetSelector).forEach((targetNode) => {
        targetNode.querySelectorAll(targetChild)?.forEach((childNode) => {
            if (!remove) {
                const newNode = document.createElement(replaceNode);
                newNode.className = `${classe} processed`;
                newNode.textContent = childNode.textContent;
                childNode.replaceWith(newNode);
            } else {
                childNode.remove();
            }
        });
    });
};


/************ Mis en place et utilisation du script (depuis un module ESM importé) ***********/


/*
<script type="module" async>
    import * as RHN from 'https://de.cdn-website.com/12fb6ded409c4e3489847c649d17e9f6/files/uploaded/replaceOrRemoveNodesHn-1.03.mjs';
        const env = dmAPI.getCurrentEnvironment();
        if(env !== 'editor') {
           //Remplacement des h3 du widget "accordion"
            RHN.replaceOrRemoveNodeHn({targetSelector: '[data-auto="runtime-accordion-widget"]',targetChild: 'h3',
            replaceNode: 'div',classe: 'SoMS-accordion-item-title',remove: false});

            //Remplacement des h3 du widget "slider"
            RHN.replaceOrRemoveNodeHn({targetSelector: '[data-auto="slider-filmRole"]',targetChild: 'h3',
            replaceNode: 'div',classe: 'SoMS-slideSlot-item-title',remove: false});

            //Remplacement des h3.caption-title du widget "galerie de photos"
            RHN.replaceOrRemoveNodeHn({targetSelector: '.dmPhotoGallery ',targetChild: 'h3',
            replaceNode: 'span',classe: 'SoMS-caption-title',remove: false});
        }
</script>

*/
