import {randomMM as random, isNotUndefined, checkInvalid, convertDate2fr} from 'https://rawcdn.githack.com/artkabis/toolsWP/d6cbb834bb88dea3ed100db2e7cd1c6c7025949f/es10/utils.mjs';


  
  /**************
  -
  - Constantes de paramétrage liées au nombre d'avis devant être visibles dans l'app
  -
  ***************/
export const pjReviewsApp = async ({idClient='',nbReviews=null,containerReviews=''}) =>{
  //Vous pouvez donner un nombre limite d'avis en modifiant cette variable (10 par exemple), si null, tous les avis seront affichés.
(function($){  
if ($(containerReviews).length && idClient && containerReviews) {
    let rates = [],isRatings = !1, reply = [{comment: '',date: '',id: 0}],i =0,j=0;
    //SVG bg random placement
    const blob = `<svg class="blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path fill="#F2F4F8" d="M17.8,-30.5C20,-22.8,16.7,-13.6,24.2,-4.6C31.6,4.4,49.7,13.2,54.4,23.4C59,33.6,50.1,45.2,38.8,56.3C27.5,67.4,13.8,78,-2.4,81.3C-18.5,84.6,-37.1,80.6,-46.1,68.8C-55.2,56.9,-54.7,37.3,-60.2,19.7C-65.6,2.2,-76.9,-13.2,-74.7,-25.6C-72.5,-38,-56.9,-47.4,-42.2,-51C-27.5,-54.7,-13.7,-52.6,-3,-48.5C7.8,-44.4,15.5,-38.2,17.8,-30.5Z" transform="translate(100 100)" />
    </svg>`;

    // API call request to return data reviens
    const  api_get = async (url = '') =>{
      const response = await fetch(url, {dataType: 'json',headers: {'x-apikey': 'aoCYbV2bu8Gllj33DWqa6ECc1I6vrRQA'}}).catch((error) => {console.error('Error:', error)});
      const result = await response.json();
      return result;
    }
    $('#PJ-review-container').before(`<a class="new-review pj-link" href="https://www.pagesjaunes.fr/contribution/avis/${idClient}" target="_blank"><span class="fa fa-pencil"></span><span class="value">Ecrire un avis</span></a>`);//Add reviews button for adding a new review to pj pro

    const api_call = 'https://api.pagesjaunes.fr/v1/pros/' + idClient + '/reviews';//Create url for api call
    const resultJsonReview = api_get(api_call);
    const reviews = resultJsonReview.reviews;//data reviews
    //console.log('reviews : ',reviews);

    const nbReviewsLoop = !checkInvalid(nbReviews) ? nbReviews : reviews.length;//Si nbReviews vaut null alors l'ensemble des avis seront visibles, sinon le nombre d'avis limité

    let forces=[];
    for (i = 0;i < nbReviewsLoop;i++) {
      var contentRating = '';
      // overall_rating détecté, boucle pour générer les étoiles de notation
      for (j = 0;j < Number(reviews[i].overall_rating);j++) {contentRating += '<span class="filled fa fa-star"></span>';}

      //Ajout des critères de notation
       (reviews[i].ratings != undefined) && reviews[i].ratings.forEach( (rate, index) => rates.push('<div class="containerRatings"><span class="critere">' + rate.criteria + '</span> <span class="note"> ' + rate.score + '/5</span></div>'));    

      //Détéction de la valeur de overall_rating, si egale à 5, renvoi de cette valeur à la notation des critères
      forces =(reviews[i].strength && reviews[i].overall_rating === 5) ? reviews[i].strength : '';
      const isRatings = isNotUndefined(reviews[i].ratings);
      const isStrength = isNotUndefined(reviews[i].strength);
      var newRates = '';

      isRatings ? rates.forEach((el, i) => newRates += el) : (rates = [], newRates = '');
      //Construction des titres puis wrap du lien rattaché à cette avis via l'id
      const title = (reviews[i].title) ? `<h2 class="title"><p><a href="https://www.pagesjaunes.fr/pros/04761024#Avis-${reviews[i].id}">${reviews[i].title}</h2></p></a>` : '';
      //Contruction du DOM et ajout des datas récupérées via le fetch
      $('#PJ-review-container').append(`
            <div class="pj-content-${i}">${blob}
              <div class="pj-left">
                <div class="pj-head">
                  <div class="content-head">
                    <div class="pj-date">Publié le <strong>${convertDate2fr(reviews[i].date_creation)}</strong></div>
                    <div class="pj-rating">${reviews[i].overall_rating}/5 </div>
                    <div class="content-rating">${contentRating}
                      <div class="norating">
                        <span class="filled fa fa-star"></span>
                        <span class="filled fa fa-star"></span>
                        <span class="filled fa fa-star"></span>
                        <span class="filled fa fa-star"></span>
                        <span class="filled fa fa-star"></span>
                      </div>
                    </div>
                  </div>
                </div>
              <div class="pj-title">${title}</div>
              <div class="pj-comment-${i}">
                <i class="fas fa-quote-left"></i>${reviews[i].comment}
              </div>
              <div class="pj-reply"><div class="comment-reply"></div></div> 
          </div>
          <div class="pj-right">
            <div class="category">Catégorie : <span class="title-category">${reviews[i].category_name} </span></div>
               ${isStrength ? `<div class="rating">${ String(forces).split('\r\n').map((t)=>{return '<div class="containerRatings fullRating">'+t+'</div>'}).join('')}</div>` : ""}
              ${isRatings && !isStrength ? `<div class="rating">${String(rates).split(',').join('') }</div>` :""}
            </div>
          </div>`);
      //détection d'une reponse aux avis et ajout dans le DOM
      isNotUndefined(reviews[i].right_of_reply) && $('.pj-content-' + i + ' .comment-reply').append('<div class="reply"><span class="iconReply" title="voir la réponse du professionnel" id="toggleReply-' + i + '"><i class="fas fa-comment-dots"></i></span><div class="container-comment active"><div class="comment">' + reviews[i].right_of_reply[0].comment + '</div><div class="comment-date">' + convertDate2fr(reviews[i].right_of_reply[0].date_creation) + '</div></div>');
    }
    $('.fullRating').append('<span class="note"> 5/5</span>');// Si fullRating est présent (note de 5/5), alors nous pouvons formater le span note
    // Gestion de l'affichage des réponses annonceur
    $('.comment-reply .iconReply').on('click', function (me) {
      $(this).next().fadeToggle(300).toggleClass('active');
    });
    //Affichage et placement du blob avec une rotation aléatoirement
    $('div[class^="pj-content-"]').each(function (i, t) {
      $(this).find('.blob').css({transform: 'translateY(-50%) rotate(' + random(0, 360) + 'deg)',transformOrigin: 'center center'});
    });
    //Afficher les réponses client par défaut
    $('.comment-reply').each(function(i,t){
      $(this).addClass('active');
      $(this).find('.container-comment').fadeIn(0);
    });
  }//End (détection de pj-review-container)
})(jQuery);
}
