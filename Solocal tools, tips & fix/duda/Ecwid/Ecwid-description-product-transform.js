dmAPI.runOnReady('DudaReadyDOM',funcReadyDomDM);
  function funcReadyDomDM(){
    const env = dmAPI.getCurrentEnvironment();
      if(env !== 'editor') {
        if(window.location.pathname.includes('/boutique')){
            console.log('page en lien avec la boutique');
            const fixDescriptionEcwid = () =>{
                console.log('gestion du repositionnement de la description du produit');
                const elementToMove = document.querySelector('#productDescription');
                const targetElement = document.querySelector('.product-details--layout-sidebar-right');
                const isStore = document.querySelector('.ec-store__content-wrapper');
                console.log({elementToMove},{targetElement},{isStore});
                (elementToMove && targetElement && isStore) && (elementToMove.remove(),targetElement.insertAdjacentElement('afterend', elementToMove));
            }
            const checkReadyAPIEcwid = () => {
                console.log('ecwid : ', window.ec);
              if (window.ec !== undefined && $('.product-details--layout-sidebar-right')?.length) {
                  console.log('store detected');
                fixDescriptionEcwid();
              } else {
                console.log('API not loaded');
                setTimeout(checkReadyAPIEcwid, 1000);
              }
            }
            checkReadyAPIEcwid();
        }
    }
}
