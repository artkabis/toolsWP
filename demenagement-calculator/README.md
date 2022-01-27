# Usage Calculator csv to json

## Déploiement

1°) Importer le formulaire via Gravityform (fichier json).

2°) Placer le shortcode dans la page qui intégrera le calculateur.

3°) Vérifier que ces deux libs sont bien importés et que les variables comporte le bon chemin vers votre xslx et vos images : 
```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js"></script>

<script>
const base_url = "/wp-content/uploads/sites/5958/2022/01/";//Chemin vers les images
const xlsx_url = "/wp-content/uploads/sites/5958/2022/01/listing-items.xlsx";//Chemin vers l'Excel comportant les éléments traités.
const space = -300;//Espace de positionnement du module volume total et liste d'item (fixé via le scroll)
</script>
```

4°) Déposer le fichier xslx (listing-items) dans la bibliothèque de médias ainsi que le pack d'icônes dézippé.

5°) Vérifier que l'url de ces derniers est bien présent dans la variable située en début de script, la première variable reprend le chemin relatif sans le nom et l'extension du fichier et la seconde comporte la base url vers vos icônes (sans le nom et l'extension de l'image).

6°) Intégrer le css dans Composium ou Betheme (css.txt).
