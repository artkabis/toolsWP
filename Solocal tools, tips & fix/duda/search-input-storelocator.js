const btnSearch = $('div.SOMS_customInputSearchContainer div.SOMS_customBtnSearch')
if (btnSearch) {
    const inputForSearch = $('div.SOMS_customInputSearchContainer input[type="text"]');
    btnSearch.on('click', () => {
        const urlTarget = "https://agence.europcar-sudouest.fr/search?query=" + inputForSearch.val().toString().replace(' ', '+')
        console.log(urlTarget)
        window.open(urlTarget, "_blank")
    })
    inputForSearch.on('keypress',function(e){
        console.log(e,e.key);
        (e.which === 13) && btnSearch.trigger('click');
    });
}
