const isCondo = window.location.pathname.includes('/condolences');
const publiCondo = $('input[value="Publier"]').length;
const isFormVisible = $('form[name="condolence_message"]').length;
 
//console.log({isCondo},{publiCondo},{isFormVisible});
if(isCondo && !publiCondo && !isFormVisible){
    $('div#messages_form').css({'position': 'fixed','top': '50%','left': '50%','transform': 'translate(-50%,-50%)','background':'white','box-shadow': '0 0 10px rgba(0,0,0,.5)','padding':'80px','font-size':'2.5em'});
    $('#messages_form #reply-title').css({'display':'none'});
    setTimeout(()=>{
      $('#messages_form').fadeOut(500).remove();
    },5000);
}
