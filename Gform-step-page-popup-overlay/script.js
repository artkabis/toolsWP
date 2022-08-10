$( ".grey-aide a").on( "click", function(){
   if(sessionStorage.getItem('formIsVisible')=="true"){
      $( "#devis" ).removeClass("devis-visible");
      $( "#overlay" ).removeClass("overlay-visible");
      sessionStorage.setItem('formIsVisible',false);
  }else if(sessionStorage.getItem('formIsVisible')=="false" || sessionStorage.getItem('formIsVisible')=== null){
      $( "#devis" ).addClass("devis-visible");
      $( "#overlay" ).addClass("overlay-visible");
      sessionStorage.setItem('formIsVisible',true);
  }
});



$(window).on("load", function (event) {
  if(sessionStorage.getItem('formIsVisible') !== null){
      (sessionStorage.getItem('formIsVisible')=="true") ? sessionStorage.setItem('formIsVisible',false) : sessionStorage.setItem('formIsVisible',true);
      $( ".grey-aide a" ).trigger( "click");
  }
});
$('.overlay').on('click',function(me){
  $( "#devis" ).removeClass("devis-visible");
  $( "#overlay" ).removeClass("overlay-visible");
  sessionStorage.setItem('formIsVisible',false);
});
