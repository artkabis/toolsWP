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
