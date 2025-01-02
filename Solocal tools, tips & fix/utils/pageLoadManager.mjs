class PageLoadManager {
  constructor() {
    this.resourcesQueue = new Set();
    this.promisesQueue = new Set();
    this.networkRequests = new Set();
    this.isComplete = false;
  }

  // Surveille les requêtes réseau
  initNetworkTracking() {
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      const request = originalFetch.apply(window, args);
      this.networkRequests.add(request);
      request.finally(() => this.networkRequests.delete(request));
      return request;
    };

    // Surveille XMLHttpRequest
    const originalXHR = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function(...args) {
      const xhr = this;
      const promise = new Promise((resolve) => {
        xhr.addEventListener('loadend', () => resolve());
      });
      this.networkRequests.add(promise);
      promise.finally(() => this.networkRequests.delete(promise));
      return originalXHR.apply(xhr, args);
    };
  }

  // Surveille le chargement des ressources (images, scripts, etc.)
  trackResource(element) {
    if (element.complete) return;
    const promise = new Promise((resolve) => {
      element.addEventListener('load', () => resolve());
      element.addEventListener('error', () => resolve());
    });
    this.resourcesQueue.add(promise);
    promise.finally(() => this.resourcesQueue.delete(promise));
  }

  // Ajoute une promesse personnalisée à surveiller
  addCustomPromise(promise) {
    this.promisesQueue.add(promise);
    promise.finally(() => this.promisesQueue.delete(promise));
  }

  // Vérifie si tout est chargé
  async waitForComplete() {
    if (this.isComplete) return;

    // Attend le chargement initial du document
    await new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });

    // Donne le temps à la pile d'événements de se vider
    await new Promise(resolve => setTimeout(resolve, 0));

    // Continue de vérifier jusqu'à ce que toutes les files soient vides
    while (
      this.resourcesQueue.size > 0 ||
      this.promisesQueue.size > 0 ||
      this.networkRequests.size > 0
    ) {
      await Promise.race([
        ...this.resourcesQueue,
        ...this.promisesQueue,
        ...this.networkRequests
      ]);
      // Donne une chance aux nouvelles requêtes de s'enregistrer
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isComplete = true;
  }

  // Observer les nouveaux éléments ajoutés au DOM
  initMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLImageElement || 
              node instanceof HTMLScriptElement || 
              node instanceof HTMLLinkElement) {
            this.trackResource(node);
          }
        });
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
}
const loadManager = new PageLoadManager();
export default PageLoadManager;
