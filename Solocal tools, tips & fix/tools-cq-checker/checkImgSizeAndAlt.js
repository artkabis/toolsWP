javascript:(()=>{
  function formatBytes(bytes) {
      return bytes < 1024
        ? `${bytes} Bytes`
        : bytes < 1048576
        ? `${(bytes / 1024).toFixed(2)} KB`
        : bytes < 1073741824
        ? `${(bytes / 1048576).toFixed(2)} MB`
        : `${(bytes / 1073741824).toFixed(2)} GB`;
    }

    async function checkUrlImg(url, alt = '', type) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        const headers = response.headers;
        const size = headers.get('content-length');
        console.table({ url, size: formatBytes(size), alt, type });
      } catch (error) {
        console.warn('Not available');
      }
    }

    const images = [...document.querySelectorAll('img')];
    images.forEach(({ src, alt }) => {
      src && checkUrlImg(src, alt, 'srcImage');
    });

    const bgImages = [...document.querySelectorAll('div')].filter(
      ({ style: { backgroundImage } }) => backgroundImage
    );
    bgImages.forEach(({ style: { backgroundImage } }) => {
      let bgimg = backgroundImage.split('url("')[1].split('")')[0];
      bgimg = bgimg.includes('http') ? bgimg : `${window.location.origin}${bgimg}`;
      checkUrlImg(bgimg, 'no alt -> gbimg', 'bgImage');
    });

    $(() => {
      $('div[class*="vc_custom_"]')
        .filter(({ style: { 'background-image': bgImage } }) => bgImage !== 'none')
        .forEach(({ style: { 'background-image': bgImage } }) => {
          let bgimg = bgImage.split('url("')[1].split('")')[0];
          bgimg = bgimg.includes('http') ? bgimg : `${window.location.origin}${bgimg}`;
          checkUrlImg(bgimg, 'no alt -> gbimg', 'bgImage');
        });
    });
})();
