/*** Params
* -- @max_img (Number) -> Nombre d'images maximums à télécharger
* -- @start_img (Number) -> Débuter le téléchargement à partir de la x image
***/
const max_img = 25, start_img = 5;//Ici téléchargement à partir de la cinquième image et jusqu'à la vingt-cinquième
function pause(msec) {
    return new Promise(
        (resolve, reject) => {
            setTimeout(resolve, msec || 1000);
        }
    );
}
let loop = start_img;
function convertirHrefEnBlobEtTelecharger(href,name,cmp) {
    // Faire une requête AJAX pour récupérer le contenu du fichier
    const isReady = (loop<=max_img &&  loop >= start_img && String(href).includes('site-privilege'));
    console.log('loop<=max_img : ',loop<=max_img,'    start_img>= loop : ',start_img>= loop,'     href.includes("site-privilege") :',String(href).includes('site-privilege'));
    console.log('*************************** isReady : ',isReady);
    if(isReady){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', href, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            // Récupérer le blob
            const blob = xhr.response;
            // Créer un lien pour télécharger le fichier
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = name;
            link.click();
        };
        xhr.send();
    }
    loop++
}


const imgs = (document.querySelectorAll('.save-ready').length) ? document.querySelectorAll('.save-ready img') : document.querySelectorAll('td[data-colname="Fichier"] img');
const linksArray = (start_img) ? Array.from(imgs).slice(start_img,Array.from(imgs).length) : Array.from(imgs);
let jsonImg =[];
linksArray.forEach((linkEl,i) => {
    console.log('i : ',i, 'linkEl : ',linkEl);
    const img = linkEl.getAttribute("src");
    const ext = img.substring(img.lastIndexOf('.'),img.length);
    const last2 = img.lastIndexOf('/');
    var name="",finalImg="";
    if(img.match(/\d{3}x\d{3}/m) || img.match(/\d{2}x\d{2}/m) ){
        console.log(redimensionnement détecté : ',img);
      const last = img.lastIndexOf('-');
      finalImg = window.location.origin+img.substring(0,last)+ext;
      name = String(img.substring(last2,img.length).split(ext)[0].substring(0,img.substring(last2,img.length).split(ext)[0].lastIndexOf('-'))).replace('/','');
    }else{
        console.log('no redim');
        name = String(img.substring(last2,img.length).split(ext)[0]).replace('/','');
        finalImg = img;
    }
  console.log('src : ',img,'   name : ',name,'  link final image : ',finalImg,'  extension : ',ext);
  //convertirHrefEnBlobEtTelecharger(finalImg,name,i)
    jsonImg.push({img:finalImg,name:name,cmp:i});
});
console.log('_______________ jsonImg : ',jsonImg);
async function downloadAll(elements,name,i) {
    var count = 0;
    for (var e in elements) {

        convertirHrefEnBlobEtTelecharger(elements[e].img,elements[e].name, elements[e].cmp); // your custom download code here, click or whatever

        if (++count >= 10) {
            await pause(1000);
            count = 0;
        }
    }
}
downloadAll(jsonImg);
