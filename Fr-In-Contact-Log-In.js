const names = document.querySelectorAll('h1');
const data = {};
names.forEach((t, i) => {
    if (i % 2 === 0 && names[i + 1]) { // Vérifie que l'élément suivant existe
        const key = t.textContent.trim();
        const value = names[i + 1].textContent.trim();
        if (!isNaN(key) && !isNaN(parseFloat(key))) {
            data[value] = key;
        } else {
            data[key] = value;
        }
    }
});
const isValidNumber = (str) =>  !isNaN(str) && !isNaN(parseFloat(str));
Object.keys(data).forEach((key) => {
    (isValidNumber(data[key]) && !data[key].startsWith('0')) && (data[key] = '0' + data[key]);
});
// Data conatct log
console.log(data);
