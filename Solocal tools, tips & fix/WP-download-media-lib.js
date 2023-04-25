/*** Params
 * -- @max_img (Number) -> Nombre d'images maximums à télécharger
 * -- @start_img (Number) -> Débuter le téléchargement à partir de la x image
 ***/
javascript: (() => {
  const max_img = 600,
    start_img = 0; //params de délimitation de start à max
  const containerLink = document.createElement("div");
  containerLink.id = "ContainerLinks";
  document.querySelector("body").appendChild(containerLink);
  async function donwloaderMedias(href, name, iteration) {
    // Faire une requête AJAX pour récupérer le contenu du fichier
    const isReady =
      iteration <= max_img && String(href).includes("site-privilege");
    console.log(
      "loop<=max_img : ",
      iteration <= max_img,
      " loop >= start_img : ",
      iteration >= start_img,
      ' href.includes("site-privilege") :',
      String(href).includes("site-privilege")
    );
    console.log("*************************** isReady : ", isReady);
    if (isReady) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", href, true);
      xhr.responseType = "blob";
      xhr.onload = async function (e) {
        // Récupérer le blob
        var blob = xhr.response; // Vérifier si le blob est valide
        if (blob.size > 0 && xhr.status === 200) {
          // Créer un lien pour télécharger le fichier
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          console.log("href link N°", i, ": ", link.href);
          link.download = name;
          document.getElementById("ContainerLinks").appendChild(link);
          // Attente avec await toutes les dix itérations pour éviter les erreurs 500
          if (iteration % 10 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            link.click();
          } else {
            await new Promise((resolve) => setTimeout(resolve, 500));
            link.click();
          }
        } else {
          // Afficher une erreur en console
          console.error("Erreur lors du téléchargement du fichier : " + href);
        }
      };
      xhr.send();
    }
  }
  const imgs = document.querySelectorAll(".save-ready").length
    ? document.querySelectorAll(".save-ready img")
    : document.querySelectorAll('td[data-colname="Fichier"] img');
  const linksArray = start_img
    ? Array.from(imgs).slice(start_img, Array.from(imgs).length)
    : Array.from(imgs);
  let jsonImg = [];
  linksArray.forEach((linkEl, i) => {
    console.log("i : ", i, "linkEl : ", linkEl);
    const img = linkEl.getAttribute("src");
    const ext = img.substring(img.lastIndexOf("."), img.length);
    const last2 = img.lastIndexOf("/");
    var name = "",
      finalImg = "";
    if (img.match(/\d{3}x\d{3}/m) || img.match(/\d{2}x\d{2}/m)) {
      console.log("Redimentionnement détecté : ", img);
      const last = img.lastIndexOf("-");
      finalImg = window.location.origin + img.substring(0, last) + ext;
      name = String(
        img
          .substring(last2, img.length)
          .split(ext)[0]
          .substring(
            0,
            img.substring(last2, img.length).split(ext)[0].lastIndexOf("-")
          )
      ).replace("/", "");
    } else {
      console.log("no redim");
      name = String(img.substring(last2, img.length).split(ext)[0]).replace(
        "/",
        ""
      );
      finalImg = img;
    }
    console.log(
      "src : ",
      img,
      " name : ",
      name,
      " link final image : ",
      finalImg,
      " extension : ",
      ext
    );
    jsonImg.push({ img: finalImg, name: name, cmp: i });
  });
  console.log("_______________ jsonImg : ", jsonImg);
  const downloadAll = (elements) => {
    for (var e in elements) {
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        donwloaderMedias(elements[e].img, elements[e].name, elements[e].cmp);
        // Lancement de la construction des img et du download.
      })();
    }
  };
  downloadAll(jsonImg);
})();

//À lancer une fois les liens blob générés
document.querySelectorAll("#ContainerLinks a").forEach(function (t, i) {
    if (i % 10 === 0) {
      setTimeout(function () {
        t.click();
      }, 1000 * i);
    } else {
      setTimeout(function () {
        t.click();
      }, 250 * i);
    }
  });
