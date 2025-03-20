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
