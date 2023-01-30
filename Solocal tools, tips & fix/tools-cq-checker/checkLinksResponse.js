javascript:(()=>{
  async function checkLinksValidity() {
      const links = Array.from(document.querySelectorAll('a[href]')).map(a => a.href);
      const linkStatus = [];

      for (const link of links) {
         if (!link.includes('mailto') && !link.includes('tel:') && !links.includes('chrome-extension')){
        try {
          const response = await fetch(link, { method: 'HEAD' });
          if (response.ok && response.url.includes('https')) {
            linkStatus.push({ url: link, valid: true, status: response.status });
          } else {
            linkStatus.push({ url: link, valid: false, status: response.status });
          }
        } catch (error) {
          linkStatus.push({ url: link, valid: false, status: error.message });
        }
      }
      }

      console.table(linkStatus.sort((a, b) => a.valid - b.valid));
    }
    checkLinksValidity();
})();
