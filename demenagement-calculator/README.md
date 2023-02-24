# Calculator infos

Ce calculateur gère : 

1°) L'ensemble du calculateur se construit via le chargement d'un seul fichier xlsx, celui-ci est ensuite converti au format JSON pour construire le DOM.

2°) Les données sont sauvegardées via le localStorage, il est donc possible de continuer l'édition du calculateur, même après avoir quitté la page.

3°) Pour modifier l'ensemble des éléments du calculateur, il vous suffit simplement de supprimer le fichier xlsx de base et de le remplacer par le nouveau.

# Usage Calculator XLSX to json

## Déploiement

1°) Importer le formulaire via Gravityform (fichier json).

2°) Intégrer le formulaire précédemment importé dans la page (en dessous du bloc html comportant le script ci-dessous).

3°) Vérifier que les variables comportent le bon chemin vers votre xslx et vos images (bloc html brut) : 
```html
 <script type="module">
  /**** import ESModule ***/
import * as Calc from 'https://rawcdn.githack.com/artkabis/toolsWP/70558dbd9031e99db99dd468eda07114da49991b/demenagement-calculator/module.calculator.min.mjs'
const Template = await import('https://rawcdn.githack.com/artkabis/toolsWP/bab105e7b93fc50e239ae0bb57714ab00105da16/demenagement-calculator/template.mjs');//Html template module
const Datas = await import('https://rawcdn.githack.com/artkabis/toolsWP/aafa479ff34d7e82d0317d07c75827cc8332ce06/demenagement-calculator/datas.mjs');//json datas items
/*** La première constante reprend le chemin relatif (ici absolu pour les tests) sans le nom et l'extension de vos icônes et du fichier xlsx (que vous récupérez une fois ceux-ci placé en bibliothèque), la seconde comporte la base url et le nom du fichier xlsx et le dernier permet de paramétrer l'espacement au scroll du conteneur de volume total ***/
const base_url="https://provencedemenagement202104281316.site-privilege.pagesjaunes.fr/wp-content/uploads/sites/9827/2021/04/";
const xlsx_url = base_url+"listing-items.xlsx";//Chemin vers l'Excel comportant les éléments traités.
const calcul = undefined;//{calcStr:"qty * price", qty: '$("input[name^=qty_item_]")',price: '$("[id^=price_item_]")'};
const spaceTop = 20;//Espace de positionnement du module volume total et liste d'items (fixé via le scroll)
const datasJson = Datas.datas;//Exemple de datas au format json, si undefined alors mise en place de la request XLSX-> Json
document.querySelector('#App').innerHTML = String(Template.template).split('`')[1];//Template html du calculateur
document.addEventListener('DOMContentLoaded', await Calc.Calculator.init({spaceTop:spaceTop, baseUrl:base_url,xlsxUrl:xlsx_url, datas:datasJson}));//Initialisation du calculateur après chargement du DOM
 </script>
```
Voici la strcture de votre page : 
![Agencement de votre page](https://github.com/artkabis/toolsWP/blob/main/demenagement-calculator/sources/agencement-page-calculator.JPG)

4°) Déposer le fichier xslx (listing-items) dans la bibliothèque de médias (vérifié que la constante "base_url" reprend bien l'url de base sans le nom du fichier).



### Version online depuis mon [Codepen](https://codepen.io/artkabis/pen/RwJEzoz)


![Screen calculator](https://github.com/artkabis/toolsWP/blob/main/demenagement-calculator/sources/screen-calculator.JPG)
