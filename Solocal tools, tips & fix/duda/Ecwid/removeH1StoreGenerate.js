
/***** Simply version >>>>>>>>
**/

const funcReadyDomDM =() => {
    const env = dmAPI.getCurrentEnvironment();
      if(env !== 'editor') {
        if(window.location.pathname.includes('/boutique')){
            const fixH1Ecwid = () =>{
                const h1Store = document.querySelector('.ec-header-h1');
                (h1Store) && (h1Store.remove());
            }
            fixH1Ecwid();
        }
    }
}
dmAPI.runOnReady('DudaReadyDOM',funcReadyDomDM);
     








/***** Listen Ecwid  ready and remove h1 generated with shop >>>>>>>>
**/


const funcReadyDomDM =() => {
    const env = dmAPI.getCurrentEnvironment();
      if(env !== 'editor') {
        if(window.location.pathname.includes('/boutique')){
            console.log('page en lien avec la boutique');
            const fixH1Ecwid = () =>{
                const h1Store = document.querySelector('.ec-header-h1');
                (h1Store) && (h1Store.remove());
            }
            const checkReadyAPIEcwid = () => {
              if (window.ec !== undefined && $('.ec-header-h1')?.length) {
                fixH1Ecwid();
              } else {
                console.log('API not loaded & h1 store detected');
                setTimeout(checkReadyAPIEcwid, 1000);
              }
            }
            checkReadyAPIEcwid();
        }
    }
}
dmAPI.runOnReady('DudaReadyDOM',funcReadyDomDM);
