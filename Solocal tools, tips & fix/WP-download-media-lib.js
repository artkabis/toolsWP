/*** Params
* -- @limit_nb_img (Number) -> Nombre d'image maximum à télécharger
* -- @start_img (Number) -> Débuter le téléchargement à partir de la x image (null si désactivé)
***/

const limit_nb_img = 20,start_img = 2;
let cmp = start_img;
async function downloadImage(imageSrc,name, id) {
      const image = await fetch(imageSrc)
      const imageBlog = await image.blob()
      const imageURL = URL.createObjectURL(imageBlog)
      const link = document.createElement('a')
      link.href = imageURL
      link.id='imgDownload'+id;
      link.download = name
        console.log(link);
      document.body.appendChild(link)
        if(cmp < limit_nb_img){
          link.click()
          //document.body.removeChild(link)
        }
    cmp++;
}
const imgs = (document.querySelectorAll('.save-ready').length) ? document.querySelectorAll('.save-ready img') : document.querySelectorAll('td[data-colname="Fichier"] img');
const linksArray = (start_img) ? Array.from(imgs).slice(start_img,Array.from(imgs).length) : Array.from(imgs);
linksArray.forEach((linkEl,i) => {
    console.log('i : ',i, 'linkEl : ',linkEl);
    const img = linkEl.getAttribute("src");
    const ext = img.substring(img.lastIndexOf('.'),img.length);
    const last2 = img.lastIndexOf('/');
    var name="",finalImg="";
    if(img.match(/\d{3}x\d{3}/m) || img.match(/\d{2}x\d{2}/m) ){
        console.log('redimentionnement detecté : ',img);
      const last = img.lastIndexOf('-');
      finalImg = window.location.origin+img.substring(0,last)+ext;
      name = String(img.substring(last2,img.length).split(ext)[0].substring(0,img.substring(last2,img.length).split(ext)[0].lastIndexOf('-'))).replace('/','');
    }else{
        console.log('no redim');
        name = String(img.substring(last2,img.length).split(ext)[0]).replace('/','');
        finalImg = img;
    }
  console.log('src : ',img,'   name : ',name,'  link final image : ',finalImg,'  extension : ',ext);
  downloadImage(finalImg,name,i)
});
