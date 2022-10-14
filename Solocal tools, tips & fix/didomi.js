// Si l'utilisateur clique sur "accepter", reload de la page pour que le module vidéo soit chargé.
window.didomiEventListeners = window.didomiEventListeners || [];
  window.didomiEventListeners.push({
    event: 'notice.clickagree',
    listener: function (data) {
      location.reload();
    }
});
