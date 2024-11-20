/***** 
Exemple de cas d'utilisation sur le media slider >>>https://solocaldudaadmin.eu-responsivesiteeditor.com/site/89d42e60376b4fd2bc8889771347e00a/home?preview=true&insitepreview=true&dm_device=desktop
******/
const startCheckMutation = (params) => {
    const { page, target, targetClassName, targetChild, matchTarget, replaceNode, classe } = params;

    // Vérification initiale
    const checkInitialNodes = () => {
        const nodes = document.querySelectorAll(`.${targetClassName}`);
        nodes.forEach((node) => {
            elementReplace({ page, target, targetClassName, targetChild, matchTarget, replaceNode, classe });
        });
    };

    checkInitialNodes();

    // Callback pour MutationObserver
const mutationCallback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((addedNode) => {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    // Vérifiez si le nœud ajouté correspond ou contient des enfants pertinents
                    const targetNodes = addedNode.matches(`.${targetClassName}`) 
                        ? [addedNode] 
                        : Array.from(addedNode.querySelectorAll(`.${targetClassName}`));

                    targetNodes.forEach((node) => {
                        console.log(`Traitement de :`, node);
                        elementReplace({ page, target: $(node), targetClassName, targetChild, matchTarget, replaceNode, classe });
                    });
                }
            });
        }
    }
};

    // Configuration de MutationObserver
    const observer = new MutationObserver(mutationCallback);
    observer.observe(document.body, { childList: true, subtree: true });
};

const elementReplace = (params) => {
    const { page, target, targetClassName, targetChild, matchTarget, replaceNode, classe } = params;
    console.log('remplacement de :',target?.find(targetChild)); 
    target?.find('h3')?.each(function () {
        console.log('_______________________________Remplacement de :', this, '        par     ::::: ',`<${replaceNode} class="${classe} processed">${$(this).text()}</${replaceNode}>`);
        $(this).replaceWith(`<${replaceNode} class="${classe} processed">${$(this).text()}</${replaceNode}>`);
        startCheckMutation(params);
    });
};

// Appel initial
elementReplace({
    page: '/',
    target: $('.d-ext-mediaSlider-slide__contentContainer'),
    targetClassName: 'd-ext-mediaSlider-slidesContainer__slide',
    targetChild: 'h3',
    matchTarget: ['data-auto', 'slideSlot'],
    replaceNode: 'div',
    classe: 'SoMS-slideSlot-item-title',
});

elementReplace({page: '/',target: $('.d-ext-mediaSlider-slide__contentContainer'),targetClassName: 'd-ext-mediaSlider-slidesContainer__slide',targetChild: 'h3',matchTarget: ['data-auto', 'slideSlot'],replaceNode: 'div',classe: 'SoMS-slideSlot-item-title',});

