$(window).on('load',function(){
    const env = dmAPI.getCurrentEnvironment();
    if (env !== 'editor') {
        //Correction de gestionnaire d'attribut alt du widget Cards
        const images = document.querySelectorAll('div[data-title="Cards Overlay"] img.image-taille');
        images.forEach((img) => {
            const imgAttributes = img.outerHTML;
            const altMatch = imgAttributes.match(/alt="([^"]*)"/);
            if (altMatch) {
                const malformedAltMatch = imgAttributes.match(/alt="[^"]*" (.*)onerror/);
                if (malformedAltMatch) {
                    let combinedAlt = (altMatch[1] + " " + malformedAltMatch[1]).replace(/d&#x27;/g, "d'").replace(/&quot;/g, '').replace(/=[""]/g, '').replace(/="" /g, ' ').replace(/"/g, '').trim();
                    img.alt = combinedAlt;
                    const attrNames = malformedAltMatch[1].split(' ').map(attr => attr.split('=')[0]).filter(Boolean);
                    attrNames.forEach(attrName => {img.removeAttribute(attrName)});
                }
            }
        });
    } 
});
