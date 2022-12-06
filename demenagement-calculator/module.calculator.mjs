import * as jQuery from 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js';
import * as jQueryui from 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js'
import * as calc from 'https://rawcdn.githack.com/artkabis/toolsWP/b2154687760ca3b152066029ceb912aa48057b08/demenagement-calculator/sources/calculator.min.js'





/****
** online WP implementation : https://www.provence-demenagement.com/testing-calculator/
** For view calculateur segment page : add this script in your console (F12) & keypress "Enter"->
document.querySelector('#gform_page_49_1').style.display="none";
document.querySelector('#gform_page_49_3').style.display="block"
***/

// loading libs necessary working for the calculator : jquery, jqueryui, calc (sum)
/*async () => {
  try{
    let parsej = await require("https://unpkg.com/jquery@3.6.0/dist/jquery.js");
    let parsejui = await require("https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js");
    let calc = await require("https://rawcdn.githack.com/artkabis/toolsWP/b2154687760ca3b152066029ceb912aa48057b08/demenagement-calculator/sources/calculator.min.js");
    console.log('libs chargées');
    
  }catch(e){
    console.log('error :',e);
  }
})()

*/

const datas =[
    {
        "categorie": "cuisine",
        "name": "frigo",
        "content/img": "refrigerateur.png",
        "content/title": "Réfrigirateur",
        "content/val": 0.5
    },
    {
        "categorie": "cuisine",
        "name": "frigo-top",
        "content/img": "refrigerateur-top.png",
        "content/title": "Réfrigirateur top",
        "content/val": 1
    },
    {
        "categorie": "cuisine",
        "name": "frigo-am",
        "content/img": "refrigerateur-americain.png",
        "content/title": "Réfrigirateur américain",
        "content/val": 2.5
    },
    {
        "categorie": "cuisine",
        "name": "four",
        "content/img": "four.png",
        "content/title": "Four",
        "content/val": 0.5
    },
    {
        "categorie": "cuisine",
        "name": "microonde",
        "content/img": "micro-onde.png",
        "content/title": "Micro-onde",
        "content/val": 0.3
    },
    {
        "categorie": "cuisine",
        "name": "gaziniere",
        "content/img": "gaziniere.png",
        "content/title": "Gazinière",
        "content/val": 0.5
    },
    {
        "categorie": "cuisine",
        "name": "plaque-cuisson",
        "content/img": "plaque-de-cuisson.png",
        "content/title": "Plaque de cuisson",
        "content/val": 0.5
    },
    {
        "categorie": "cuisine",
        "name": "meuble-haut-1",
        "content/img": "meuble-haut-cuisine-1.png",
        "content/title": "Meuble haut ou bas cuisine <br/>(1 porte)",
        "content/val": 0.5
    },
    {
        "categorie": "cuisine",
        "name": "meuble-haut-2",
        "content/img": "meuble-haut-cuisine-2.png",
        "content/title": "Meuble haut ou bas cuisine <br/>(2 portes)",
        "content/val": 1
    },
    {
        "categorie": "cuisine",
        "name": "meuble-haut-3",
        "content/img": "meuble-haut-cuisine-3.png",
        "content/title": "Meuble haut ou bas cuisine <br/>(3 portes)",
        "content/val": 1.5
    },
    {
        "categorie": "cuisine",
        "name": "meuble-haut-4",
        "content/img": "meuble-haut-cuisine-4.png",
        "content/title": "Meuble haut ou bas cuisine <br/>(4 portes)",
        "content/val": 2
    },
    {
        "categorie": "cuisine",
        "name": "s-lavabo",
        "content/img": "sous-lavabo.png",
        "content/title": "Sous-lavabo",
        "content/val": 0.8
    },
    {
        "categorie": "cuisine",
        "name": "vaisselier-1",
        "content/img": "vaisselier.png",
        "content/title": "Vaisselier (1 porte)",
        "content/val": 1
    },
    {
        "categorie": "cuisine",
        "name": "vaisselier-2",
        "content/img": "vaisselier.png",
        "content/title": "Vaisselier (2 portes)",
        "content/val": 1.5
    },
    {
        "categorie": "cuisine",
        "name": "vaisselier-3",
        "content/img": "vaisselier.png",
        "content/title": "Vaisselier (3 portes)",
        "content/val": 2
    },
    {
        "categorie": "cuisine",
        "name": "vaisselier-4",
        "content/img": "vaisselier.png",
        "content/title": "Vaisselier (4 portes)",
        "content/val": 2.5
    },
    {
        "categorie": "cuisine",
        "name": "petite-lampe",
        "content/img": "petite-lampe.png",
        "content/title": "Petite lampe",
        "content/val": 0.2
    },
    {
        "categorie": "cuisine",
        "name": "halogene",
        "content/img": "halogene.png",
        "content/title": "Holagène",
        "content/val": 0.25
    },
    {
        "categorie": "cuisine",
        "name": "placard",
        "content/img": "placard.png",
        "content/title": "Placard",
        "content/val": 1
    },
    {
        "categorie": "cuisine",
        "name": "etagere",
        "content/img": "etagere.png",
        "content/title": "Étagère",
        "content/val": 0.3
    },
    {
        "categorie": "cuisine",
        "name": "table",
        "content/img": "table-moyen.png",
        "content/title": "Table",
        "content/val": 1
    },
    {
        "categorie": "cuisine",
        "name": "chaise",
        "content/img": "chaise.png",
        "content/title": "Chaise",
        "content/val": 0.3
    },
    {
        "categorie": "cuisine",
        "name": "lave-linge",
        "content/img": "lave-linge.png",
        "content/title": "Lave linge",
        "content/val": 0.5
    },
    {
        "categorie": "cuisine",
        "name": "lave-vaisselle",
        "content/img": "lave-vaisselle.png",
        "content/title": "Lave-vaisselle",
        "content/val": 0.5
    },
    {
        "categorie": "cuisine",
        "name": "congelateur-p",
        "content/img": "congelateur-petit.png",
        "content/title": "Congélateur coffre (petit)",
        "content/val": 0.5
    },
    {
        "categorie": "cuisine",
        "name": "congelateur-m",
        "content/img": "congelateur-moyen.png",
        "content/title": "Congélateur coffre (moyen)",
        "content/val": 0.75
    },
    {
        "categorie": "cuisine",
        "name": "congelateur-g",
        "content/img": "congelateur-grand.png",
        "content/title": "Congélateur coffre (grand)",
        "content/val": 1
    },
    {
        "categorie": "cuisine",
        "name": "plante-p",
        "content/img": "plante-1.png",
        "content/title": "Plante (petite)",
        "content/val": 0.25
    },
    {
        "categorie": "cuisine",
        "name": "plante-m",
        "content/img": "plante-2.png",
        "content/title": "Plante (moyenne)",
        "content/val": 0.75
    },
    {
        "categorie": "cuisine",
        "name": "plante-g",
        "content/img": "plante-3.png",
        "content/title": "Plante (grande)",
        "content/val": 1
    },
    {
        "categorie": "cuisine",
        "name": "seche-linge",
        "content/img": "seche-linge.png",
        "content/title": "Sèche-linge",
        "content/val": 0.5
    },
    {
        "categorie": "cuisine",
        "name": "tableau-p",
        "content/img": "tableau-petit.png",
        "content/title": "Tableau (petit)",
        "content/val": 0.1
    },
    {
        "categorie": "cuisine",
        "name": "tableau-m",
        "content/img": "tableau-moyen.png",
        "content/title": "Tableau (moyen)",
        "content/val": 0.15
    },
    {
        "categorie": "cuisine",
        "name": "tableau-g",
        "content/img": "tableau-grand.png",
        "content/title": "Tableau (grand)",
        "content/val": 0.25
    },
    {
        "categorie": "cuisine",
        "name": "carton",
        "content/img": "carton-standard.png",
        "content/title": "Carton",
        "content/val": 0.1
    },
    {
        "categorie": "cuisine",
        "name": "tv",
        "content/img": "television.png",
        "content/title": "Télévision",
        "content/val": 0.25
    },
    {
        "categorie": "cuisine",
        "name": "tapis-p",
        "content/img": "tapis-petit.png",
        "content/title": "Tapis (petit)",
        "content/val": 0.1
    },
    {
        "categorie": "cuisine",
        "name": "tapis-m",
        "content/img": "tapis-moyen.png",
        "content/title": "Tapis (moyen)",
        "content/val": 0.2
    },
    {
        "categorie": "cuisine",
        "name": "tapis-g",
        "content/img": "tapis-grand.png",
        "content/title": "Tapis (grand)",
        "content/val": 0.3
    },
    {
        "categorie": "chambre",
        "name": "lit-bebe",
        "content/img": "lit-bebe.png",
        "content/title": "Lit Bébé",
        "content/val": 1.2
    },
    {
        "categorie": "chambre",
        "name": "lit-1",
        "content/img": "lit-1.png",
        "content/title": "Lit (1 place)",
        "content/val": 1.2
    },
    {
        "categorie": "chambre",
        "name": "lit-2",
        "content/img": "lit-2.png",
        "content/title": "Lit (2 places)",
        "content/val": 2
    },
    {
        "categorie": "chambre",
        "name": "lit-superpose",
        "content/img": "lit-superpose.png",
        "content/title": "Lit superposé",
        "content/val": 2.5
    },
    {
        "categorie": "chambre",
        "name": "table-chevet",
        "content/img": "table-de-chevet.png",
        "content/title": "Table de chevet",
        "content/val": 0.3
    },
    {
        "categorie": "chambre",
        "name": "armoire-1",
        "content/img": "armoire-1.png",
        "content/title": "Armoire (1 porte)",
        "content/val": 0.5
    },
    {
        "categorie": "chambre",
        "name": "armoire-2",
        "content/img": "armoire-2.png",
        "content/title": "Armoire (2 porte)",
        "content/val": 1.5
    },
    {
        "categorie": "chambre",
        "name": "armoire-3",
        "content/img": "armoire-3.png",
        "content/title": "Armoire (3 porte)",
        "content/val": 1.5
    },
    {
        "categorie": "chambre",
        "name": "armoire-4",
        "content/img": "armoire-4.png",
        "content/title": "Armoire (4 porte)",
        "content/val": 2
    },
    {
        "categorie": "chambre",
        "name": "commode",
        "content/img": "commode.png",
        "content/title": "Commode",
        "content/val": 0.5
    },
    {
        "categorie": "chambre",
        "name": "coiffeuse",
        "content/img": "coiffeuse-1.png",
        "content/title": "Coiffeuse",
        "content/val": 1.5
    },
    {
        "categorie": "chambre",
        "name": "bonnetiere",
        "content/img": "bonnetiere.png",
        "content/title": "Bonnetière",
        "content/val": 1.5
    },
    {
        "categorie": "chambre",
        "name": "fauteuil",
        "content/img": "fauteuil.png",
        "content/title": "Fauteuil",
        "content/val": 1
    },
    {
        "categorie": "chambre",
        "name": "abat-jour",
        "content/img": "abat-jour.png",
        "content/title": "Abat-jour",
        "content/val": 0.1
    },
    {
        "categorie": "chambre",
        "name": "petite-lampe",
        "content/img": "petite-lampe.png",
        "content/title": "Petite lampe",
        "content/val": 0.2
    },
    {
        "categorie": "chambre",
        "name": "halogene",
        "content/img": "halogene.png",
        "content/title": "Halogène",
        "content/val": 0.25
    },
    {
        "categorie": "chambre",
        "name": "placard",
        "content/img": "placard.png",
        "content/title": "Placard",
        "content/val": 1
    },
    {
        "categorie": "chambre",
        "name": "etagere",
        "content/img": "etagere.png",
        "content/title": "Étagère",
        "content/val": 0.3
    },
    {
        "categorie": "chambre",
        "name": "bibliotheque-1",
        "content/img": "bibliotheque-1-porte.png",
        "content/title": "Bibliothèque (1 porte)",
        "content/val": 0.5
    },
    {
        "categorie": "chambre",
        "name": "bibliotheque-2",
        "content/img": "bibliotheque-2-porte.png",
        "content/title": "Bibliothèque (2 portes)",
        "content/val": 1
    },
    {
        "categorie": "chambre",
        "name": "bibliotheque-3",
        "content/img": "bibliotheque-3-porte.png",
        "content/title": "Bibliothèque (3 portes)",
        "content/val": 1.5
    },
    {
        "categorie": "chambre",
        "name": "bibliotheque-4",
        "content/img": "bibliotheque-4-porte.png",
        "content/title": "Bibliothèque (4 portes)",
        "content/val": 2
    },
    {
        "categorie": "chambre",
        "name": "chaise",
        "content/img": "chaise.png",
        "content/title": "Chaise",
        "content/val": 0.33
    },
    {
        "categorie": "chambre",
        "name": "meuble-tv",
        "content/img": "meuble-tv.png",
        "content/title": "Meuble TV",
        "content/val": 0.7
    },
    {
        "categorie": "chambre",
        "name": "tv",
        "content/img": "television.png",
        "content/title": "Télévision",
        "content/val": 0.25
    },
    {
        "categorie": "chambre",
        "name": "petit-bureau",
        "content/img": "bureau-1.png",
        "content/title": "Petit bureau",
        "content/val": 1
    },
    {
        "categorie": "chambre",
        "name": "bureau",
        "content/img": "bureau-2.png",
        "content/title": "Bureau",
        "content/val": 1.5
    },
    {
        "categorie": "chambre",
        "name": "ordinateur",
        "content/img": "ordinateur.png",
        "content/title": "Ordinateur",
        "content/val": 0.1
    },
    {
        "categorie": "chambre",
        "name": "imprimante",
        "content/img": "imprimante.png",
        "content/title": "Imprimante",
        "content/val": 0.3
    },
    {
        "categorie": "chambre",
        "name": "hifi",
        "content/img": "chaine-hifi.png",
        "content/title": "Hifi",
        "content/val": 0.3
    },
    {
        "categorie": "chambre",
        "name": "plante-p",
        "content/img": "plante-1.png",
        "content/title": "Plante (petite)",
        "content/val": 0.25
    },
    {
        "categorie": "chambre",
        "name": "plante-m",
        "content/img": "plante-2.png",
        "content/title": "Plante (moyenne)",
        "content/val": 0.5
    },
    {
        "categorie": "chambre",
        "name": "plante-g",
        "content/img": "plante-3.png",
        "content/title": "Plante (grande)",
        "content/val": 1
    },
    {
        "categorie": "chambre",
        "name": "tableau-p",
        "content/img": "tableau-petit.png",
        "content/title": "Tableau (petit)",
        "content/val": 0.1
    },
    {
        "categorie": "chambre",
        "name": "tableau-m",
        "content/img": "tableau-moyen.png",
        "content/title": "Tableau (moyen)",
        "content/val": 0.15
    },
    {
        "categorie": "chambre",
        "name": "tableau-g",
        "content/img": "tableau-grand.png",
        "content/title": "Tableau (grand)",
        "content/val": 0.25
    },
    {
        "categorie": "chambre",
        "name": "carton-penderie",
        "content/img": "carton-penderie.png",
        "content/title": "Carton penderie",
        "content/val": 0.5
    },
    {
        "categorie": "chambre",
        "name": "carton",
        "content/img": "carton-standard.png",
        "content/title": "Carton standard",
        "content/val": 0.1
    },
    {
        "categorie": "chambre",
        "name": "contenu-penderie-1",
        "content/img": "penderie-petit.png",
        "content/title": "Contenu penderie (1 porte)",
        "content/val": 0.5
    },
    {
        "categorie": "chambre",
        "name": "contenu-penderie-2",
        "content/img": "penderie-moyen.png",
        "content/title": "Contenu penderie (2 portes)",
        "content/val": 1
    },
    {
        "categorie": "chambre",
        "name": "contenu-penderie-3",
        "content/img": "penderie-grand.png",
        "content/title": "Contenu penderie (3 portes)",
        "content/val": 1.5
    },
    {
        "categorie": "chambre",
        "name": "contenu-penderie-4",
        "content/img": "contenu-penderie-2.png",
        "content/title": "Contenu penderie (4 portes)",
        "content/val": 2
    },
    {
        "categorie": "chambre",
        "name": "contenu-placard-1",
        "content/img": "contenu-placard-1.png",
        "content/title": "Contenu placard (1 porte)",
        "content/val": 0.5
    },
    {
        "categorie": "chambre",
        "name": "contenu-placard-2",
        "content/img": "contenu-placard-2.png",
        "content/title": "Contenu placard (2 portes)",
        "content/val": 1
    },
    {
        "categorie": "chambre",
        "name": "contenu-placard-3",
        "content/img": "contenu-placard-3.png",
        "content/title": "Contenu placard (3 portes)",
        "content/val": 1.5
    },
    {
        "categorie": "chambre",
        "name": "contenu-placard-4",
        "content/img": "contenu-placard-4.png",
        "content/title": "Contenu placard (4 portes)",
        "content/val": 2
    },
    {
        "categorie": "chambre",
        "name": "coffre-a-jouet-petit",
        "content/img": "coffre-a-jouet-petit.png",
        "content/title": "Coffre à jouets (petit)",
        "content/val": 0.25
    },
    {
        "categorie": "chambre",
        "name": "coffre-a-jouet-petit",
        "content/img": "coffre-a-jouet-moyen.png",
        "content/title": "Coffre à jouets (moyen)",
        "content/val": 0.5
    },
    {
        "categorie": "chambre",
        "name": "coffre-a-jouet-petit",
        "content/img": "coffre-a-jouet-grand.png",
        "content/title": "Coffre à jouets (grand)",
        "content/val": 0.75
    },
    {
        "categorie": "chambre",
        "name": "table-repasser",
        "content/img": "table-a-repasser.png",
        "content/title": "Table à repasser",
        "content/val": 0.15
    },
    {
        "categorie": "salon",
        "name": "canape-2",
        "content/img": "canape-2.png",
        "content/title": "Canapé (2 places)",
        "content/val": 2
    },
    {
        "categorie": "salon",
        "name": "canape-3",
        "content/img": "canape-3.png",
        "content/title": "Canapé (3 places)",
        "content/val": 2.5
    },
    {
        "categorie": "salon",
        "name": "canape-angle",
        "content/img": "canape-angle.png",
        "content/title": "Canapé d'angle",
        "content/val": 3
    },
    {
        "categorie": "salon",
        "name": "fauteuil",
        "content/img": "fauteuil.png",
        "content/title": "Fauteuil ",
        "content/val": 1
    },
    {
        "categorie": "salon",
        "name": "abat-jour",
        "content/img": "abat-jour.png",
        "content/title": "Abat-jour",
        "content/val": 0.1
    },
    {
        "categorie": "salon",
        "name": "petite-lampe",
        "content/img": "petite-lampe.png",
        "content/title": "Petite lampe",
        "content/val": 0.2
    },
    {
        "categorie": "salon",
        "name": "halogene",
        "content/img": "halogene.png",
        "content/title": "Halogène",
        "content/val": 0.25
    },
    {
        "categorie": "salon",
        "name": "placard ",
        "content/img": "placard.png",
        "content/title": "Placard ",
        "content/val": 2
    },
    {
        "categorie": "salon",
        "name": "etagere ",
        "content/img": "etagere.png",
        "content/title": "Étagère",
        "content/val": 0.3
    },
    {
        "categorie": "salon",
        "name": "bibliotheque-1",
        "content/img": "bibliotheque-1-porte.png",
        "content/title": "Bibliothèque (1 porte)",
        "content/val": 0.5
    },
    {
        "categorie": "salon",
        "name": "bibliotheque-2",
        "content/img": "bibliotheque-2-porte.png",
        "content/title": "Bibliothèque (2 portes)",
        "content/val": 1
    },
    {
        "categorie": "salon",
        "name": "bibliotheque-3",
        "content/img": "bibliotheque-3-porte.png",
        "content/title": "Bibliothèque (2 portes)",
        "content/val": 1.5
    },
    {
        "categorie": "salon",
        "name": "bibliotheque-4",
        "content/img": "bibliotheque-4-porte.png",
        "content/title": "Bibliothèque (4 portes)",
        "content/val": 2
    },
    {
        "categorie": "salon",
        "name": "meuble-living-1",
        "content/img": "living-1.png",
        "content/title": "Meuble living (1 porte)",
        "content/val": 0.5
    },
    {
        "categorie": "salon",
        "name": "meuble-living-2",
        "content/img": "living-2.png",
        "content/title": "Meuble living (2 portes)",
        "content/val": 1
    },
    {
        "categorie": "salon",
        "name": "meuble-living-3",
        "content/img": "living-3.png",
        "content/title": "Meuble living (3 portes)",
        "content/val": 1.5
    },
    {
        "categorie": "salon",
        "name": "meuble-living-4",
        "content/img": "living-4.png",
        "content/title": "Meuble living (4 portes)",
        "content/val": 2
    },
    {
        "categorie": "salon",
        "name": "table-basse",
        "content/img": "table-basse.png",
        "content/title": "Table basse",
        "content/val": 1
    },
    {
        "categorie": "salon",
        "name": "gueridon ",
        "content/img": "gueridon.png",
        "content/title": "Guéridon",
        "content/val": 0.3
    },
    {
        "categorie": "salon",
        "name": "table-p",
        "content/img": "table-1.png",
        "content/title": "Table (petite)",
        "content/val": 0.5
    },
    {
        "categorie": "salon",
        "name": "table-m",
        "content/img": "table-2.png",
        "content/title": "Table (moyenne)",
        "content/val": 0.75
    },
    {
        "categorie": "salon",
        "name": "table-g",
        "content/img": "table-3.png",
        "content/title": "Table (grande)",
        "content/val": 1
    },
    {
        "categorie": "salon",
        "name": "chaise ",
        "content/img": "chaise.png",
        "content/title": "Chaise",
        "content/val": 0.33
    },
    {
        "categorie": "salon",
        "name": "meuble-tv",
        "content/img": "table-tv.png",
        "content/title": "Meuble TV",
        "content/val": 7
    },
    {
        "categorie": "salon",
        "name": "tv",
        "content/img": "television.png",
        "content/title": "Télévision",
        "content/val": 0.25
    },
    {
        "categorie": "salon",
        "name": "petit-bureau",
        "content/img": "bureau-1.png",
        "content/title": "Petit bureau",
        "content/val": 1
    },
    {
        "categorie": "salon",
        "name": "bureau",
        "content/img": "bureau-2.png",
        "content/title": "Bureau",
        "content/val": 1.5
    },
    {
        "categorie": "salon",
        "name": "ordinateur",
        "content/img": "ordinateur.png",
        "content/title": "Ordinateur",
        "content/val": 0.1
    },
    {
        "categorie": "salon",
        "name": "imprimante",
        "content/img": "imprimante.png",
        "content/title": "Imprimante",
        "content/val": 0.3
    },
    {
        "categorie": "salon",
        "name": "hifi",
        "content/img": "chaine-hifi.png",
        "content/title": "Hifi",
        "content/val": 0.3
    },
    {
        "categorie": "salon",
        "name": "piano-demi",
        "content/img": "piano-demi-queue.png",
        "content/title": "Piano demi-queue",
        "content/val": 3
    },
    {
        "categorie": "salon",
        "name": "piano-queue",
        "content/img": "piano-queue.png",
        "content/title": "Piano à queue",
        "content/val": 4
    },
    {
        "categorie": "salon",
        "name": "piano-droit",
        "content/img": "piano-droit.png",
        "content/title": "Piano droit",
        "content/val": 3
    },
    {
        "categorie": "salon",
        "name": "plante-p",
        "content/img": "plante-1.png",
        "content/title": "Plante (petite)",
        "content/val": 0.25
    },
    {
        "categorie": "salon",
        "name": "plante-m",
        "content/img": "plante-2.png",
        "content/title": "Plante (moyenne)",
        "content/val": 0.5
    },
    {
        "categorie": "salon",
        "name": "plante-g",
        "content/img": "plante-3.png",
        "content/title": "Plante (grande)",
        "content/val": 0.75
    },
    {
        "categorie": "salon",
        "name": "tableau-p",
        "content/img": "tableau-petit.png",
        "content/title": "Tableau (petit)",
        "content/val": 0.1
    },
    {
        "categorie": "salon",
        "name": "tableau-m",
        "content/img": "tableau-moyen.png",
        "content/title": "Tableau (moyen)",
        "content/val": 0.15
    },
    {
        "categorie": "salon",
        "name": "tableau-g",
        "content/img": "tableau-grand.png",
        "content/title": "Tableau (grand)",
        "content/val": 0.25
    },
    {
        "categorie": "salon",
        "name": "carton",
        "content/img": "carton-standard.png",
        "content/title": "Carton standard",
        "content/val": 0.1
    },
    {
        "categorie": "salon",
        "name": "tapis-p",
        "content/img": "tapis-petit.png",
        "content/title": "Tapis (petit)",
        "content/val": 0.15
    },
    {
        "categorie": "salon",
        "name": "tapis-m",
        "content/img": "tapis-moyen.png",
        "content/title": "Tapis (moyen)",
        "content/val": 0.5
    },
    {
        "categorie": "salon",
        "name": "tapis-g",
        "content/img": "tapis-grand.png",
        "content/title": "Tapis (grand)",
        "content/val": 0.75
    },
    {
        "categorie": "salon",
        "name": "porte-manteau",
        "content/img": "porte-manteau.png",
        "content/title": "Porte-manteau",
        "content/val": 0.3
    },
    {
        "categorie": "autres",
        "name": "aspirateur ",
        "content/img": "aspirateur.png",
        "content/title": "Aspirateur",
        "content/val": 0.3
    },
    {
        "categorie": "autres",
        "name": "etabli ",
        "content/img": "etabli.png",
        "content/title": "Établi",
        "content/val": 1
    },
    {
        "categorie": "autres",
        "name": "outils-p",
        "content/img": "lot-outils-1.png",
        "content/title": "Lot d’outils (petit)",
        "content/val": 0.25
    },
    {
        "categorie": "autres",
        "name": "outils-m",
        "content/img": "lot-outils-2.png",
        "content/title": "Lot d’outils (moyen)",
        "content/val": 0.75
    },
    {
        "categorie": "autres",
        "name": "outils-g",
        "content/img": "lot-outils-3.png",
        "content/title": "Lot d’outils (grand)",
        "content/val": 1
    },
    {
        "categorie": "autres",
        "name": "parasol",
        "content/img": "parasol.png",
        "content/title": "Parasol",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "poussette",
        "content/img": "poussette.png",
        "content/title": "Poussette",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "scooter",
        "content/img": "scooter.png",
        "content/title": "Scooter",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "tondeuse",
        "content/img": "tondeuse.png",
        "content/title": "Tondeuse",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "brouette",
        "content/img": "brouette.png",
        "content/title": "Brouette",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "transat",
        "content/img": "transat.png",
        "content/title": "Transat",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "velo",
        "content/img": "velo",
        "content/title": "Vélo",
        "content/val": 0.25
    },
    {
        "categorie": "autres",
        "name": "petite-lampe",
        "content/img": "petite-lampe.png",
        "content/title": "Petite lampe",
        "content/val": 0.2
    },
    {
        "categorie": "autres",
        "name": "halogene",
        "content/img": "halogene.png",
        "content/title": "Halogène",
        "content/val": 0.25
    },
    {
        "categorie": "autres",
        "name": "placard",
        "content/img": "placard.png",
        "content/title": "Placard",
        "content/val": 1
    },
    {
        "categorie": "autres",
        "name": "etagere",
        "content/img": "etagere.png",
        "content/title": "Étagère",
        "content/val": 0.3
    },
    {
        "categorie": "autres",
        "name": "chaise",
        "content/img": "chaise.png",
        "content/title": "Chaise",
        "content/val": 0.33
    },
    {
        "categorie": "autres",
        "name": "petit-bureau",
        "content/img": "bureau-1.png",
        "content/title": "Petit bureau",
        "content/val": 1
    },
    {
        "categorie": "autres",
        "name": "bureau",
        "content/img": "bureau-2.png",
        "content/title": "Bureau",
        "content/val": 1.5
    },
    {
        "categorie": "autres",
        "name": "ordinateur ",
        "content/img": "ordinateur.png",
        "content/title": "Ordinateur",
        "content/val": 0.1
    },
    {
        "categorie": "autres",
        "name": "imprimante",
        "content/img": "imprimante.png",
        "content/title": "Imprimante",
        "content/val": 0.3
    },
    {
        "categorie": "autres",
        "name": "plante-p",
        "content/img": "plante-1.png",
        "content/title": "Plante (petite)",
        "content/val": 0.25
    },
    {
        "categorie": "autres",
        "name": "plante-m",
        "content/img": "plante-2.png",
        "content/title": "Plante (moyen)",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "plante-g",
        "content/img": "plante-3.png",
        "content/title": "Plante (grand)",
        "content/val": 1
    },
    {
        "categorie": "autres",
        "name": "tableau-p",
        "content/img": "tableau-petit.png",
        "content/title": "Tableau (petit)",
        "content/val": 0.1
    },
    {
        "categorie": "autres",
        "name": "tableau-m",
        "content/img": "tableau-moyen.png",
        "content/title": "Tableau (moyen)",
        "content/val": 0.15
    },
    {
        "categorie": "autres",
        "name": "tableau-g",
        "content/img": "tableau-grand.png",
        "content/title": "Tableau (grand)",
        "content/val": 0.25
    },
    {
        "categorie": "autres",
        "name": "carton",
        "content/img": "carton-standard.png",
        "content/title": "Carton standard",
        "content/val": 0.1
    },
    {
        "categorie": "autres",
        "name": "table-jardin-p",
        "content/img": "table-jardin-petit.png",
        "content/title": "Table de jardin (petite)",
        "content/val": 0.25
    },
    {
        "categorie": "autres",
        "name": "table-jardin-m",
        "content/img": "table-jardin-moyen.png",
        "content/title": "Table de jardin (moyen)",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "table-jardin-g",
        "content/img": "table-jardin-grand.png",
        "content/title": "Table de jardin (grande)",
        "content/val": 0.75
    },
    {
        "categorie": "autres",
        "name": "table-repasser",
        "content/img": "table-a-repasser.png",
        "content/title": "Table à repasser",
        "content/val": 0.15
    },
    {
        "categorie": "autres",
        "name": "tracteur-tondeuse",
        "content/img": "tracteur-tondeuse.png",
        "content/title": "Tracteur tondeuse",
        "content/val": 1.5
    },
    {
        "categorie": "autres",
        "name": "outils-de-jardins-p",
        "content/img": "outils-de-jardins-1.png",
        "content/title": "Outils de jardin (petit)",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "outils-de-jardins-m",
        "content/img": "outils-de-jardins-2.png",
        "content/title": "Outils de jardin (moyen)",
        "content/val": 0.75
    },
    {
        "categorie": "autres",
        "name": "outils-de-jardins-g",
        "content/img": "outils-de-jardins-3.png",
        "content/title": "Outils de jardin (grand)",
        "content/val": 1
    },
    {
        "categorie": "autres",
        "name": "meuble-chaussures-p",
        "content/img": "meubles-a-chaussure-1.png",
        "content/title": "Meuble à chaussures (petit)",
        "content/val": 0.25
    },
    {
        "categorie": "autres",
        "name": "meuble-chaussures-m",
        "content/img": "meubles-a-chaussure-2.png",
        "content/title": "Meuble à chaussures (moyen)",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "meuble-chaussures-g",
        "content/img": "meubles-a-chaussure-3.png",
        "content/title": "Meuble à chaussures (grand)",
        "content/val": 0.75
    },
    {
        "categorie": "autres",
        "name": "table-ping-pong",
        "content/img": "ping-pong.png",
        "content/title": "Table de ping-pong",
        "content/val": 1.5
    },
    {
        "categorie": "autres",
        "name": "barbecue-p",
        "content/img": "barbecue-1.png",
        "content/title": "Barbecue (petit)",
        "content/val": 0.25
    },
    {
        "categorie": "autres",
        "name": "barbecue-m",
        "content/img": "barbecue-2.png",
        "content/title": "Barbecue (moyen)",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "barbecue-g",
        "content/img": "barbecue-3.png",
        "content/title": "Barbecue (grand)",
        "content/val": 0.75
    },
    {
        "categorie": "autres",
        "name": "congelateur-p",
        "content/img": "congelateur-1.png",
        "content/title": "Congélateur coffre (petit)",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "congelateur-p",
        "content/img": "congelateur-2.png",
        "content/title": "Congélateur coffre (moyen)",
        "content/val": 0.75
    },
    {
        "categorie": "autres",
        "name": "congelateur-p",
        "content/img": "congelateur-grand.png",
        "content/title": "Congélateur coffre (grand)",
        "content/val": 1
    },
    {
        "categorie": "autres",
        "name": "paniere-linge",
        "content/img": "paniere-a-linge.png",
        "content/title": "Panière à linge",
        "content/val": 0.3
    },
    {
        "categorie": "autres",
        "name": "frigo",
        "content/img": "refrigerateur.png",
        "content/title": "Réfrigérateur",
        "content/val": 1
    },
    {
        "categorie": "autres",
        "name": "frigo-am",
        "content/img": "refrigerateur-americain.png",
        "content/title": "Réfrigérateur américain",
        "content/val": 2
    },
    {
        "categorie": "autres",
        "name": "frigo-top",
        "content/img": "refrigerateur-top.png",
        "content/title": "Réfrigérateur top",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "gaziniere",
        "content/img": "gaziniere.png",
        "content/title": "Gazinière",
        "content/val": 0.5
    },
    {
        "categorie": "autres",
        "name": "lave-linge",
        "content/img": "lave-linge.png",
        "content/title": "Lave-linge",
        "content/val": 0.5
    }
];
export const Calculator = {
  init: ({baseUrl=base_url,xlsxUrl = xlsx_url})=>{
      console.log('loading DOM');
      /**** Start calculator ***/
      //External function "calc"  (codepen js parameters) : https://rawcdn.githack.com/artkabis/toolsWP/b2154687760ca3b152066029ceb912aa48057b08/demenagement-calculator/sources/calculator.min.js

      //var url=//"https://centre-dimagerie.site-privilege.pagesjaunes.fr/wp-content/uploads/sites/1674/2019/06/";
      let [categories_name,tab1,titleCatg,catg] = [[],[],[],[]];//Destructuring assignement
      let [url,urlXlsx] = [baseUrl,xlsxUrl];

    /* uncomment for online version and delete const datas ***.
    /*
     //request xlsx to json (uncomment in current domain)
     var oReq = new XMLHttpRequest();
      oReq.open("GET", urlXlsx, true);
      oReq.responseType = "arraybuffer";
      oReq.onload = function(e) {
        var arraybuffer = oReq.response;

        // convert data to binary string 
        var data = new Uint8Array(arraybuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");

        // Call XLSX 
        var workbook = XLSX.read(bstr, {type: "binary"});
        // DO SOMETHING WITH workbook HERE 
        var first_sheet_name = workbook.SheetNames[0];
        // Get worksheet 
        var worksheet = workbook.Sheets[first_sheet_name];
        tab1=XLSX.utils.sheet_to_json(worksheet, {raw: true});
      }
      oReq.send();
      */
      let tab;//global data init
      const digitNb = $n=> {
        return ((typeof $n === 'number') ? String($n) : $n).padStart(4, '0');//digt : if 1 > 0001, if 10 > 0010, if 100 > 0100, ...
      };
      const cleanArray = (array) => {
        return [...new Set(array)];//fusion multiple values array
      }
      const cleanArea = ($str,dataType)=> {
        return (dataType) ? $.trim($str.replace(/\s\s+/g, '').replace(/,/g, '\n').replaceAll(/^\s+|\s+$/gm,'')) : $.trim($str.replace(/,/g, '\n'));
      }
      setTimeout(()=>{
        tab = datas;//Si la requête est décommenter, à remplacer par tab1
        console.log(tab)
        for( var i =0; i<tab.length;i++ ){catg.push(tab[i].categorie);}
        titleCatg = cleanArray(catg);//Titles categories (no-duplicate)
      },300);
      const constructTab = ($titleCatg) =>{
           (typeof  $titleCatg!== undefined) ? (()=>{
             for(var i=0;i<$titleCatg.length;i++){ 
                var num=1+i;
                $('.resp-tabs-list').append('<li><a href="#tab-'+num+'">'+$titleCatg[i]+'</a></li>');
                $('.resp-tabs-container').append(`<div id="tab-${num}" class="tab"></div>`);
                (i ===$titleCatg.length-1) && (()=>{$("#Tabs").tabs(); return})();
              }
           })() : (()=>{
                console.error("Les catégories du fichier xlsx n'ont pu être récupérées");
           })();
        }
      const  constructItem = () =>{
        let tNames=[];
        $.grep( tab, ( n, i )=> {
          for(var j=0;j<titleCatg.length;j++){
              ( n.categorie == titleCatg[j]) && (()=>{        
                 const name = n.name,img = n["content/img"],title = n["content/title"],value = n["content/val"];
                 $('#tab-'+(j+1)).append(`<div id="item-${digitNb(i)}" class="item ${name}"><span class="item-text">${title}</span><span id="price_item_${digitNb(i)}">${value}</span><span class="img_item"></span><input type="button" value="-" class="qtyminus" /><input type="text" class="qtyvalue" value="0" size="2"><input type="button" value="+" class="qtyplus"/><input class="totalitem" id="total_item" type="hidden" value="0"></div>`);   
                 $("."+name).find(".img_item").css('background-image',"url("+url+img+")");
             })();
          }
        });
      }
      /***** Extract datas for the categories and creat DOM ****/
      $("input[name^=qty_item_]").bind("keyup", recalc);
      function recalc() {
        //calcul is global var in html page DOM, qty & price contains a string to eval
        const calculEval = (calcul) && {calcStr:calcul.calcStr, qty: eval(calcul.qty),price: eval(calcul.price)};
        (calculEval) ? (()=>{
          $("[id^=total_item]").calc(calculEval.calcStr, {qty: calculEval.qty,price: calculEval.price}, function(s) {
            return s;
          }, function($this) {
            const sum = $this.sum().toFixed(2);
            $("#grandTotal").text(sum);
            $("#input_25_335").val(sum);
          });
        })() : (()=>{
          //if no calcul global var, construct the calc function
          $("[id^=total_item]").calc("qty * price", {qty: $("input[name^=qty_item_]"),price: $("[id^=price_item_]")}, function(s) {
            return s;
          }, function($this) {
            const sum = $this.sum().toFixed(2);
            $("#grandTotal").text(sum);
            $("#input_25_335").val(sum);
          });
        })();
      }
      const construcBtn = () =>{
        $(".qtyvalue").each(function() {
            const id = $(this).closest('.item').attr('id');
            $(this).attr("name", "qty_item_" + id);
        });
        $(".totalitem").each(function() {
            const id = $(this).closest('.item').attr('id');
            $(this).attr("id", "total_item_" + id);
        });  
        $(".qtyplus").each(function() {
            var id = $(this).closest('.item').attr('id');
            $(this).attr("field", "qty_item_" + id);
        }).on('click',function(e) {
            let temp = '';
            e.preventDefault();
            const fieldName = $(this).attr('field');
            let currentVal = Number($('input[name=' + fieldName + ']').val());
            (!isNaN(currentVal)) ? (()=>{
                $('input[name=' + fieldName + ']').val(currentVal + 1);
              recalc();
               const actVal = $(this).siblings('.qtyvalue').val(),
                     itemName = $(this).siblings('.item-text').text(),
                     itemId = $(this).parent().attr('id'),
                     volumeItem = $(this).parent().find('.totalitem').val();
              (actVal > 0) ? (()=>{
                 $(this).parents('.item').addClass("selected");
                    $(".volume-a-calculer div[class$='" + itemId + "']").remove();
                    $('.volume-a-calculer').append(`<div class="new-item-${fieldName}"> <span class="item-name">${itemName}</span>&nbsp;:&nbsp;<span class="item-qty">${actVal}</span><span class="item-volume">&nbsp;->&nbsp;Volume&nbsp;:&nbsp;${volumeItem} m³ ,</span> </div>`);
              })() :  $(".volume-a-calculer div[class$='" + itemId + "']").remove();
           })() : (()=>{
                $(".volume-a-calculer div[class$='" + itemId + "']").remove();
                $('input[name=' + fieldName + ']').val(0);
            })();

            // reset du textearea
            $('.result-volume-a-calculer textarea').val('');
            //Ajout du contenu de volume-a-calculer avec saut de ligne
            $('.volume-a-calculer div').each(function(index) {
                $('.liste-fourniture-send textarea').val(cleanArea(temp + $(this).text(),true));
               $('.result-volume-a-calculer textarea').val(cleanArea(temp + $(this).text(),false));
                temp = $('.result-volume-a-calculer textarea').val();
            });
            recalc();
        });

        //click less button and calcul new value
        $(".qtyminus").each(function() {
            const id = $(this).closest('.item').attr('id');
            $(this).attr("field", "qty_item_" + id);
        }).on('click',function(e) {
            e.preventDefault();
            let fieldName = $(this).attr('field');
            const currentVal = Number($('input[name=' + fieldName + ']').val());
            (!isNaN(currentVal) && (currentVal >= 1)) ? (()=>{
                $('input[name=' + fieldName + ']').val(currentVal - 1);
              recalc();
                const actVal = $(this).siblings('.qtyvalue').val(),
                    itemName = $(this).siblings('.item-text').text(),
                    itemId = $(this).parent().attr('id'),
                    volumeItem = $(this).siblings('.totalitem').val();
                (actVal && actVal > 0) ? (()=>{
                  //console.log('if actVal > 0 itemId: ',itemId, 'select item : ',$(".volume-a-calculer div[class$='" + itemId + "']"));
                   $(".volume-a-calculer div[class$='" + itemId + "']").remove();
                   $('.volume-a-calculer').append(`<div class="new-item-${fieldName}"><span class="item-name">${itemName}</span>&nbsp;:&nbsp;<span class="item-qty">${actVal}</span><span class="item-volume">&nbsp;->&nbsp;Volume&nbsp;:>&nbsp;${volumeItem} m³ ,</span> </div>`);
                })() : ($(this).parents('.item').removeClass("selected"),$(".volume-a-calculer div[class$='" + itemId + "']").remove());
            })() : (()=>{
                $(".volume-a-calculer div[class$='" + itemId + "']").remove();
                $('input[name=' + fieldName + ']').val(0);
            })();
            // reset du textearea
            let temp = '';
            $('.result-volume-a-calculer textarea').val('');
            //Add content to volume-a-calculer with break line
            $('.volume-a-calculer div').each(function(index) {
                $('.liste-fourniture-send textarea').val(cleanArea(temp + $(this).text(),true));
               $('.result-volume-a-calculer textarea').val(cleanArea(temp +$(this).text(), false));
                temp = $('.result-volume-a-calculer textarea').val();
            });
            recalc();
        });
        /***Reset calc forms***/
        $( '.reset-calculateur' ).on('click',(me)=>{
          $( '.qtyvalue' ).val('0');
          $( '#grandTotal' ).html('0');
          $( '.volume-a-calculer' ).html('');
          $( '.result-volume-a-calculer textarea' ).val('');
          $( '.item' ).removeClass( "selected" );
        });
      }
      /**** Gestion deplacement volume à demenager
      **/

      $(window).on('scroll',(e)=>{
        const menuH = $( ".row-top .col-menu" ).height();
        const space = (spaceTop) ? spaceTop : -300;//External constante
        const In = $( '.row-top' ).offset().top + space;
        const Out = $( '.row-bottom' ).offset().top - menuH + space;
        const screenTop = $(document).scrollTop() + space;
        ( $(this).scrollTop() >= In  && $(this).scrollTop() < Out ) ? ($( '.row-top' ).addClass( "m-sticky" ),$('.col-menu').css('top', screenTop)) : ($( '.row-top' ).removeClass( "m-sticky" ),$( '.row-top' ).addClass( "m-sticky-bot" )) ? ( $(this).scrollTop() >= Out ) : ($( '.row-top' ).removeClass( "m-sticky" ),$( '.row-top' ).removeClass( "m-sticky-bot" ))
      });


      //Start construct steps calculator
      setTimeout(function(){
        constructTab(titleCatg);//Create tab with titleCategories (global constante)
        constructItem();//Start construct items (datas xlsx to json)
        recalc();//Init calcul
        construcBtn();//Construct button and attach event (mor & less products)

    /******************** save elements in localStorage ****/
        $(window).on('beforeunload',(e)=> {
          let  [labelVolume, valueVolume, laLabel, laValue] = [ [], [], '', '' ];
          $('#Tabs .item').each(function () {
            ($(this).find('.qtyvalue').val() > 0) && (laLabel = $(this).attr('id'), labelVolume.push(laLabel), laValue = $(this).find('.qtyvalue').val(), valueVolume.push(laValue))
          });
          localStorage.setItem('labelVolume', labelVolume);
          localStorage.setItem('valueVolume', valueVolume);
          localStorage.setItem('totalVolume', $('#grandTotal').text());
          localStorage.setItem('exerptVolume', cleanArea($('#input_37_321').val()).replaceAll('m³','m³,'));
          localStorage.setItem('suppVolume', $('#input_37_383').val());
        });

        //after ready document and if localStorage item > 0
        $( document ).ready((e)=>{
            (localStorage.getItem("labelVolume").length > 0) && (()=>{
                let labelVolume = localStorage.getItem("labelVolume").split(","), valueVolume = localStorage.getItem("valueVolume").split(","), exerptVolume = localStorage.getItem("exerptVolume").split(",");
                $('#grandTotal').html(localStorage.getItem("totalVolume"));
                $('.result-volume-a-calculer textarea').val( String(exerptVolume).replaceAll(',','').replace(/\s/g, '').replaceAll('m³','m³\n').replaceAll('->',' -> ').replaceAll(':',' : ') );//.replaceAll('m³','m³\n')
              //loop labelVolume items
              for (var i =0; i< labelVolume.length; i++) {
                let thisid = "#" + labelVolume[i]; 
                const thisvalue = valueVolume[i],
                      thisexp = exerptVolume[i]
                $(thisid).addClass('selected');
                thisid = thisid + " .qtyvalue";
                $(thisid).val(thisvalue);
                $('.volume-a-calculer').append(`<div class="new-item-${labelVolume[i]}"><span class="item-name">${thisexp}</span> </div>`);
              }
            })();
        });
      },400);
  }
}

