/*1] POUR LISTER LES IMAGES*/
/******************************************************************************/
const initImageDownloader = () => {
  // Afficher une notification à l'utilisateur
  alert("Ce script va télécharger plusieurs images. Veuillez autoriser les téléchargements multiples lorsque Chrome vous le demandera.");
  
  // Demander les paramètres
  const max_img = Number(prompt("Entrez le nombre maximum d'images à télécharger", "100"));
  const start_img = Number(prompt("À partir de quelle image commencer? (0 pour la première)", "0"));
  const delay = Number(prompt("Délai entre les téléchargements (en ms)", "1000"));
  
  // Créer le conteneur pour les liens
  const containerLink = document.createElement("div");
  containerLink.id = "ContainerLinks";
  containerLink.style.position = "fixed";
  containerLink.style.top = "10px";
  containerLink.style.right = "10px";
  containerLink.style.zIndex = "9999";
  containerLink.style.background = "rgba(255,255,255,0.9)";
  containerLink.style.padding = "10px";
  containerLink.style.borderRadius = "5px";
  containerLink.style.maxHeight = "300px";
  containerLink.style.overflowY = "auto";
  containerLink.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
  
  // Ajouter un titre et un compteur
  const title = document.createElement("h3");
  title.textContent = "Téléchargement d'images";
  title.style.margin = "0 0 10px 0";
  containerLink.appendChild(title);
  
  const counter = document.createElement("div");
  counter.id = "download-counter";
  counter.textContent = "Préparation...";
  counter.style.marginBottom = "10px";
  containerLink.appendChild(counter);
  
  // Ajouter un bouton pour lancer le téléchargement
  const downloadButton = document.createElement("button");
  downloadButton.textContent = "Télécharger toutes les images";
  downloadButton.style.padding = "5px 10px";
  downloadButton.style.marginBottom = "10px";
  downloadButton.style.display = "block";
  downloadButton.style.backgroundColor = "#0073aa";
  downloadButton.style.color = "white";
  downloadButton.style.border = "none";
  downloadButton.style.borderRadius = "3px";
  downloadButton.style.cursor = "pointer";
  containerLink.appendChild(downloadButton);
  
  // Ajouter le conteneur au document
  document.querySelector("body").appendChild(containerLink);

  // Fonction pour télécharger les images
  const downloadImages = () => {
    const links = document.querySelectorAll("#ContainerLinks a.download-link");
    let currentIndex = 0;
    
    const processNextDownload = () => {
      if (currentIndex < links.length) {
        counter.textContent = `Téléchargement ${currentIndex + 1}/${links.length}`;
        links[currentIndex].click();
        currentIndex++;
        setTimeout(processNextDownload, delay);
      } else {
        counter.textContent = `Téléchargement terminé: ${links.length} images`;
        counter.style.color = "green";
      }
    };
    
    // Demander à l'utilisateur s'il est prêt à commencer
    if (confirm(`Chrome va vous demander d'autoriser ${links.length} téléchargements. Êtes-vous prêt?`)) {
      processNextDownload();
    }
  };
  
  // Attacher l'événement au bouton
  downloadButton.addEventListener("click", downloadImages);

  // Fonction pour préparer les liens de téléchargement
  async function prepareMediaLink(href, name, iteration, ext) {
    if (iteration <= max_img && String(href).includes('site-privilege')) {
      try {
        const response = await fetch(href);
        if (!response.ok) {
          throw new Error(`Erreur lors du téléchargement: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        const extension = ext?.includes('.') ? ext.split('.')[1] : ext;
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
        
        if (blob.size > 0) {
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = name + ext;
          link.className = "download-link";
          link.style.display = "block";
          link.style.marginBottom = "5px";
          link.style.fontSize = "12px";
          link.style.textOverflow = "ellipsis";
          link.style.overflow = "hidden";
          link.style.whiteSpace = "nowrap";
          link.style.maxWidth = "200px";
          link.textContent = name + ext;
          document.getElementById("ContainerLinks").appendChild(link);
          
          counter.textContent = `Préparé: ${iteration + 1}/${max_img}`;
          
          // Mettre à jour automatiquement le bouton quand tout est prêt
          if (iteration + 1 === max_img) {
            downloadButton.textContent = `Télécharger ${max_img} images`;
            downloadButton.style.backgroundColor = "#46b450";
          }
        }
      } catch (error) {
        console.error(`Erreur pour ${name}: ${error.message}`);
        counter.textContent += ` (Erreur sur ${name})`;
      }
    }
  }

  // Sélectionner les images selon la structure du site
  const imgs = (document.querySelectorAll('.save-ready').length) 
    ? document.querySelectorAll('.save-ready img') 
    : document.querySelectorAll('td[data-colname="Fichier"] img');
  
  const linksArray = Array.from(imgs).slice(start_img, start_img + max_img);
  console.log(`Préparation de ${linksArray.length} images...`);
  
  // Préparer les données des images
  let jsonImg = [];
  linksArray.forEach((linkEl, i) => {
    const img = linkEl.getAttribute("src");
    const ext = img.substring(img.lastIndexOf('.'), img.length);
    const last2 = img.lastIndexOf('/');
    let name = "", finalImg = "";
    
    if (img.match(/\d{3}x\d{3}/m) || img.match(/\d{2}x\d{2}/m)) {
      console.log('Redimensionnement détecté: ', img);
      const last = img.lastIndexOf('-');
      finalImg = window.location.origin + img.substring(0, last) + ext;
      name = String(img.substring(last2, img.length).split(ext)[0].substring(0, img.substring(last2, img.length).split(ext)[0].lastIndexOf('-'))).replace('/', '');
    } else {
      console.log('Image sans redimensionnement');
      name = String(img.substring(last2, img.length).split(ext)[0]).replace('/', '');
      finalImg = img;
    }
    
    jsonImg.push({ img: finalImg, name: name, cmp: i, extention: ext });
  });
  
  console.log(`Données préparées pour ${jsonImg.length} images`);
  
  // Préparer tous les liens
  const prepareAll = async (elements) => {
    for (let i = 0; i < elements.length; i++) {
      const e = elements[i];
      await prepareMediaLink(e.img, e.name, i, e.extention);
    }
  };
  
  // Lancer la préparation
  prepareAll(jsonImg);
};

// Exécuter le script
initImageDownloader();
