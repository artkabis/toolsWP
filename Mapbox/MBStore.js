
var data;
      /**
       * Attribuez un identifiant unique à chaque store. 
       * Vous utiliserez cet identifiant plus tard pour associer 
       * chaque point de la carte à une liste dans la barre latérale.
      */
console.log(stores)
      stores.features.forEach(function(store, i){
        store.properties.id = i;
      });

      /**
       * Attendez que la carte se charge pour lui apporter des modifications.
      */
      map.on('load', function (e) {
        /** 
         * C'est là que votre '.addLayer()' était, 
         * au lieu d'ajouter uniquement la source sans styliser un calque
        */
        map.addSource("places", {
          "type": "geojson",
          "data": stores
        });

        /**
         * Ajoutez toutes les éléments à la page:
         * - Les listes d'emplacements situés dans la sidebar (à gauche de l'écran)
         * - Les marqueurs sur la carte
        */
        buildLocationList(stores);
        addMarkers();
      });

      /**
       * Ajoutez un marqueur à la carte pour chaque fiche de store.
      **/
      function addMarkers() {
        /* Pour chaque entité de l'objet GeoJSON ci-dessus: */
        stores.features.forEach(function(marker) {
          /* Créez un élément div pour le marqueur. */
          var el = document.createElement('div');
          /* Attribuez un identifiant unique au marqueur. */
          el.id = "marker-" + marker.properties.id;
          /* Attribuez la classe `marker` à chaque marqueur pour son futur style. */
          el.className = 'marker';
          
          /**
           * Créer un marqueur avec la div défini au dessus afin de l'ajouter à la carte.
          **/
          new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

          
          /**
           * On écoute l'événement click de l'élément afin de gérer ces trois choses:
           * 1. Se déplacer sur le bon point
           * 2. Ferme tous les autres popups et affiche le popup lié au magasin cliqué
           * 3. Highlight listing in sidebar (and remove highlight for all other listings)
          **/
          el.addEventListener('click', function(e){
            console.log('au click des Markers');
            console.log('marker >> ',marker);
            console.log('marker.properties.id >> ',marker.properties.id);
            /* Déplacement vers le bon point géographique */
            flyToStore(marker);
            /* Fermeture de toutes les popup ouvertes 
            * et affichage de celle liée à l'élément cliqué
            */
            createPopUp(marker);
            /* Mise en évidence de la liste de la slidebar */
            var activeItem = document.querySelector('.listings .active');
            e.stopPropagation();
            if (activeItem && activeItem[0]) {
              activeItem[0].classList.remove('active');
            }
            var listing = document.getElementById('listing-' + marker.properties.id);
            listing.classList.add('active');
          });
        });
      }

      /**
       * Ajout du listing via la boucle sur les éléments du store de la sidebar .
      **/
      function buildLocationList($data) {
        data = $data;
        data.features.forEach(function(store, i){
          /**
           * Accès raccourcie à la propriété du store afin de la réutiliser plus tard
          **/
          var prop = store.properties;

          /* Rattachement du listing dans une variable pour la lier à la sidebar. */
          var listings = document.getElementById('listings');
          var listing = listings.appendChild(document.createElement('div'));
          /* Assignation d'un id unique au listing*/
          listing.id = "listing-" + prop.id;
          /* Assigne la classe 'item' dans le listing afin de gérer le style css*/
          listing.className = 'item';

          /* Ajout des liens au listing créé précédement */
          var link = listing.appendChild(document.createElement('a'));
          link.href = '#';
          link.className = 'title';
          link.id = "link-" + prop.id;
          link.innerHTML = prop.title;

          /* Ajout des details du kisting lié aux store */
          var details = listing.appendChild(document.createElement('div'));
          details.innerHTML = prop.address;
          if (prop.size) {
            details.innerHTML += ' · ' + prop.size +" m²";
          }


          /**
          * Ajout d'un écouteur au click des liens :
           * 1. mise à jour du currentFeature en fonction du "store" associé cliqué
           * 2. Déplacement vers le bon point (via les coordonées géographiques)
           * 3. Fermeture de la popup ouverte et ouverture de celle rattachée à l'élément cliqué
           * 4. Mise en évidence de la liste de la slidebar (et suppression de la mise en évidence précédente) 
          **/
          link.addEventListener('click', function(e){
            for (var i=0; i < data.features.length; i++) {
              if (this.id === "link-" + data.features[i].properties.id) {
                console.log('au click d\'un lien de la sidebar');
                
                var clickedListing = data.features[i];
                console.log('clickedListing >> ',clickedListing)
                console.log('marker.properties.id >> ',clickedListing.properties.id);
                flyToStore(clickedListing);
                createPopUp(clickedListing);
              }
            }
            var activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
              activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');
          });
        });
      }
      /**
       * Utilisation de flyTo (bibliothèque Map box js) pour centrer la caméra sur le bon
       * point avec un effet "smooth"  
      **/
      function flyToStore(currentFeature) {
        console.log('Déplacement vers le point : ',currentFeature.geometry.coordinates,'  au zoom de : ',currentFeature.geometry.zoom)
        map.flyTo({
          center: currentFeature.geometry.coordinates,
          zoom:  currentFeature.geometry.zoom
        });
      }
      /**
       * Creation de la popup  Maxbox GL JS `.
      **/
