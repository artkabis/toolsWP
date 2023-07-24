(($)=>{
    const formatDate=(date)=>new Date(date).toISOString().slice(0, 10);
    
    // Vous pouvez définir votre période de congés 
    // en indiquant la date de début (en première position) 
    // et la date de fin en seconde position ->>>
    const datesCP = {cp1:[formatDate('2023-07-01'),formatDate('2023-07-26')]};


    $(window).on('load',function(e){
        const today = formatDate(new Date()); // Obtient la date du jour au format ISO (YYYY-MM-DD)
        const isDateInRange = (date, startDate, endDate) => date >= startDate && date <= endDate;
    
        console.log(today,datesCP,isDateInRange(today,datesCP.cp1[0], datesCP.cp1[1]));
        if (isDateInRange(today, datesCP.cp1[0], datesCP.cp1[1])) {
            console.log('add')
            const store = $('div[data-element-type="ec_store"]');
            (store) && (store.parent().css('position','relative'),store.before(`
            <span style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.70);z-index: 9;" class="overlayShopDisable">
                <span class="textContentOverlay" style="position: absolute; width: 100%; padding: 30px; color: white;text-align: center; font-size: 3em; left: 50%; top: 0%; transform: translate(-50%, 0%);">
                    Nous sommes actuellement en période de congés depuis le <span style="color: rgba(127,201,167,1)">${datesCP.cp1[0].split('-').reverse().join ('/')}</span> et nous serons ravis de vous retrouver dès notre retour le <span style="color: rgba(127,201,167,1)">${datesCP.cp1[1].split('-').reverse().join ('/')}</span>.
                </span>
            </span> `));
        }
    });
})(jQuery);
