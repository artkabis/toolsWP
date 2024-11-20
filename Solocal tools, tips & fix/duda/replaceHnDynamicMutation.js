/***** 
Exemple de cas d'utilisation sur le media slider >>>https://solocaldudaadmin.eu-responsivesiteeditor.com/site/89d42e60376b4fd2bc8889771347e00a/home?preview=true&insitepreview=true&dm_device=desktop
******/
const startCheckMutation = (params) => {
    const {  targetClassName, targetChild, replaceNode, classe } = params;

    const checkInitialNodes = () => {
        const nodes = document.querySelectorAll(`.${targetClassName}`);
        nodes.forEach((node) => {
            elementReplace({  targetClassName, targetChild, replaceNode, classe });
        });
    };

    checkInitialNodes();

const mutationCallback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((addedNode) => {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    const targetNodes = addedNode.matches(`.${targetClassName}`) 
                        ? [addedNode] 
                        : Array.from(addedNode.querySelectorAll(`.${targetClassName}`));

                    targetNodes.forEach((node) => {
                        elementReplace({ targetClassName, targetChild, replaceNode, classe });
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
    const { targetClassName, targetChild, replaceNode, classe } = params;
    $('.'+targetClassName)?.find(targetChild)?.each(function () {
        $(this).replaceWith(`<${replaceNode} class="${classe} processed">${$(this).text()}</${replaceNode}>`);
        startCheckMutation(params);
    });
};


startCheckMutation({
    targetClassName: 'd-ext-mediaSlider-slidesContainer__slide',
    targetChild: 'h3',
    replaceNode: 'div',
    classe: 'SoMS-slideSlot-item-title',
});
