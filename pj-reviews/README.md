# PJ-Reviews V2

## Déploiement : 
- Dans votre page, veuillez intégrer un élément de type "structure" > "HTML Brut". 
- Sur ce composant, ajouter l'id : pj-wrapper
- Cette structure comportera ceci :
```html
<link rel="stylesheet" href="/wp-content/plugins/pj-prolive/assets/css/font-awesome.min.css?ver=4.7.0" crossorigin="anonymous" referrerpolicy="no-referrer" />
<div id="PJ-review-container"></div>
```

- Dans Composium -> Custom JS, injectez le JavaScript présent dans le fichier HTML rattaché à ce repo.
- Faites de même pour la partie CSS, que vous pouvez déposer dans la page.

## Infos complémentaires :
Cette nouvelle version permet désormais d'embarquer la liste des commentaires pj-pro via n'importe quel epj.

Si vous rencontrez un problème concernant l'affichage des icônes "star", n'hésitez pas à ajouter une icône vide de type FontAwesome  dans la page, 
Si vous n'avez pas de visuel concernant l'icône "citation", veuillez ajouter ceci dans le shortcode de la page : <blockquote>

### !!! Attention !!!
Vous avez deux éléments qui doivent être modifiés (visible via "xxxxxxx") : 
  - L'API key (pour l'autorisation de la requête (dans le header de celle-ci), vous devez me la demander soit par Teams, soit par mail
  - L'epj du client concerné

### Axes d'améliorations possibles : 
- Récupération des reply de chaque commentaire : 
```javascript
        //Si besoin du retour client sur le commentaire ciblé ->
        var reply_review = [], date_reply_review = [];
        console.log('reeply >>> ',reviews[i].right_of_reply);
        
        if(reviews[i].right_of_reply !== undefined){
            for(var k =0; k<reviews[i].right_of_reply.length;k++ ){reply_review.push(reviews[i].right_of_reply[k].comment);date_reply_review.push(reviews[i].right_of_reply[k].date_creation);}
        }
        console.log(reply_review,date_reply_review);      
```
