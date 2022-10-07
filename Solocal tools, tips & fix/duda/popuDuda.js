
const dateD = new Date('october 07 2022'); // date du debut d'affichage
const dateF = new Date('october 29 2022'); // date du fin d'affichage
const dateJ = new Date(); //date du jour



if (dateJ >= dateD && dateJ <= dateF && $('.btnPopup').length > 0) {
    // trigger sur btnPopup pour l'ouvrir et remove ensuite de celui-ci
    setTimeout(function() {
        $('.btnPopup').click();
        $('.btnPopup').remove();
    }, 500);
}
