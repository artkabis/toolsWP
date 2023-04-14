(() => {
  const titleTags = ["H1", "H2", "H3", "H4", "H5", "H6"];
  const content = document.body.innerText;
  const headers = Array.from(document.querySelectorAll(titleTags.join(",")))
    .filter(header => content.includes(header.innerText.trim()))
    .map(header => ({
      tag: header.tagName,
      content: header.innerText.trim()
    }));

  const result = headers.reduce((acc, header, index, arr) => {
    const nextHeader = arr[index + 1];
    const start = content.indexOf(header.content) + header.content.length;
    const end = nextHeader ? content.indexOf(nextHeader.content) : content.length;
    const text = content.substring(start, end).trim();
    const html = `<${header.tag}>${header.content}</${header.tag}><p>${text}</p>`;
    return acc + html;
  }, "");

  const html = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>${window.location.pathname}</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    </head>
    <body>
      ${result}
      <script>
        setTimeout(function() {
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
        return [titre.tagName+' : '+titre.innerHTML, contenu.join('').replaceAll('&nbsp;',' ')];
      });    
      const workbook = XLSX.utils.book_new();
      console.log({contenu});
      const worksheet = XLSX.utils.aoa_to_sheet(contenu);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Contenu');
    
      XLSX.writeFile(workbook, 'contenu.xlsx');
        }, 8000);
      </script>
    </body>
  </html>`;
  
  const newWindow = window.open("");
  newWindow.document.write(html);
})();
