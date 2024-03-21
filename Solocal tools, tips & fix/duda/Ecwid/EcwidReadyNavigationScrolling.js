$(window).on('load', function(){
  const path = window.location.pathname;
  const env = dmAPI.getCurrentEnvironment();
  if(env !== 'editor') {
    if(path.includes('/boutique') || path ==='/'){
        const checkReadyAPIEcwid = () => {
          if (typeof window.ec !== 'undefined') {
            scrollTriggerEcwid();
          } else {
            console.log('API not loaded');
            setTimeout(checkReadyAPIEcwid, 1000);
          }
        }
        const scrollTriggerEcwid = () => {
          console.log("L'API Ecwid est disponible, exécuter la méthode spécifique ici.");
          window.ec.config.navigation_scrolling = 'IMMEDIATELY';
        }
        checkReadyAPIEcwid();
    }
  }
});