//fonction d'ajout d'espace tous les 3 chiffres
function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
var urlImages=[];
//fonction permettant de dynamiser la création des option du select avec les données de l'objets modeles
var createModels = function( mods){
  var str=``;//création template string
  // On préparre la boucle avec les datas pour générer les option du select dans le DOM
  for (const property in mods) {
    var modele = property; // la property créée comporte le nom de l'objet(ici le modèle), mods est rattaché à l'objet modele
    urlImages=mods[property][1];// mods[property] renvoi donc la valeur lié au nom de l'élément dans l'objet, le [1] à l'url de l'image
    //console.log('urlImages>>>>>>>>>',urlImages);
    var prices=mods[property][0];// mods[property] renvoi donc la valeur lié au nom de l'élément dans l'objet, le [0] aux prix
const plan = mods[property][2]
    str += `<option data-img="${urlImages}" data-price="${prices}" value="${modele}" data-plan=${plan}>${modele.toUpperCase()}</option>`;
  }
  return str;//on retourne la chaine créée à chaque itération de la boucle dans le DOM
}
let popup;
function createPopUp(currentFeature) {   
  
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();
  var fraisTerrain = 10;
  var imgBig = (''+currentFeature.properties.image).replace('_thumb','');
  var imgThumb = currentFeature.properties.image;
  console.log(imgBig,imgThumb);
console.log({modeles})
  popup = new mapboxgl.Popup({closeOnClick: true})
  .setLngLat(currentFeature.geometry.coordinates)
  .setHTML(`<span class="closePopup">X</span>
            <h4><a title="Visiter le site de la ville d'${currentFeature.properties.city}" href="${currentFeature.properties.link}">${currentFeature.properties.title}</a></h4>
            <div class="poster"><a data-fancybox="images" class="fancy" href="${imgBig}"><img src="${imgThumb}" /></a></div>
            <div class="description">${currentFeature.properties.description}</div>
            <div class="listeModel">
              <select name="modeleList" id="modeleSelect">${createModels(modeles)}</select>
            </div>
            <div class="price">${currentFeature.properties.price}</div>
            <div class="plan"></div>
  `).addTo(map);

  let dropdown = document.querySelector('#modeleSelect');
  if (dropdown) dropdown.addEventListener('change', function(event) {
    var uid = parseInt(this.options[this.selectedIndex].getAttribute('data-price'),10);
    var images = this.options[this.selectedIndex].getAttribute('data-img');
    var imagesBig = (''+images).replace('_thumb','');
    var plan = this.options[this.selectedIndex].getAttribute('data-plan');
console.log('____________',{plan})
    var jsonPrice =  parseInt((''+currentFeature.properties.price).replace(/\s+/g, '').split('€')[0],10);
    
    var frais = jsonPrice * fraisTerrain /100;//10% du prix du terrain
    var price =uid+jsonPrice+frais;//on calcule le prix final : modèle + terrain + frais
    //on ajoute le prix avec la gestion des espaces  tous les  3 chiffres et ",00 €"
    document.querySelector('.price').innerHTML=(numberWithSpaces(price)+',00 €');

//Ajout du lien vers le plan : 
  document.querySelector('.poster .fancy').setAttribute('href',plan);
    //console.log('urlImages >>  ',urlImages,'      this.options[this.selectedIndex] >> ',this.options[this.selectedIndex], 'this.selectedIndex >> ',this.selectedIndex); 
    document.querySelector('.poster a').setAttribute('href',plan);//plan pour lighbox du plan, imagesBig pour l'image un taille réelle
    document.querySelector('.poster img').setAttribute('src',images);
  });
}
$("a.fancy").fancybox();
$(document).on('click','.closePopup',function(){
    console.log('click close popup : ',{popup})
    popup.remove();
})
