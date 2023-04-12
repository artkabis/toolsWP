
//Récupérer le chemin vers le data binding du site Duda (en mode éditeur uniquement)
javascript:(()=>{
    console.log(new URL(a.url,window.origin).href);
})();

//Une fois le lien visité (page des données du data binding visibles), lancer cette commande : 
const data = JSON.parse(document.querySelector('body pre').innerText)
console.log(data);//il est possible de cibler les éléments par type : collection, elementBindingMap et seoBindingMap, ex : console.log(data.seoBindingMap)
