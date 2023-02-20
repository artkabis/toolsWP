javascript:(() => {
    const formatBytes = (bytes) => {
      if (bytes < 1024) return bytes + " Bytes";
      else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
      else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB";
      else return (bytes / 1073741824).toFixed(2) + " GB";
    };
    
    const checkUrlImg = async ($this, url, alt, title, type, width, height, parentWidth, parentHeight) => {
      const response = await fetch(url, { method: "HEAD" });
      const fsize = response.headers.get("content-length");
      if (fsize != null) {
        const result = {
          url: new URL(url).href,
          size: formatBytes(fsize),
          alt: alt,
          title: title,
          type: type,
          Imgwidth: width,
          Imgheight: height,
          parentwidth: parentWidth,
          parentheight: parentHeight,
        };
        console.table(result, "");
        /*317435 Bytes = 310 KB*/
        if (fsize > 317435) {
          console.log("%c Warning File size exceeds 310 KB : " + url, "color: red");
        }
        if (type === "srcImage" && alt === null) {
          console.log("%c Warning SRC ALT not working : " + url, "color: red");
        }
      } else {
        console.warn("Not available");
      }
    };
    
    const processImages = () => {
      const images = document.querySelectorAll("img");
      images.forEach(($img) => {
        if ($img && $img.src) {
          checkUrlImg(
            $img,
            $img.src,
            $img.getAttribute("alt"),
            $img.getAttribute("title"),
            "srcImage",
            $img.width,
            $img.height,
            $img.clientWidth,
            $img.clientHeight
          );
        }
      });
    };
    
    const processBackgroundImages = () => {
      const divs = document.querySelectorAll("div");
      divs.forEach(($div) => {
        if (
          $div.style.backgroundImage &&
          $div.style.backgroundImage !== "none" &&
          $div.style.backgroundImage.includes("url(")
        ) {
          console.log("------------------------------", $div.style.backgroundImage);
          const bgimg = $div.style.backgroundImage.split('url("')[1].split('")')[0];
          const customImg = new Image();
          const bgImgUrl = bgimg.includes("http")
            ? bgimg
            : window.location.origin + bgimg;
          customImg.src = bgImgUrl;
          customImg.onload = () => {
            checkUrlImg(
              customImg,
              bgImgUrl,
              "no alt -> gbimg",
              "no title -> gbimg",
              "bgImage",
              customImg.width,
              customImg.height,
              $div.clientWidth,
              $div.clientHeight
            );
          };
        }
      });
    };


  processImages();
  processBackgroundImages();
})();
