// Config
const CONFIG = {
    POPUP_DELAY: 1000,
    MODAL_ID: '#myModal',
    YES_BUTTON: '#sgpb-yes-button',
    NO_BUTTON: '#sgpb-no-button',
    SESSION_KEY: 'first_visit',
    CONSENT_KEY: 'appconsent'
};
const setupAgeVerificationPopup = () => {
    const modal = document.querySelector(".sgpb-popup")?.closest(CONFIG.MODAL_ID);
    if (!modal) return;
    document.querySelector(CONFIG.YES_BUTTON).addEventListener("click", () => {
        modal.style.display = "none";
    });
    document.querySelector(CONFIG.NO_BUTTON).addEventListener("click", () => {
        document.querySelector(".sgpb-restriction-buttons-wrapper").style.display = "none";
        document.querySelector(".sgpb-restriction-buttons-wrapper").style.display = "block";
    });
};

const hasValidConsent = () => {
    const appConsent = localStorage.getItem(CONFIG.CONSENT_KEY);
    if (!appConsent) return false;

    try {
        const consentData = JSON.parse(appConsent);
        return consentData && consentData.consentstring !== null;
    } catch (e) {
        return false;
    }
};

const showAgeVerificationIfNeeded = () => {
    // Vérifier si c'est la première visite de la session
    const firstVisit = sessionStorage.getItem(CONFIG.SESSION_KEY);
    // Si ce n'est pas la première visite ou si le consentement a déjà été donné, rien n'est fait à ce stade
    if (firstVisit !== null || !hasValidConsent()) return;

    // Gestion de la premiére visite
    setTimeout(() => {
        sessionStorage.setItem(CONFIG.SESSION_KEY, "1");
        const popup18 = document.querySelector(".sgpb-popup")?.closest(CONFIG.MODAL_ID);
        if (popup18) {
            popup18.style.cssText = "display:block;visibility:visible";
        }
    }, CONFIG.POPUP_DELAY);
};


const init = () => {
    dmAPI.runOnReady('DudaReadyDOM', () => {
        const env = dmAPI.getCurrentEnvironment();
        if (env !== 'editor') {
            showAgeVerificationIfNeeded();
        }
    });

    // Config des boutons du popup
    dmAPI.runOnReady('18ans', setupAgeVerificationPopup);
};
init();






/****************************************************** Version pour Widget +18 *******************************************************/
window.customWidgetsFunctions["57cddaab00c44187ad2e28244e2bf518~15"] = function (element, data, api) {
   

/***** version qui me semble optimisé :  */
  // Configuration
    const CONFIG = {
        POPUP_DELAY: 1000,
        MODAL_ID: '#myModal',
        WIDGET_IN_EDITOR: '#ineditorplusde18',
        TARGET_WIDGET: '.sgpb-popup',
        YES_BUTTON: '#sgpb-yes-button',
        NO_BUTTON: '#sgpb-no-button',
        SESSION_KEY: 'first_visit',
        CONSENT_KEY: 'appconsent'
    };

    // En mode éditeur, simplement afficher l'élément pour plus de 18 ans
    if (data.inEditor) {
        const ineditorplusde18 = document.querySelector(CONFIG.WIDGET_IN_EDITOR);
        if (ineditorplusde18) {
            ineditorplusde18.style.display = 'block';
        }
        return;
    }

    /**
     * Gère les interactions avec le popup de vérification d'âge
     */
    const setupAgeVerificationPopup = () => {
        const modal = document.querySelector(CONFIG.TARGET_WIDGET)?.closest(CONFIG.MODAL_ID);
        console.log('modal +18 detected : ',modal);
        if (!modal) return;

        // Gestion du bouton "Oui"
        $(CONFIG.YES_BUTTON).on("click", () => {
            modal.style.display = "none";
        });
        
        // Gestion du bouton "Non"
        $(CONFIG.NO_BUTTON).on("click", () => {
            $(".sgpb-restriction-buttons-wrapper").hide();
            $(".sgpb-restriction-message").show();
        });
    };

    /**
     * Vérifie si le consentement a déjà été donné
     * @returns {boolean} True si le consentement est valide
     */
    const hasValidConsent = () => {
        const appConsent = localStorage.getItem(CONFIG.CONSENT_KEY);
        console.log({appConsent});
        if (!appConsent) return false;

        try {
            const consentData = JSON.parse(appConsent);
            console.log({consentData});
            return consentData && consentData.consentstring !== null;
        } catch (e) {
            return false;
        }
    };

    /**
     * Vérifie si l'utilisateur vient du même domaine
     * @returns {boolean} True si l'utilisateur vient du même domaine
     */
    const isFromSameDomain = () => {
        if (!document.referrer) return false;
        
        try {
            const referrerDomain = new URL(document.referrer).hostname;
            console.log({referrerDomain}, 'isrefererSameDomaine : ',referrerDomain === window.location.hostname);
            return referrerDomain === window.location.hostname;
        } catch (e) {
            return false;
        }
    };

    /**
     * Affiche le popup de vérification d'âge
     */
    const displayWidget = () => {
        const modal = document.querySelector(CONFIG.TARGET_WIDGET)?.closest(CONFIG.MODAL_ID);
        console.log('displayWidget modal : ',{modal});
        if (!modal) return;
        
        modal.style.display = "block";
        
        // Configurer les interactions avec le popup
        console.log('start 18ans setup widget runondeady !!!!');
        dmAPI.runOnReady('18ans', setupAgeVerificationPopup);
    };

    /**
     * Vérifie les conditions et affiche le widget si nécessaire
     */
    const checkConditionsAndDisplay = () => {
        // Si l'utilisateur vient du même domaine, ne pas afficher

        console.log('isFromSameDomain() ? :::: ', isFromSameDomain());
        if (isFromSameDomain()) {
            const modal = document.querySelector(CONFIG.TARGET_WIDGET)?.closest(CONFIG.MODAL_ID);
            console.log('checkConditionsAndDisplay modal value : ', modal);
            if (modal) modal.style.display = "none";
            return;
        }

        // Vérifier si c'est la première visite de la session
        const firstVisit = sessionStorage.getItem(CONFIG.SESSION_KEY);
        if (firstVisit !== null) return;

        // Vérifier le consentement
        if (!hasValidConsent()) return;
        
        // Première visite et consentement valide, afficher le popup après un délai
        setTimeout(() => {
            sessionStorage.setItem(CONFIG.SESSION_KEY, "1");
            console.log('session viqsite number key :',sessionStorage.getItem(CONFIG.SESSION_KEY));
            displayWidget();
        }, CONFIG.POPUP_DELAY);
    };

    // Exécuter la vérification lorsque DOM est prêt
    dmAPI.runOnReady('DudaReadyDOM', checkConditionsAndDisplay);
};
