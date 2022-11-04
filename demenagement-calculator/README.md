# Calculator infos

Ce calculateur gère : 

1°) L'ensemble du calculateur se construit via le chargement d'un seul fichier xlsx, celui-ci est ensuite converti au format JSON pour construire le DOM.

2°) Les données sont sauvegardées via le localStorage, il est donc possible de continuer l'édition du calculateur, même après avoir quitté la page.

3°) Pour modifier l'ensemble des éléments du calculateur, il vous suffit simplement de supprimer le fichier xlsx de base et de le replacer par le nouveau.

# Usage Calculator XLSX to json

## Déploiement

1°) Importer le formulaire via Gravityform (fichier json).

2°) Placer le shortcode dans la page qui intégrera le calculateur.

3°) Vérifier que ces deux libs sont bien importés et que les variables comportent le bon chemin vers votre xslx et vos images : 
```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js"></script>

<script>
/*** La première constante reprend le chemin relatif sans le nom et l'extension de vos icones et du fichier xlsx (que vous récupérez une fois ceux-ci mis en bibliothèque), la seconde comporte la base url et le nom du fichier xlsx et le dernier permet de paramètrer l'espacement au scroll du conteneur de volume total ***/

const base_url = "/wp-content/uploads/sites/5958/2022/01/";//Chemin vers les images (sans nom et extension de celles-ci)
const xlsx_url = base_url+"listing-items.xlsx";//Chemin vers l'Excel comportant les éléments traités.
const space = -300;//Espace de positionnement du module volume total et liste d'item (fixé via le scroll)
</script>
```

4°) Déposer le fichier xslx (listing-items) dans la bibliothèque de médias ainsi que le pack d'icônes dézippé.


5°) Intégrer le css dans Composium ou Betheme (css.txt).

### Version online depuis mon [Codepen](https://codepen.io/artkabis/pen/wvXWrmB){:target="_blank"}


![Screen calcullator](https://github.com/artkabis/toolsWP/blob/main/demenagement-calculator/sources/screen-calculator.JPG)
