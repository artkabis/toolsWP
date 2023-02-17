jaavascript:(() => {
  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " Bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
    else return (bytes / 1073741824).toFixed(2) + " GB";
  }

  function checkUrlImg(url, alt, title, type, width, height, parentWidth, parentHeight) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.send();
    req.onreadystatechange = function () {
      if (this.readyState == this.HEADERS_RECEIVED) {
        var headers = req.getAllResponseHeaders();
        var arr = headers.trim().split(/[\r\n]+/);
        var map = {};
        arr.forEach(function (line) {
          var parts = line.split(": ");
          var header = parts.shift();
          var value = parts.join(": ");
          map[header] = value;
        });
        fsize = map["content-length"];
          
        if (fsize != null) {
          var result = {
            url: new URL(url).href,
            size: formatBytes(fsize),
            alt: alt,
            title:title,
            type:type,  
          };
            if(type=== 'srcImage'){
                result.Imgwidth=width,
                result.Imgheight=height,
                result.parentwidth=parentWidth,
                result.parentheight=parentHeight
            }
          
          console.table(result, "");
          if (fsize > 248000) {
            console.log("%c Warning File size exceeds 310 KB : "+url , "color: red");
          }
             if (type=== 'srcImage' && alt===null) {
            console.log("%c Warning SRC ALT not working : "+url , "color: red");
          }
        } else {
          console.warn("Not available");
        }
      }
    };
  }
    (function($) {
        document.querySelectorAll('img').forEach(function(t, i) {
            (t && t.src) && checkUrlImg(t.src, t.getAttribute('alt'), t.getAttribute('title'), 'srcImage',t.width,t.height, t.parentElement.clientWidth, t.parentElement.clientHeight);
        });
        document.querySelectorAll('div').forEach(function(t, i) {
            if (t && t.style.backgroundImage && String(t.style.backgroundImage).includes('url(')) {
                let bgimg = t.style.backgroundImage.split('url("')[1].split('")')[0];
                bgimg = (bgimg.includes('http')) ? bgimg : window.location.origin + bgimg;
                (bgimg) && checkUrlImg(bgimg, 'no alt -> gbimg', 'no title -> gbimg', 'bgImage');
            }
        });
        const element = $('div[class*="vc_custom_"]');
        element.each(function(i, t) {
            if ($(this).css('background-image') && String($(this).css('background-image')) !== 'none') {
                console.log('------------------------------', $(this).css('background-image'));
                let bgimg = String($(this).css('background-image')).split('url("')[1].split('")')[0];
                bgimg = (bgimg.includes('http')) ? bgimg : window.location.origin + bgimg;
                (bgimg) && checkUrlImg(bgimg, 'no alt -> gbimg', 'no title -> gbimg', 'bgImage');
            }
        });
    }
    )(jQuery)
}
)()
