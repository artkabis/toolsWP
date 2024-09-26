const timeZoneOffsets = {
    971: { offset: -4, country: "Guadeloupe" },
    972: { offset: -4, country: "Martinique" },
    973: { offset: -3, country: "Guyane" },
    974: { offset: 4, country: "Réunion" },
    975: { offset: -2, country: "Saint-Pierre-et-Miquelon" },
    976: { offset: 3, country: "Mayotte" },
    984: { offset: 5, country: "Un autre DOM" },
    986: { offset: 12, country: "Wallis-et-Futuna" },
    987: { offset: -10, country: "Polynésie française" },
    988: { offset: 11, country: "Nouvelle-Calédonie" }
};
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
function isDST(date = new Date()) {
    const january = new Date(date.getFullYear(), 0, 1);
    const july = new Date(date.getFullYear(), 6, 1);
    const januaryOffset = january.getTimezoneOffset();
    const julyOffset = july.getTimezoneOffset();
    
    return date.getTimezoneOffset() < januaryOffset;
}
function getAdjustedTime(offset) {
    const currentTime = new Date();
    const dstOffset = isDST() ? 2 : 1;
    const adjustedTime = new Date(currentTime.getTime() + (offset - dstOffset) * 60 * 60 * 1000);
    return formatTime(adjustedTime);
}
function injectTimeDiv(currentTime, adjustedTime = null, country = null) {
    let timeDiv = document.getElementById('timeDiv');
    
    if (!timeDiv) {
        timeDiv = document.createElement('div');
        timeDiv.id = 'timeDiv';
        timeDiv.style.position = 'fixed';
        timeDiv.style.bottom = '0';
        timeDiv.style.left = '0';
        timeDiv.style.padding = '10px';
        timeDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        timeDiv.style.color = 'white';
        timeDiv.style.fontSize = '14px';
        timeDiv.style.zIndex = '9999';
        document.body.appendChild(timeDiv);
    }
    
    let content = `Heure actuelle :<br><span style="color: #0086ff;font-size: 2em;font-weight: bold;">${currentTime}</span>`;
    if (adjustedTime) {
        content += `<br><span>Heure locale ${country}: </span><br><span style="color: #ff0000;font-size: 2em;font-weight: bold;"> ${adjustedTime}</span>`;
    }
    timeDiv.innerHTML = content;
}

document.querySelectorAll('.input-group').forEach(item => {
    if (item?.querySelector('.input-group-addon')?.innerText?.includes('CodePostal')) {
        console.log('Code postal trouvé');
        const inputCP = item.querySelector('input');
        const inputCPVal = Number(inputCP.value);
        const inputCPValStr = inputCPVal.toString();
        let inputCPValLocal = null;
        let countryName = null;
        for (const code in timeZoneOffsets) {
            if (inputCPValStr.startsWith(code)) {
                inputCPValLocal = timeZoneOffsets[code].offset;
                countryName = timeZoneOffsets[code].country;
                break;
            }
        }

        const currentTime = formatTime(new Date());
        if (inputCPValLocal !== null) {
            console.log(`Code postal ${inputCPVal} correspond à la zone horaire : ${inputCPValLocal}`);
            const adjustedTime = getAdjustedTime(inputCPValLocal);
            injectTimeDiv(currentTime, adjustedTime, countryName);
        } else {
            console.log(`Aucune zone horaire trouvée pour le code postal ${inputCPVal}`);
            injectTimeDiv(currentTime);
        }
    }
});
