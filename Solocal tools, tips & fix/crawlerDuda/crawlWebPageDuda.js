


(() => {
  const originalContent = document.documentElement.outerHTML;
  const newTab = window.open();
  newTab.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Nouvelle Page</title></head><body></body></html>');
  const newBody = newTab.document.querySelector('body');
  const newHead = newTab.document.querySelector('head');
  const script = document.createElement('script');
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
  script.integrity = "sha512-r22gChDnGvBylk90+2e/ycr3RVrDi8DIOkIGNhJlKfuyQM4tIRAI062MaV8sfjQKYVGjOBaZBOA87z+IhZE9DA==";
  script.crossOrigin = "anonymous";
  script.referrerPolicy = "no-referrer";
  newHead.appendChild(script);
  const headers = originalContent.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi);
  if (headers) {
    for (let i = 0; i < headers.length; i++) {
      const headerTag = headers[i].match(/<h([1-6])[^\>]*\>/i)[1];
      const headerContent = headers[i].replace(/<[^>]+>/g, '');
      const startIndex = originalContent.indexOf(headers[i]);
      const nextHeaderIndex = originalContent.indexOf('<h', startIndex + headers[i].length);
      const endIndex = nextHeaderIndex !== -1 ? nextHeaderIndex : originalContent.length;
      let textContent = originalContent.substring(startIndex + headers[i].length, endIndex).replace(/(<([^>]+)>)/gi, '').trim();
      textContent = (!textContent.includes('© 2023')) ? textContent : textContent.split('© 2023')[0];
      const isText = textContent && !/<\w+.*?>/i.test(textContent.trim());
      if (isText) {
        const isExcludedDiv = headers[i].match(/<div[^>]+data-title="Actualités v3"[^>]*>/i);
        if (!isExcludedDiv) {
          const newHeader = newTab.document.createElement(`h${headerTag}`);
          const newHeaderText = newTab.document.createTextNode(headerContent);
          const newContent = newTab.document.createElement('p');
        const contentText = newTab.document.createTextNode(newTab.eval(`document.createRange().createContextualFragment(\`${textContent}\`).textContent`));
            console.log({contentText});
          newContent.appendChild(contentText);
          newHeader.appendChild(newHeaderText);
          newBody.appendChild(newHeader);
          newBody.appendChild(newContent);
        }
      }
    }
  }
setTimeout(() => {
    newTab.eval(`
      console.log('loaded');
      const titres = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const contenu = titres.map((titre, index) => {
        const suivant = titres[index + 1];
        const contenu = [];
        let element = titre.nextElementSibling;
        while (element && element !== suivant) {
          contenu.push((!element.outerHTML.includes('<script')) ? element.outerHTML : element.outerHTML.split('<script')[0]);
          element = element.nextElementSibling;
        }
        return [titre.tagName+' : '+titre.innerHTML, contenu.join('')];
      });
      console.log({contenu});
    
      const workbook = XLSX.utils.book_new();
      console.log({contenu});
      const worksheet = XLSX.utils.aoa_to_sheet(contenu);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Contenu');
    
      XLSX.writeFile(workbook, 'contenu.xlsx');
    `);
  }, 10000);
})();
