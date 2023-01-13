 dmAPI.runOnReady('DudaReadyDOM',funcReadyDomDM);
  function funcReadyDomDM(){
      const env = dmAPI.getCurrentEnvironment();
      const checkEcwid = ()=>{
          console.log('start listen Ecwid timeout');
          Ecwid.OnAPILoaded.add(function() {
            console.log("Ecwid storefront JS API has loaded");
            const details = Ecwid.getTrackingConsent();
            console.log('Ecwid details : ',details);
            var StaticBaseUrl = Ecwid.getStaticBaseUrl();
            console.log('StaticBaseUrl : ',StaticBaseUrl);
            var storeId = Ecwid.getOwnerId();
            console.log('storeId : ',storeId);
            Ecwid.OnCartChanged.add(function(cart) {
              console.log(cart.items[0].product.name + " in the cart has SKU: " + cart.items[0].product.sku);
            });
        });
      }
      setTimeout(checkEcwid,3000);
  }
