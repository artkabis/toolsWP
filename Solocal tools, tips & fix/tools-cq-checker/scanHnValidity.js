javascript:(()=>{
    document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((t,i)=>{
        const nbLetters = t.textContent.length;
        const tagName = t.tagName;
        const tagContent = t.textContent;
        console.table({[tagName]:tagContent,' nb word':nbLetters});
        if((tagName === 'H1' || tagName === "H2") && nbLetters < 50 || nbLetters > 90){console.log('%c'+tagName+' : '+tagContent+'  ------ Erreur -> nombre de caractère : '+nbLetters+', ne rentre pad dans le ratio 50 -> 90','color:red',)}        
    })
})()
