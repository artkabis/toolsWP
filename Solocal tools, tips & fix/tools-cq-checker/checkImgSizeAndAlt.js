javascript:(()=>{
    function formatBytes(bytes) {
        if (bytes < 1024)
            return bytes + " Bytes";
        else if (bytes < 1048576)
            return (bytes / 1024).toFixed(2) + " KB";
        else if (bytes < 1073741824)
            return (bytes / 1048576).toFixed(2) + " MB";
        else
            return (bytes / 1073741824).toFixed(2) + " GB"
    }
    function checkUrlImg(url,alt,type){
        var req = new XMLHttpRequest();
        req.open('GET', url, !0);
        req.send();
        req.onreadystatechange = function() {
            if (this.readyState == this.HEADERS_RECEIVED) {
                var headers = req.getAllResponseHeaders();
                var arr = headers.trim().split(/[\r\n]+/);
                var map = {};
                arr.forEach(function(line) {
                    var parts = line.split(': ');
                    var header = parts.shift();
                    var value = parts.join(': ');
                    map[header] = value
                });
                fsize = map['content-length'];
                if (fsize != null) {
                    console.table({url : url,'size':formatBytes(fsize),'alt':alt,type:type})
                } else {
                    console.warn("Not available")
                }
            }
        }
    }



    document.querySelectorAll('img').forEach(function(t,i){
        (t && t.src)&&checkUrlImg(t.src,t.getAttribute('alt'),'srcImage');
    });
    
    document.querySelectorAll('div').forEach(function(t,i){
        if(t.style.backgroundImage){
            let bgimg = t.style.backgroundImage.split('url("')[1].split('")')[0];
            bgimg = (bgimg.includes('http')) ? bgimg : window.location.origin +bgimg;
            (bgimg)&&checkUrlImg(bgimg,'no alt -> gbimg','bgImage')
        }
    });
    (function($){
        const element = $('div[class*="vc_custom_"]');
        element.each(function(i,t){
            if($(this).css('background-image') && String($(this).css('background-image'))!== 'none'){
                let bgimg = String($(this).css('background-image')).split('url("')[1].split('")')[0];
                bgimg = (bgimg.includes('http')) ? bgimg : window.location.origin +bgimg;
                (bgimg)&&checkUrlImg(bgimg,'no alt -> gbimg','bgImage')
            }
        });
    })(jQuery);
})();
