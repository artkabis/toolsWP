 (()=>{
   fetch('https://cors-anywhere.herokuapp.com/https://le-de.cdn-website.com/942ddfae0a2f4e208ee044040d6b92fc/dms3rep/multi/opt/RS396_42141-lpr-%281%29-2880w-2880w.jpg'
  ,{
      method: "GET",
      contentType: "image/jpeg",
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      }}).then((res)=>{
        const url = new URL(res.url.split('herokuapp.com/')[1]).href;
        const size= res.headers.get("content-length");
        const sizeString = (()=>( size < 1024
          ? size + " Bytes"
          : size < 1048576
          ? (size / 1024).toFixed(2) + " KB"
          : size < 1073741824
          ? (size / 1048576).toFixed(2) + " MB"
          : (size / 1073741824).toFixed(2) + " GB"))()
        console.log({url},{sizeString});
    });
 })();
