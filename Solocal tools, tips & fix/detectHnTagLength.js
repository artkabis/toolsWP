javascript:(()=>{
  const allHnElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  allHnElements.forEach(function(element) {
    element.innerHTML = `${element.innerHTML} <span style="color:red;background:black;padding:15ps">Niveau : ${element.tagName} - Nombre de caractères : ${element.innerText.length}</span>`;
  });
})();
