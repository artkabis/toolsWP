
   //Warning submit form > unactiv reCAPTCHA
    ($('.gform_wrapper').length) && (()=>{
        console.log('session noCheckRecaptcha : ',sessionStorage.getItem('noCheckRecaptcha'),'session noCheckRecaptcha parse : ',JSON.parse(sessionStorage.getItem('noCheckRecaptcha')));
        const addWarning = ()=>{
                console.log('add warning');
                $('#pj-cookies-gdpr').append('<div id="infoNoRecaptcha" style="background: #bb213a;color: white;padding:15px;margin-top:20px">Attention !!! Afin que votre message puisse être envoyé, vous devez accepter les mentions liées à Google reCAPTCHA.</div>');
                $('#pj-cookie-captcha').css({color: 'red',fontSize:'120%'});
        };
        (JSON.parse(sessionStorage.getItem('noCheckRecaptcha'))) && (addWarning(),console.log('nocheck run warning'));
         $('#pj-cookie-captcha').on('click',()=> (JSON.parse(sessionStorage.getItem('noCheckRecaptcha'))) && sessionStorage.removeItem('noCheckRecaptcha'));
        
        $('.gform_wrapper input[type="submit"]').on('click',function(me){
            const subm = $(this);
            const isRecaptchaHidden = subm.parents('form').find('.ginput_recaptcha').parent().hasClass('gfield_visibility_hidden');
            console.log('isRecaptchaHidden : ',isRecaptchaHidden);
            (isRecaptchaHidden) && sessionStorage.setItem('noCheckRecaptcha','true');
            
        });
        
    })();
