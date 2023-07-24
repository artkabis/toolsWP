
(($)=>{

    // Vous pouvez définir votre période de congés 
    // en indiquant la date de début (en première position) 
    // et la date de fin en seconde position ->>>
    const date_debut = '01-07-2023',
          date_fin   = '26-07-2023' 

    

    //Tools 
    const isDateInRange = (date, startDate, endDate) => date >= startDate && date <= endDate;
    const formatDate=(date)=>new Date(date).toISOString().slice(0, 10);
    const reverseDate = (date,sepa, joiner) => date.split(sepa).reverse().join(joiner);
    const datesCP = {start_cp:formatDate(reverseDate(date_debut,'-','-')),end_cp:formatDate(reverseDate(date_fin,'-','-'))};
    
    $(window).on('load',function(e){
        const today = formatDate(new Date()); // Obtient la date du jour au format ISO (YYYY-MM-DD)
        console.log(today,datesCP,isDateInRange(today,datesCP.start_cp, datesCP.end_cp));
        if (isDateInRange(today, datesCP.start_cp, datesCP.end_cp)) {
            const store = $('div[data-element-type="ec_store"]');
            (store) && (store.parent().css('position','relative'),store.before(`
            <span style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.70);z-index: 9;" class="overlayShopDisable">
                <span class="textContentOverlay" style="position: absolute; width: 100%; padding: 30px; color: white;text-align: center; font-size: 3em; left: 50%; top: 0%; transform: translate(-50%, 0%);">
                    Nous sommes actuellement en période de congés depuis le <span style="color: rgba(127,201,167,1)">${date_debut.replaceAll('-','/')}</span> et nous serons ravis de vous retrouver dès notre retour le <span style="color: rgba(127,201,167,1)">${date_fin.replaceAll('-','/')}</span>.
                </span>
            </span> `));
        }
    });
})(jQuery)


