/* Exécute une PopUp une fois par site et par session */
$(window).on('load', function () {
    const env = dmAPI.getCurrentEnvironment();
    if (env !== 'editor') {
        const dateDebut = new Date('august 10 2024'); // indiquer la date de début en gardant le même format que l'exemple
        const dateFin = new Date('april 18 2025'); // indiquer la date de fin
        const date = new Date();
        console.log('check date');
        // Vérification de la date 
        if (date >= dateDebut && date <= dateFin) {
            let first_visit = sessionStorage.getItem("first_visit");
            const appConsent = localStorage.getItem("appconsent");
            if (appConsent) {
                const consentData = JSON.parse(appConsent);
                try {

                    if (consentData && consentData.consentstring === null) {
                        console.log('consentement accepte or null');
                        return;
                    } else {
                        console.log('consentement accepte NON null : ', consentData.consentstring);

                    }
                } catch (e) {
                    console.error("Erreur lors de l'analyse de appConsent:", e);
                    return;
                }
                const popupBtn = $(".SOMS_popup-button");
                if (popupBtn?.length && consentData?.consentstring && first_visit == null) {
                        sessionStorage.setItem("first_visit", 1);
                        popupBtn.click().remove();
                }else if (first_visit !== null) {
                    popupBtn.remove();
                }
            }
        }
    }
}); 
