
 dmAPI.runOnReady('DudaReadyDOM',funcReadyDomDM);
  function funcReadyDomDM(){
      const env = dmAPI.getCurrentEnvironment();
      if(env !== 'editor') {
          const blocCounter = document.querySelector(".blocCounter");//BlocCounter qui devront être détectés pour lancer l'animation
        if(blocCounter){   
            let blocCounterValue = blocCounter.getBoundingClientRect();
            const counters = document.querySelectorAll(".numberCounter");
            // LES PARAMETRES DE BASE DE L'ANIMATION
            let play = false;
            let duration = 2000; // temps de l'animation en millisecondes
            
            // LE DÉCLENCHEUR DE L'ANIMATION = ici 1/2 de la Hauteur de l'écran (paramétrable)
            const heightDivide = 2;
            window.addEventListener("scroll", (event) => {
              let halfWindow = window.scrollY + window.innerHeight / heightDivide;
              if (blocCounterValue.y < halfWindow && !play) {
                animCounter(counters,duration,play);
                console.log("play");
                play = !play;
              }
            });
            // LE COEUR DE L'ANIMATION
            const animCounter = (counters,duration,play) => {
              counters.forEach((counter) => {
                const value = Number(counter.getAttribute("data-target"));
                let startValue = 0;
                let starttime = null;
                function animate(timestamp) {
                  if (!starttime) {
                    starttime = timestamp;
                  }
                  const runtime = timestamp - starttime;
                  const relativeProgress = runtime / duration;
                  if (timestamp !== undefined) {
                    startValue = Math.trunc(value * Math.min(relativeProgress, 1));
                  }
                  counter.textContent = Number(startValue);
                  if (runtime < duration) {
                    requestAnimationFrame(animate);
                  }
                }
                requestAnimationFrame(animate);
                animate();
              });
            };
        }
     }
  }


/******* HTML brut



<div class="colCounter">
  <span class="prefixe"></span>
  <div class="numberCounter" data-target="6360">0</div>
  <span class="suffixe"></span>
</div>




*******************/
