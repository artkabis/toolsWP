cmp=0;
const limit_nb_img =10;
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
const imgs = (document.querySelectorAll('.save-ready')) ? document.querySelectorAll('.save-ready img') :document.querySelectorAll('.author-other img')
const linksArray = Array.from(imgs);
linksArray.forEach(linkEl => {
  const img = linkEl.getAttribute("src");
  const last = img.lastIndexOf('-');
  const last2 = img.lastIndexOf('/');
  const ext = img.substring(img.lastIndexOf('.'),img.length);
  const finalImg = window.location.origin+img.substring(0,last)+ext;
  const name = String(img.substring(last2,img.length).split(ext)[0].substring(0,img.substring(last2,img.length).split(ext)[0].lastIndexOf('-'))).replace('/','');
  console.log('name : ',name,'  link final image : ',finalImg,'  extension : ',ext);
  downloadImage(finalImg,name)
});
