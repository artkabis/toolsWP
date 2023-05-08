javascript: (($) => {
  console.clear();
  const url = window.location.href;
  const device = 'mobile';/*prompt('Veuillez indiquer le device à tester (mobile ou desktop) : '); */  
  const apiCall = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=${device}&category=pwa&category=seo&category=performance&category=accessibility`;
  fetch(apiCall).then(response=>response.json()).then(json=>{
    const lighthouse = json.lighthouseResult;
    console.log(lighthouse);
    const lighthouseMetrics = {
      'Testing device' : device,
      'Stack website': lighthouse.stackPacks[0].title,
      'First Contentful Paint': lighthouse.audits['first-contentful-paint'].displayValue,
      'Speed Index': lighthouse.audits['speed-index'].displayValue,
      'Time To Interactive': lighthouse.audits['interactive'].displayValue,
      'Performance score': lighthouse.categories['performance'].score,
      'Image alt ko' : lighthouse.audits['image-alt'].details.items
    };
    console.log(lighthouseMetrics);
  });
  const title = $('meta[property="og:title"]').attr("content");
  const desc = $('meta[name="description"]').attr("content");
  console.log(
    "----------------------------- Check META --------------------------------------------"
  );
  title && title.length > 0
    ? console.log(
        `%c Meta title : ${title} -> caractère : ${title.length} ----- (de 50 à 65)`,
        `color:${title.length >= 50 && title.length <= 65 ? "green" : "red"}`
      )
    : console.log(`%c Meta title non présent !!!`, `color:red`);
  desc && desc.length > 0
    ? console.log(
        `%c Meta description : ${desc} -> caractère : ${desc.length} ----- (de 140 à 156)`,
        `color:${desc.length >= 140 && desc.length <= 156 ? "green" : "red"}`
      )
    : console.log(`%c Meta desc non présente !!!`, `color:red`);
  console.log(
    "----------------------------- END Check META --------------------------------------------"
  );
  console.log(
    "----------------------------- Check ALT images --------------------------------------------"
  );
  $("img, svg").each(function (i, t) {
    const src = $(this).attr("src")
      ? $(this).attr("src")
      : $(this).attr("data-src");
    if (
      (src && this.tagName !== "svg") &&
      !src.includes("mappy") &&
      !src.includes("cdn.manager.solocal.com")
    ) {
      const alt = $(this).attr("alt");
      $(this).attr("data-src") && $(this).attr("src", $(this).attr("data-src"));
      !alt && alt === "" && console.log(`%cNO ALT >>> ${this.src}`,'color:red');
    }else if(this.tagName== "svg" && this.getAttribute('alt') && this.getAttribute('alt').length<1){
        console.log(`%cNO ALT SVG >>> ${this.getAttribute('data-icon-name')}`,'color:red');
        console.log(this);
        
    }
  });
  console.log(
    "----------------------------- END Check ALT images --------------------------------------------"
  );
  console.log(
    "----------------------------- Check Hn Validity --------------------------------------------"
  );
  document.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((t, i) => {
    const nbLetters = t.textContent.length;
    const tagName = t.tagName;
    const tagContent = t.textContent;
    let words = t.textContent.split(' ');
    words = words.filter(w=>w.length>2)
    //console.log('nb words : ',words.length,' mots comptabilisés : ',words.join(','))
    console.log({
      [tagName]: tagContent,
      " nb lettres": nbLetters,
      "nombre de mots comptabilisés (de 5 à 8) " : Number(words.length),
      'mots comptabilisés' : words.join(','),
      node: t,
      index: i,
    });
    if (
      ((tagName === "H1" || tagName === "H2") && nbLetters < 50) ||
      nbLetters > 65
    ) {
      console.log(
        "%c" +
          tagName +
          " : " +
          tagContent +
          " ------ Erreur -> nombre de caractères : " +
          nbLetters +
          ", ne rentre pas dans la préco de 50 -> 65 caractères",
        "color:red"
      );
    }
  });
  console.log(
    "----------------------------- END Check Hn Validity --------------------------------------------"
  );
  const formatBytes = (bytes) => {
    return bytes < 1024
      ? bytes + " Bytes"
      : bytes < 1048576
      ? (bytes / 1024).toFixed(2) + " KB"
      : bytes < 1073741824
      ? (bytes / 1048576).toFixed(2) + " MB"
      : (bytes / 1073741824).toFixed(2) + " GB";
  };
  const checkUrlImg = async (
    $this,
    url,
    alt,
    title,
    type,
    width,
    height,
    parentWidth,
    parentHeight
  ) => {
    const response = await fetch(url, {
      method: "GET",
    });
    const fsize = response.headers.get("content-length");
    if (fsize != null) {
      var result = {
        url: new URL(url).href,
        target: $this,
        size: formatBytes(fsize),
        alt: alt,
        title: title,
        type: type,
        Imgwidth: width,
        Imgheight: height,
        parentwidth: parentWidth,
        parentheight: parentHeight,
        ratioWidth: width / parentWidth,
        ratioHeight: height / parentHeight,
        ratio : Number((width / parentWidth + height / parentHeight / 2 ).toFixed(2))
      };
      console.log(result, "");
      /*317435 Bytes = 310 KB*/
      if (fsize > 317435) {
        console.log(
          "%c Warning File size exceeds 310 KB : " + url,
          "color: red"
        );
      }
      if ((type === "srcImage" && alt === null) || alt === "") {
        console.log("%c Warning SRC ALT not working : " + url, "color: red");
      }
    } else {
      console.log("%cNot available",'color:yellow');
    }
  };
  const checkerImageWP = () => {
    if ($("#Content").length) {
      console.log(
        "----------------------------- Check validity global image --------------------------------------------"
      );
      $("img").each(function (t, i) {
        $(this) &&
          $(this).attr("src") &&
          !$(this).attr("src").includes("mappy") &&
          !$(this).attr("src").includes("cdn.manager.solocal.com") &&
          checkUrlImg(
            $(this),
            $(this)[0].src,
            $(this)[0].getAttribute("alt"),
            $(this)[0].getAttribute("title"),
            "srcImage",
            $(this)[0].naturalWidth,
            $(this)[0].naturalHeight,
            $(this)[0].parentNode.offsetWidth,
            $(this)[0].parentNode.offsetHeight
          );
      });
      $("html *").each(function (i, t) {
        if (
          $(this).css("background-image") &&
          String($(this).css("background-image")) !== "none" &&
          String($(this).css("background-image")).includes("url(")
        ) {
          let bgimg = String($(this).css("background-image"))
            .split('url("')[1]
            .split('")')[0];
          let _this = $(this);
          let customImg = new Image();
          bgimg =
            bgimg.includes("http") || bgimg.includes("data:image/")
              ? bgimg
              : window.location.origin + bgimg;
          const detectAnotherOrigin =
            !bgimg.includes(window.location.origin) &&
            !bgimg.includes("data:image/");
          detectAnotherOrigin &&
            console.warn("Image url not current domain origin :", bgimg);
          bgimg =
            detectAnotherOrigin && bgimg.split("/wp-content/")[1]
              ? window.location.origin +
                "/wp-content/" +
                bgimg.split("/wp-content/")[1]
              : bgimg;
          customImg.src = bgimg;
          if (bgimg && !bgimg.includes("undefined")) {
            customImg.onload = function () {
              if (
                !bgimg.includes("mappy") &&
                !bgimg.includes("cdn.manager.solocal.com")
              ) {
                !bgimg.includes("data:image/")
                  ? checkUrlImg(
                      $(this),
                      bgimg,
                      "no alt -> gbimg",
                      "no title -> gbimg",
                      "bgImage",
                      customImg.naturalWidth,
                      customImg.naturalHeight,
                      _this[0].parentNode.offsetWidth,
                      _this[0].parentNode.offsetHeight
                    )
                  : console.log(
                      "base64 img detected : ",
                      bgimg.includes("data:image/"),
                      " width : ",
                      customImg.width,
                      " height : ",
                      customImg.height,
                      " url : ",
                      bgimg
                    );
              }
            };
          }
        }
      });
    }
  };
  console.log(
    "--------------------- Start check validity links -----------------------------"
  );
  let timeout = 30000;
  function check(_url,_txt,_node) {
    const response = {
      status: null,
      document: null,
    };
    return new Promise(function (resolve, reject) {
      var XMLHttpTimeout = null;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function (data) {
        if (xhr.readyState == 4) {
          clearTimeout(XMLHttpTimeout);
          if (200 <= xhr.status && xhr.status < 400) {
            response.document = xhr.responseText;
          }
          response.source = "xhr";
          if (xhr.responseURL == _url.split("#")[0]) {
            response.status = xhr.status;
          } else {
            response.status = xhr.status;
          }
          resolve(response);
          response.status !== 404
            ? console.log(
                `url : ${_url} %c${_txt} ->  %cstatus : %c${response.status}`,
                "color:cornflowerblue;","color:white;","color:green"
              )
            : (console.log(
                `url : ${_url} %c${_txt} -> %cstatus : %c${response.status}`,
                "color:cornflowerblue;","color:white;","color:red"
              ),console.log('node : ',_node));
        }
      };
      try {
        xhr.open("GET", _url, true);
        xhr.onerror = function() {
          response.status = 0;
          resolve(response);
        };
        xhr.send();
      } catch (e) {
        //console.log(e);
        response.status = 0;
        resolve(response);
      }
      XMLHttpTimeout = setTimeout(function () {
        response.status = 408;
        resolve(response);
        xhr.abort();
      }, (timeout += 1000));
    });
  }
  document.querySelectorAll("a").forEach(function (t, i) {
    let url = t.getAttribute("href");
    
    if (url) {
      url = (url.at(0) === "/" || url.at(0) === "?") ? window.location.origin + url : url;
      let prepubRefonteWPCheck = (url.includes('site-privilege.pagesjaunes') || url.includes('solocaldudaadmin.eu-responsivesiteeditor')) ? true : !url.includes("pagesjaunes");
      const verif =
        !url.includes("tel:") &&
        !url.includes("mailto:") &&
        !url.includes("javascript:") &&
        !url.includes("logflare") &&
        !url.includes("solocal.com") &&
        !url.includes("sp.report-uri") &&
        !url.includes("chrome-extension") &&
        prepubRefonteWPCheck &&
        url.at(0) !== "#";
        //console.log({url},'at -4 : ',url.at(-4),'    textContent : ',t.textContent,t);
        const txtContent = (url && url.at(-4) && !url.at(-4).includes('.') && t.textContent.length >1) ? ',  text : '+t.innerText.replace(/(\r\n|\n|\r)/gm, "") : '';
      verif && url.includes(window.location.origin) && check(url,txtContent,t);
      verif &&
        !url.includes(window.location.origin) &&
        (console.log(`%c Vérifier manuellement ce lien ${url,txtContent}`, "color:red"),
        console.log(t));
    }
  });
  setTimeout(function () {
    console.log(
      "--------------------- END check validity links -----------------------------"
    );
    $("#Wrapper").length && checkerImageWP();
  }, document.querySelectorAll("a").length * 210);
})(jQuery);
