var cmp=0;
const limit_nb_img =10,start_img = 20;
async function downloadImage(imageSrc,name) {
    cmp++
    if(cmp<limit_nb_img){
      const image = await fetch(imageSrc)
      const imageBlog = await image.blob()
      const imageURL = URL.createObjectURL(imageBlog)
      const link = document.createElement('a')
      link.href = imageURL
      link.download = name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
}
const imgs = (document.querySelectorAll('.save-ready')) ? document.querySelectorAll('.save-ready img') :document.querySelectorAll('.author-other img');
let linksArray = Array.from(imgs);
console.log('tab link full > ',linksArray);
(start_img) && (linksArray = Array.from(imgs).splice(start_img-1,Array.from(imgs).length),console.log('tab link start more > ',linksArray));
linksArray.forEach(linkEl => {
    const img = linkEl.getAttribute("src");
    const ext = img.substring(img.lastIndexOf('.'),img.length);
    const last2 = img.lastIndexOf('/');
    var name="",finalImg="";
    if(img.match(/\d{3}x\d{3}/m)){
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
  downloadImage(finalImg,name)
});
