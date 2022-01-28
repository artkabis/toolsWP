# PJ-Reviews V2

## Déploiement : 
- Dans votre page, veuillez intégrer un élément de type "structure" > "HTML Brute". 
- Sur ce composant, ajouter l'id : pj-wrapper
- Cette structure comportera ceci :
```html
<link rel="stylesheet" href="/wp-content/plugins/pj-prolive/assets/css/font-awesome.min.css?ver=4.7.0" crossorigin="anonymous" referrerpolicy="no-referrer" />
<div id="PJ-review-container"></div>
```

- Dans Composium -> Custom JS, injectez le JavaScript présent dans le fichier HTML rattaché à ce repo.
- Faites de même pour la partie CSS, que vous pouvez déposer dans la page.

##Infos complémentaires :
Cette nouvelle version permet désormais d'embarquer la liste des commentaires pj-pro via n'importe quel epj.

Si vous rencontrez un problème concernant l'affichage des icônes "star", n'hésitez pas à ajouter une icône vide de type FontAwesome  dans la page, 
Si vous n'avez pas de visuel concernant l'icône "citation", veuillez ajouter ceci dans le shortcode de la page : <blockquote>
