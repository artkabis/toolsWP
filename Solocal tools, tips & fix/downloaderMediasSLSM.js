/*** Params
* -- @limit_nb_img (Number) -> Nombre d'image maximum à télécharger
* -- @start_img (Number) -> Débuter le téléchargement à partir de la x image (null si désactivé)
***/

//Attention sur Chrome il n'est pas possible que de télécharger des pack de 10 images. Vous devez donc utiliser le start_img et limit_nb_img afin d'avoir de 0 à 9, de 10 à 20
var cmp=0;
const limit_nb_img = 30,start_img = 0;
async function downloadImage(imageSrc,name) {
    if(cmp<limit_nb_img){
      const image = await fetch(imageSrc)
      const imageBlog = await image.blob()
      const imageURL = URL.createObjectURL(imageBlog)
      const link = document.createElement('a')
      link.href = imageURL
      link.download = name
      document.body.appendChild(link)
        console.log('link inner async : ',link);
      //link.click()
      //document.body.removeChild(link)
    }
    cmp++;
}
const imgs = (document.querySelectorAll('.photo-holder').length) ? document.querySelectorAll('.photo-holder > img') : document.querySelectorAll('td[data-colname="Fichier"] img');
const linksArray = (start_img) ? Array.from(imgs).slice(start_img,Array.from(imgs).length) : Array.from(imgs);
linksArray.forEach(linkEl => {
    const img = linkEl.getAttribute("src");
    const ext = img.substring(img.lastIndexOf('.'),img.length);
    const last = img.includes("_os") ? img.split("_os")[0]+"_os"+ext :  img.split("_rs")[0]+"_rs"+ext;
    const last2 = img.lastIndexOf('/');
    var name= last.substring(last2+1,last.length).split('.'+ext)[0];

 downloadImage(last,name)
});
