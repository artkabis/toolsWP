
/**** Woocommerce : isotope en mode slider horizontal avec gestion next & prev (boutons) *****/

/***** CSS a intégrer avant l'utilisation de ce script 
.products_wrapper.isotope_wrapper {
    display: flex;
    flex-wrap: nowrap;
    margin: 0!important;
    overflow: hidden;
}
ul.products {
    position: relative;
    display: inline-flex;
    flex-wrap: nowrap;
    margin: 0!important;
    transition: left 0.3s

}
.woocommerce.columns-4 ul.products li.product {
    min-width: 250px;
    margin: 0!important;
}
button.leftBtn {
    position: absolute;
    top: 50%;
    left: -50px;
}
button.rightBtn {
    position: absolute;
    top: 50%;
    right: -50px;
}

***/

(function($){
$('.woocommerce').prepend('<button class="leftBtn">&lt;</button>')
$('.woocommerce').append('<button class="rightBtn">&gt;</button>')
    var cmp = 0;
    const isoW = $('.isotope-item ').width();
    console.log('width iso : ',isoW);
    $('.leftBtn, .rightBtn').on('click',function(me){
        //const posX = (!$('.products').css('left')) ? 0 : Number($('.products').css('left').split('px')[0]);
       // console.log('posX',posX);
        console.log('btn clicked : ',$(this).attr('class'));
        if( $(this).attr('class')==="rightBtn" ){
            cmp=cmp+1;
            var posR = Number(-isoW)* cmp
            console.log('right',posR,' iso width : ',$('.isotope-item').width(),'  cmp : ',cmp);
            setTimeout(()=>$('.products').css('left',posR+'px'),50);
        }else if($(this).attr('class')==="leftBtn"){
            cmp=(cmp!=0)?cmp-1:0;
            const posL = -Number(isoW)*cmp
            console.log('left',posL,'cmp : ',cmp);
            setTimeout(()=>$('.products').css('left',posL+'px'),50);
        }
    });
})(jQuery);





