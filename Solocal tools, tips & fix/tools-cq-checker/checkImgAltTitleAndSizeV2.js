(()=>{
    function formatBytes(bytes) {
        if (bytes < 1024)
            return bytes + " Bytes";
        else if (bytes < 1048576)
            return (bytes / 1024).toFixed(2) + " KB";
        else if (bytes < 1073741824)
            return (bytes / 1048576).toFixed(2) + " MB";
        else
            return (bytes / 1073741824).toFixed(2) + " GB";
    }
    function checkUrlImg($this, url, alt, title, type, width, height, parentWidth, parentHeight) {
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.send();
        req.onreadystatechange = function() {
            if (this.readyState == this.HEADERS_RECEIVED) {
                var headers = req.getAllResponseHeaders();
                var arr = headers.trim().split(/[\r\n]+/);
                var map = {};
                arr.forEach(function(line) {
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
                        title: title,
                        type: type,
                        Imgwidth: width,
                        Imgheight: height,
                        parentwidth: parentWidth,
                        parentheight: parentHeight
                    };
                    console.table(result, "");
                    if (fsize > 248000) {
                        console.log("%c Warning File size exceeds 310 KB : " + url, "color: red");
                    }
                    if (type === 'srcImage' && alt === null) {
                        console.log("%c Warning SRC ALT not working : " + url, "color: red");
                    }
                } else {
                    console.warn("Not available");
                }
            }
        }
        ;
    }
    (function($) {
        $('img').each(function(t, i) {
            ($(this) && $(this).attr('src')) && checkUrlImg($(this), $(this)[0].src, $(this)[0].getAttribute('alt'), $(this)[0].getAttribute('title'), 'srcImage', $(this)[0].width, $(this)[0].height, $(this).width(), $(this).height());
        });
        $('div').each(function(i, t) {
            if ($(this).css('background-image') && String($(this).css('background-image')) !== 'none' && String($(this).css('background-image')).includes('url(')) {
                console.log('------------------------------', $(this).css('background-image'));
                let bgimg = String($(this).css('background-image')).split('url("')[1].split('")')[0];
                let _this = $(this);
                let customImg = new Image();
                bgimg = (bgimg.includes('http')) ? bgimg : window.location.origin + bgimg;
                customImg.src = bgimg;
                if (bgimg) {
                    customImg.onload = function() {
                        checkUrlImg($(this), bgimg, 'no alt -> gbimg', 'no title -> gbimg', 'bgImage', customImg.width, customImg.height, _this.width(), _this.height());
                    }
                }
            }
        });
    })(jQuery)
})();
