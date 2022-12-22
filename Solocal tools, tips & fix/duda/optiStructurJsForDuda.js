
const env = dmAPI.getCurrentEnvironment();
if(env !== 'editor') {
  dmAPI.runOnReady('DudaReadyDOM',funcReadyDomDM);
  function funcReadyDomDM(){
      //Ici votre méthode sera jouée en mode live ou preview après un rendu complet de l'ensemble des composants Duda. (all componants Reactjs added)
  }
}
