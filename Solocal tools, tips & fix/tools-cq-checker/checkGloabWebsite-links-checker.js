javascript:(($)=>{
      console.clear();
     console.log('----------------------------- Check validity global image --------------------------------------------');
    const formatBytes = (bytes)=>{
        return bytes < 1024 ? bytes + " Bytes" : bytes < 1048576 ? (bytes / 1024).toFixed(2) + " KB" : bytes < 1073741824 ? (bytes / 1048576).toFixed(2) + " MB" : (bytes / 1073741824).toFixed(2) + " GB";
    };
    const checkUrlImg = async($this,url,alt,title,type,width,height,parentWidth,parentHeight)=>{
        const response = await fetch(url, {
            method: "GET"
        });
        const fsize = response.headers.get("content-length");
        if (fsize != null) {
            var result = {
                url: new URL(url).href,
                size: formatBytes(fsize),
                alt: alt,
                title: title,
                type: type,
                Imgwidth: width,
                Imgheight: height,
                parentwidth: parentWidth,
                parentheight: parentHeight
            };
            console.table(result, "");
            /*317435 Bytes = 310 KB*/
            if (fsize > 317435) {
                console.log("%c Warning File size exceeds 310 KB : " + url, "color: red");
            }
            if (type === 'srcImage' && alt === null || alt === '') {
                console.log("%c Warning SRC ALT not working : " + url, "color: red");
            }
        } else {
            console.warn("Not available");
        }
    };

        $('img').each(function(t, i) {
            ($(this) && $(this).attr('src') && !$(this).attr('src').includes('mappy')) && checkUrlImg($(this), $(this)[0].src, $(this)[0].getAttribute('alt'), $(this)[0].getAttribute('title'), 'srcImage', $(this)[0].width, $(this)[0].height, $(this).width(), $(this).height());
        });
        $('html *').each(function(i, t) {
            if ($(this).css('background-image') && String($(this).css('background-image')) !== 'none' && String($(this).css('background-image')).includes('url(')) {
                let bgimg = String($(this).css('background-image')).split('url("')[1].split('")')[0];
                let _this = $(this);
                let customImg = new Image();
                bgimg = (bgimg.includes('http') || bgimg.includes('data:image/')) ? bgimg : window.location.origin + bgimg;
                const detectAnotherOrigin = (!bgimg.includes(window.location.origin) && !bgimg.includes('data:image/'));
                (detectAnotherOrigin) && console.warn('Image url not current domain origin :', bgimg);
                bgimg = (detectAnotherOrigin && bgimg.split('/wp-content/')[1]) ? window.location.origin + '/wp-content/' + bgimg.split('/wp-content/')[1] : bgimg;
                customImg.src = bgimg;
                if (bgimg && !bgimg.includes('undefined')) {
                    customImg.onload = function() {
                        if (!bgimg.includes('mappy')) {
                            (!bgimg.includes('data:image/')) ? checkUrlImg($(this), bgimg, 'no alt -> gbimg', 'no title -> gbimg', 'bgImage', customImg.width, customImg.height, _this.width(), _this.height()) : console.log('base64 img detected : ', bgimg.includes('data:image/'), '  width : ', customImg.width, '  height : ', customImg.height, ' url : ', bgimg);
                        }
                    }
                }
            }
        });
    console.log('----------------------------- END Check validity global image --------------------------------------------');



    
    const title = $('title')[0].textContent;
    const desc = $('meta[name="description"]').attr('content');
console.log('----------------------------- Check META --------------------------------------------');
    console.log(`%c Meta title : ${title}  -> caractère : ${title.length} ----- (de 50 à 65)`,`color:${title.length>=50 && title.length<=65 ? "orange" : "red"}`);
    console.log(`%c Meta description : ${desc}  -> caractère : ${desc.length} ----- (de140 à 156)`,`color:${desc.length>=140 && desc.length<=156 ? "orange" : "red"}`);
console.log('----------------------------- END Check META --------------------------------------------');
    

console.log('----------------------------- Check ALT images --------------------------------------------');

$('img').each(function(i,t){
        const href = $(this).attr('href') === 0 || $(this).attr('href') !== null;
        const alt = href ? $(this).attr('alt') : 'NO ALT';
        ($(this).attr('data-src')) && $(this).attr('src',$(this).attr('data-src'));
        (alt)?console.log(alt,this) : console.error('NO ALT >>> ',this);
    });
console.log('----------------------------- END Check ALT images --------------------------------------------');



    console.log('----------------------------- Check Hn Validity --------------------------------------------');

    document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((t,i)=>{
        const nbLetters = t.textContent.length;
        const tagName = t.tagName;
        const tagContent = t.textContent;
        console.table({[tagName]:tagContent,' nb word':nbLetters});
        if((tagName === 'H1' || tagName === "H2") && nbLetters < 50 || nbLetters > 90){console.log('%c'+tagName+' : '+tagContent+'  ------ Erreur -> nombre de caractère : '+nbLetters+', ne rentre pad dans le ratio 50 -> 90','color:red',)}        
    });
        console.log('----------------------------- END Check Hn Validity --------------------------------------------');

    async function checkLinksValidity() {
      const links = Array.from(document.querySelectorAll('a[href]')).map(a => a.href);
      const linkStatus = [];

      for (const link of links) {
         if (!link.includes('mailto') && !link.includes('tel:') && !links.includes('chrome-extension')){
        try {
          const response = await fetch(link, { method: 'HEAD' });
          if (response.ok && response.url.includes('https')) {
            linkStatus.push({ url: link, valid: true, status: response.status });
          } else {
            linkStatus.push({ url: link, valid: false, status: response.status });
          }
        } catch (error) {
          linkStatus.push({ url: link, valid: false, status: error.message });
        }
      }
      }
      console.log('----------------------------- Check valid links --------------------------------------------'); 
      console.table(linkStatus.sort((a, b) => a.valid - b.valid));
    }
    checkLinksValidity();
    console.log('----------------------------- END Check valid links --------------------------------------------'); 
})(jQuery);
