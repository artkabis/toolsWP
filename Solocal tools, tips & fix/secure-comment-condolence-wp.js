if(window.location.pathname.includes('/condolences/')){

    $( "#condolence_message textarea" ).attr( "placeholder", "N'oubliez pas de donner vos coordonnées (nom, prénom, mail) pour la famille" );
    
    
        const condoleances = $('.single-pj_cdl_book .messages');
        condoleances.prepend('<a class="openCondo">Consulter les messages de condoléances<br><strong>[Réservé à la famille]</strong></a>');
        const a = $('#condolence_book .content .name').text().substring(1,3).toLowerCase();
        $('#condolence_book .openCondo').after('<div class="privateCondo"><span class="overlay"></span><div class="privateCondoElem"><input class="inputCondo" type="password" placeholder="Entrez le mot de passe" /><button class="condoBtn">Valider</button></div>');
        $('.privateCondo').fadeOut(0);
        $('.openCondo').on('click',function(me){
            $('.privateCondo').fadeToggle(300).toggleClass('active');
             if($('.commentlist li').length===0 && $('.infoComm').length===0){
                     $('.privateCondoElem').prepend('<br><span style="font-family:Roboto;font-size:12px!important" class="infoComm" >Nombre de commentaire présent : '+$('.commentlist li').length+'.<br> Ce module ne peut donc être affiché.</span>');
                     setTimeout(()=>$('.privateCondo').fadeOut(0),5000);
                }
        });
        function openCondo(){
            const inCondo = $('.inputCondo');
               if(inCondo.val()!==""){
                    if(String(inCondo.val()) == String("30120"+a)){
                        $('.single-pj_cdl_book #messages_list').fadeToggle(300);
                        $('.privateCondo').fadeOut(0);
                    }
                }
    
            
        }
            $('.condoBtn').on('click',function(me){
                openCondo();
        });
        $('.inputCondo').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
              openCondo();  
            }
            event.stopPropagation();
          });
        $('.overlay').on('click',function(me){
            if($('.privateCondo').hasClass('active')){
                $('.privateCondo').fadeToggle(300).toggleClass('active');
            }
        });
}
