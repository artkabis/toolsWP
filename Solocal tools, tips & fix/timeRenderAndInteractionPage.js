
//Détection du premier changement d'onglet depuis une page spécifique
let firstHiddenTime = document.visibilityState === 'hidden' ? 0 : Infinity;
document.addEventListener('visibilitychange', (event) => {
  firstHiddenTime = Math.min(firstHiddenTime, event.timeStamp);
  console.log('firstHiddenTime : ',firstHiddenTime);//Renvoi le délai du changement d'état
}, {once: true});
