/*1] POUR LISTER LES IMAGES*/
      /******************************************************************************/
      const max_img = Number(prompt("Entrez le nombre maximum d'image à télécharger", "100")), start_img = 0;//params de délimitation
      const containerLink = document.createElement("div");
      containerLink.id = "ContainerLinks";
      document.querySelector("body").appendChild(containerLink);




      const donwloadImages = () => {
        document.querySelectorAll("#ContainerLinks a").forEach(function (t, i) {
          setTimeout(function () {
            t.click();
          }, 1000 * i);
        });

      }
      async function donwloaderMedias(href, name, iteration, ext) {
        // Faire une requête AJAX pour récupérer le contenu du fichier
        const isReady = (iteration <= max_img && String(href).includes('site-privilege'));
        if (isReady) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', href, true);
          //xhr.responseType = 'blob';
          xhr.responseType = 'arraybuffer';
          console.log('_____________________________________extension param : ', ext);
          xhr.onload = async function (e) {
            const arrayBuffer = xhr.response;
            const extension = +ext?.includes('.') ? ext?.split('.')[1] : ext;
            console.log({ extension });
            let mimeType = `image/${extension}`;
            if (extension === 'jpg' || extension === 'JPG') {
              mimeType = 'image/jpeg';
            } else if (extension === 'png') {
              mimeType = 'image/png';
            } else if (extension === 'gif') {
              mimeType = 'image/gif';
            } else if (extension === 'svg') {
              mimeType = 'image/svg+xml';
            }
            const blob = new Blob([arrayBuffer], { type: mimeType });

            if (blob.size > 0 && xhr.status === 200) {
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = name;
              document.getElementById("ContainerLinks").appendChild(link);
              console.log('blob -> ', link.href);
              console.log(iteration + 1, '/', max_img);
              (iteration + 1 === max_img) && donwloadImages();

            }
            else {
              console.error('Erreur lors du téléchargement du fichier : ' + href);
            }
          };
          xhr.send();
        }
      }


      const imgs = (document.querySelectorAll('.save-ready').length) ? document.querySelectorAll('.save-ready img') : document.querySelectorAll('td[data-colname="Fichier"] img');
      const linksArray = Array.from(imgs).slice(start_img, max_img);
      console.log({ linksArray });
      let jsonImg = [];
      linksArray.forEach((linkEl, i) => {
        console.log('i : ', i, 'linkEl : ', linkEl);
        const img = linkEl.getAttribute("src");
        const ext = img.substring(img.lastIndexOf('.'), img.length);
        const last2 = img.lastIndexOf('/');
        var name = "", finalImg = "";
        if (img.match(/\d{3}x\d{3}/m) || img.match(/\d{2}x\d{2}/m)) {
          console.log('Redimentionnement détecté : ', img);
          const last = img.lastIndexOf('-');
          finalImg = window.location.origin + img.substring(0, last) + ext;
          name = String(img.substring(last2, img.length).split(ext)[0].substring(0, img.substring(last2, img.length).split(ext)[0].lastIndexOf('-'))).replace('/', '');
        } else {
          console.log('no redim');
          name = String(img.substring(last2, img.length).split(ext)[0]).replace('/', '');
          finalImg = img;
        }
        console.log('src : ', img, '   name : ', name, '  link final image : ', finalImg, '  extension : ', ext);
        jsonImg.push({ img: finalImg, name: name, cmp: i, extention: ext });
      });
      console.log('_______________ jsonImg : ', jsonImg);
      const downloadAll = (elements) => {
        for (var e in elements) {
          donwloaderMedias(elements[e].img, elements[e].name, elements[e].cmp, elements[e].extention); // Lancement de la construction des img et du download.
        }
      }
      downloadAll(jsonImg);
