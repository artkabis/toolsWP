


CSS utilisé : 

/***************** Slider  ******/
    .slider{
        overflow:hidden;
				max-width: 100%!important;
    }
    .containerSlider{
        display:flex;
        flex-wrap:nowrap;
        overflow:hidden;
        width:calc(100% * 3)!important;
        position: relative;
        transition: all 1s;
    }
    .slide{
				position: relative;
        width: 100%!important;
        min-height:400px;
			  display: block!important;
    }
    .titreSlide{
        
    }


Javascript :
  (($)=>{
  
 const model = 
 {
    
    "jardinage" : {
        "promo-1": {
        	"titre" : "titre 1",
        	"date" : "du 05/10/2023 au 30/10/2023",
          	"contenu": "",
          	"image": "/wp-content/uploads/2023/10/AST6563484-XL-1.jpg"
        },
        "promo-3": {
        	"titre" : "titre 2",
        	"date" : "du 05/10/2023 au 30/10/2023",
          	"contenu": "",
          	"image": "/wp-content/uploads/2023/10/AST6563484-XL-1.jpg"
        },
      	"promo-4": {
        	"titre" : "titre 3",
        	"date" : "du 05/10/2023 au 30/10/2023",
          	"contenu": "",
          	"image": "/wp-content/uploads/2023/10/AST6563484-XL-1.jpg"
        } 
     }
 }
 const templateSlider =(nbSlide) =>{
   return `
      <div class="slider">
        <div class="containerSlider" data-nb-slide="${nbSlide}">
        </div>
      </div>`
 };
  
 const creatSlider = (title, date,contenu,image,id) =>{
	return `
            <div class="slide" id="slide-${id}" style="background-image:url('${image}');background-size: cover;background-repeat: no-repeat;">
                <div class="titreSlide">
                    <h3>${title}</h3>
					${contenu ? '<div class="contentSlider">'+contenu+'</div>' :''}
                    <div class="dateInfos">
                        ${date}
                    </div>
                </div>
            </div>`;
 }
  const animSlide =(slider)=>{
    const duree_animation = 4;//en secondes
  	const nbSlides = slider.find('.slide').length;
    slider.attr('data-nb-slides',nbSlides);
    let cmp=0;
    let posX=[];//0,33.33333,66.6666,100
    // Calculer les pourcentages de positionnement
    for (let i = 0; i < nbSlides; i++) {
      const pourcentage = -(i / (nbSlides)) * 100 * 1;
      posX.push(pourcentage);
    }
    setInterval(function(){
      cmp++;
      if(cmp<nbSlides){
        $('.containerSlider').css({'transform':`translateX(${posX[cmp]}%)`,'transition': 'all cubic-bezier(0.68, -0.55, 0.27, 1.55) 1s'});
        console.log('css left next >> ',$('.containerSlider').css('transform'));
      }else if(cmp==nbSlides){
        cmp=0;
        $('.containerSlider').css({'transform':`translateX(${posX[cmp]}%)`,'transition': 'all cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.5s'});
      }
    },duree_animation *1000);
  }

 if(window.location.pathname.includes("jardinage")){
   $('.brator-product-shop-page-area .container-xxxl').before(templateSlider);
     let id = 0;
    for (const promoKey in model.jardinage) {
        if (model.jardinage.hasOwnProperty(promoKey)) {
            id++;
        	const promo = model.jardinage[promoKey];
			$('.brator-product-shop-page-area').find('.containerSlider').append(creatSlider(promo.titre,promo.date, promo.contenu,promo.image, id));
            animSlide($('.brator-product-shop-page-area').find('.slider'));
    	}
  	}
 }
})(jQuery);
