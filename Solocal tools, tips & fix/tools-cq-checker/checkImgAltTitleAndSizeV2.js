javascript:(()=>{
    console.clear();
    const formatBytes = (bytes) => {
      return bytes < 1024
        ? bytes + " Bytes"
        : bytes < 1048576
        ? (bytes / 1024).toFixed(2) + " KB"
        : bytes < 1073741824
        ? (bytes / 1048576).toFixed(2) + " MB"
        : (bytes / 1073741824).toFixed(2) + " GB";
    };
   const checkUrlImg = async ($this, url, alt, title, type, width, height, parentWidth, parentHeight) =>{
            const response = await fetch(url, { method: "HEAD" });
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
                    if (type === 'srcImage' && alt === null) {
                        console.log("%c Warning SRC ALT not working : " + url, "color: red");
                    }
                } else {
                    console.warn("Not available");
                }
           
        };

    (function($) {
        $('img').each(function(t, i) {($(this) && $(this).attr('src')) && checkUrlImg($(this), $(this)[0].src, $(this)[0].getAttribute('alt'), $(this)[0].getAttribute('title'), 'srcImage', $(this)[0].width, $(this)[0].height, $(this).width(), $(this).height());});
        $('html *').each(function(i, t) {
            if ($(this).css('background-image') && String($(this).css('background-image')) !== 'none' && String($(this).css('background-image')).includes('url(')) {
                let bgimg = String($(this).css('background-image')).split('url("')[1].split('")')[0];
                let _this = $(this);
                let customImg = new Image();
                bgimg = (bgimg.includes('http') || bgimg.includes('data:image/')) ? bgimg : window.location.origin + bgimg;
                
                const detectAnotherOrigin = (!bgimg.includes(window.location.origin) && !bgimg.includes('data:image/') );
                (detectAnotherOrigin) && console.warn('Image url not current domain origin :',bgimg);
                bgimg = (detectAnotherOrigin) ? window.location.origin + '/wp-content/'+bgimg.split('/wp-content/')[1] : bgimg;
                customImg.src = bgimg;
                if (bgimg) {
                    customImg.onload = function() {
                        (!bgimg.includes('data:image/')) ? checkUrlImg($(this), bgimg, 'no alt -> gbimg', 'no title -> gbimg', 'bgImage', customImg.width, customImg.height, _this.width(), _this.height()) : console.log('base64 img detected : ',bgimg.includes('data:image/'),'  width : ',customImg.width, '  height : ',customImg.height,' url : ',bgimg);
                    }
                }
            }
        });
    })(jQuery)
})();
