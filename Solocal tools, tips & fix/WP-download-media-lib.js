/*** Params
 * -- @max_img (Number) -> Nombre d'images maximums à télécharger
 * -- @start_img (Number) -> Débuter le téléchargement à partir de la x image
 ***/
const max_img = 200, start_img = 0;//params de délimitation
const containerLink = document.createElement("div");
containerLink.id = "ContainerLinks";
document.querySelector("body").appendChild(containerLink);




/*************************** Lanch auto donwloading ***************************************************/
const downloadImages = () => document.querySelectorAll("#ContainerLinks a").forEach(function (t, i) {setTimeout(t.click(), 600 * i)});


//Images in medias lib and send to Array
const imgs = (document.querySelectorAll('.save-ready').length) ? document.querySelectorAll('.save-ready img') : document.querySelectorAll('td[data-colname="Fichier"] img');
const linksArray = (start_img) ? Array.from(imgs).slice(start_img,Array.from(imgs).length) : Array.from(imgs);

const donwloaderMedias = (href,name,iteration) =>{
    const isReady = (iteration<=max_img && String(href).includes('site-privilege'));
    if(isReady){
        var link = document.createElement('a');
        link.href = href;
        link.download = name;
        document.getElementById("ContainerLinks").appendChild(link);
        console.log('link href -> ',link.href,'  n°',iteration+1);
        (linksArray.length === iteration) && dowloadImages();
    }
}
 
 

let jsonImg =[];
linksArray.forEach((linkEl,i) => {
    console.log('i : ',i, 'linkEl : ',linkEl);
    const img = linkEl.getAttribute("src");
    const ext = img.substring(img.lastIndexOf('.'),img.length);
    const last2 = img.lastIndexOf('/');
    var name="",finalImg="";
    if(img.match(/\d{3}x\d{3}/m) || img.match(/\d{2}x\d{2}/m) ){
      console.log('Redimentionnement détecté : ',img);
      const last = img.lastIndexOf('-');
      finalImg = window.location.origin+img.substring(0,last)+ext;
      name = String(img.substring(last2,img.length).split(ext)[0].substring(0,img.substring(last2,img.length).split(ext)[0].lastIndexOf('-'))).replace('/','');
    }else{
        console.log('no redim');
        name = String(img.substring(last2,img.length).split(ext)[0]).replace('/','');
        finalImg = img;
    }
  console.log('src : ',img,'   name : ',name,'  link final image : ',finalImg,'  extension : ',ext);
  jsonImg.push({img:finalImg,name:name,cmp:i});
});
console.log('_______________ jsonImg : ',jsonImg);
const downloadAll = (elements) => {
    for (var e in elements) {
        donwloaderMedias(elements[e].img,elements[e].name, elements[e].cmp); // Lancement de la construction des img et du download.
    }
}
downloadAll(jsonImg);



