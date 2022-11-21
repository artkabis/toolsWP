    //Warning submit unactiv reCAPTCHA
    ($('.dmform-wrapper').length) && (()=>{
        console.log('form detected');
        $('.dmform-wrapper input[type="submit"]').on('click',function(me){
            console.log('click submit');
            const subm = $(this)
            const isRecaptcha = subm.parents('form').find('.g-recaptcha').length;
            console.log('isRecaptcha',isRecaptcha);
            (!isRecaptcha) && (()=>{
                console.log('add warning');
                $('div[mock="uc-recaptcha-mock"]').append('<div id="infoNoRecaptcha" style="background: #bb213a;color: white;padding:15px">Attention !!! Afin que votre message puisse être envoyé, vous devez accepter les mentions liées à Google reCAPTCHA.</div>');
                $('div[mock="uc-recaptcha-mock"] a').last().css({color: 'red',fontSize:'120%'});
            })();
        });
    })();