/************************** Woocommerce pagination des produits et gestion du nombre d'isotope affichable *****/
if($('.woocommerce').length ){
    const nbElementView =8;//Nombre de produits par page
    
    //Calcul du nombre d'items et de pages
    function recalc($woo){
        const items = Number($woo.find('.isotope-item').length);
         return {'nbItems':items,'nbPages': Math.ceil(items /nbElementView)};
    }
    function createNav($woo,id){
        const NAV = `<div class="vc_row wpb_row vc_inner vc_row-fluid"><div class="wpb_column vc_column_container vc_col-sm-4"><div class="vc_column-inner"><div class="wpb_wrapper"><div class="vc_btn3-container vc_btn3-inline" id="btnPrev-${id}">
        	<button class="vc_general vc_btn3 vc_btn3-size-md vc_btn3-shape-rounded vc_btn3-style-modern vc_btn3-color-grey">page précédente</button>	</div>
        </div></div></div><div class="wpb_column vc_column_container vc_col-sm-4"><div class="vc_column-inner"><div class="wpb_wrapper">
        	<div class="wpb_text_column wpb_content_element " id="nbPage-${id}">
        		<div class="wpb_wrapper">
        			<p>0</p>
        
        		</div>
        	</div>
        </div></div></div><div class="wpb_column vc_column_container vc_col-sm-4"><div class="vc_column-inner"><div class="wpb_wrapper"><div class="vc_btn3-container vc_btn3-inline" id="btnNext-${id}">
        	<button class="vc_general vc_btn3 vc_btn3-size-md vc_btn3-shape-rounded vc_btn3-style-modern vc_btn3-color-grey">page suivante</button>	</div>
        </div></div></div></div>`;
        console.log($woo,id);
        if($woo.find('.isotope-item').length>nbElementView){
            
        $woo.after(NAV);
            
            //console.log('page trouvée');
            var counter,nbPage,nbItems;
            function init(){
                counter = 1;
                
                $woo.find('.isotope-item').fadeOut(0);
                $woo.find('.isotope-item:nth-child(-n+'+nbElementView+')').fadeIn(0);
                nbItems = recalc($woo).nbItems;
                nbPages = recalc($woo).nbPages;
                $('#nbPage-'+id+' p').text('1/'+nbPages);
                console.log('nb page : ',nbPages);
                console.log('nb item : ',nbItems);
            }
            init();
            function wooPage($nb){
                nbItems = recalc($woo).nbItems;
                nbPages = recalc($woo).nbPages;
                $('#nbPage-'+id+' p').text($nb+'/'+nbPages);
                console.log('nb : ',$nb);
                targetNb = ($nb*nbElementView);//*10;
                targetEnd = Number(targetNb)+1;
                targetBefore = targetNb-nbElementView;
                //console.log('a afficher à partir de : ',targetNb, ' caché avant : ',targetBefore,'  fin à cacher : ',targetEnd);
                $woo.find('.isotope-item:nth-child(-n+'+targetNb+')').fadeIn(0);
                ($nb>1)&&$($woo).find('.isotope-item:nth-child(-n+'+targetBefore+')').fadeOut(0);
                $woo.find('.isotope-item:nth-child(n+'+targetEnd+')').fadeOut(0);
            }
            
            $('#btnNext-'+id).on('click',function(me){
                counter++;
                console.log('click next : ',$(this).attr('id'),counter);
                if(counter>nbPages) {
                    wooPage(1);
                    counter=1;
                   }else{ wooPage(counter);}
            });
            $('#btnPrev-'+id).on('click',function(me){
                counter--;
               if(counter<1) {
                    wooPage(nbPages);
                    counter=nbPages;
                   }else{ wooPage(counter);}
            });
        }
    }
    $('.woocommerce').each(function(i,t){
        createNav($(this),i);
    });
}




// Traduction contenue champ expédition du panier
const contentExpedition = $('.woocommerce-shipping-totals td[data-title="Expédition"]');
contentExpedition.text().includes('Shipping costs are calculated') && contentExpedition.text('Les frais de port sont calculés lors du paiement.');










/********************* Gestion de l'affichage des options du formulaire de la page rideaux en fonction du lien cliqué - récupération du type de rideaux pour afficher la bonne option dans le select et simuler le changement pour la prise en compte des conditions logique Gforms *****/
$(window).on('load',function(){
    $('.SOMS_bloc-surmesure_ul li').each(function(i,t){
        const liValue = $(this).text();
        console.log(liValue);
        switch(liValue){
            case "Rideaux chenilles (devis)" : 
                $(this).find('a').addClass('liForm-chenilles');
            break;
            case "Rideaux perles (devis)": 
                $(this).find('a').addClass('liForm-perles');
            break;
        }
    });
    $('.liForm-chenilles').on('click',function(me){me.preventDefault;window.sessionStorage.setItem('form_rideaux_type','form_chenilles')});
    $('.liForm-perles').on('click',function(me){me.preventDefault;window.sessionStorage.setItem('form_rideaux_type','form_perles')});
    const hrefPage = window.location.href;
    console.log(hrefPage);
    if(hrefPage.includes('/rideaux/#form-rideaux') ){
        console.log('page form target');
        if(window.sessionStorage.getItem('form_rideaux_type') === 'form_chenilles'){
            $('select#input_11_18 option').each(function(i,t){
                ($(this).val().includes('Rideaux Chenilles')) && $(this).attr('selected','selected').trigger('change');
            });
        }
        if(window.sessionStorage.getItem('form_rideaux_type') === 'form_perles'){
            $('select#input_11_18 option').each(function(i,t){
                ($(this).val().includes('Rideaux Perles')) && $(this).attr('selected','selected').trigger('change');
                });
        }
    }
});
