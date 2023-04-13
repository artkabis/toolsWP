javascript:(()=>{
    document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((t,i)=>{
        console.table({[t.tagName]:t.textContent,' nb word':t.textContent.length})
        if(t.tagName === 'H1' || t.tagName === "H2" && t.textContent.length<50){console.log('%c'+t.tagName+' : '+t.textContent+'  - inférieur à 50 : '+(t.textContent.length)+' < 50','color:red',)}
        if(t.tagName === 'H1' || t.tagName === "H2" && t.textContent.length>90){console.log('%c'+t.tagName+' : '+t.textContent+'  - supperieur à 90 : '+(t.textContent.lenght)+' > 90','color:red',)}
        
    })
})()
