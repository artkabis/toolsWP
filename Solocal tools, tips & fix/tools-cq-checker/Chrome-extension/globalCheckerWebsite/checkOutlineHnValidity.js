const isHeadingValid = (currentHn, previousHn) => {
    const currentHnIndex = parseInt(currentHn.charAt(1));
    const previousHnIndex = parseInt(previousHn.charAt(1));
  
    if (currentHn === previousHn) {
      return false; // Hn identique à l'en-tête précédent, non valide
    }
  
    if (currentHnIndex !== previousHnIndex + 1) {
      return false; // L'incrémentation n'est pas respectée, non valide
    }
  
    return true; // Hn valide
  }
function hasDuplicateH1() {
  const h1Tags = document.querySelectorAll('h1');
  const h1Texts = Array.from(h1Tags).map((h1) => h1.innerText.toLowerCase());
  const uniqueH1Texts = new Set(h1Texts);
  
  return h1Texts.length !== uniqueH1Texts.size;
}
console.log('duplicate h1 : ',hasDuplicateH1());
  function getHeadingStyle(isValid, currentHnIndex, parentStyle) {
    const backgroundColor = isValid ? parentStyle.backgroundColor : 'orange';
    const margin = currentHnIndex * 50;
  
    return `margin-left: ${margin}px; color: green; display: flex; align-items: center; background-color: ${backgroundColor};`;
  }
  
  function getSpanStyle(parentStyle, isValid, isMissingHeading) {
    let backgroundColor = (isMissingHeading) ?  'orange' : isValid ? 'green' : 'green';
    return `color: white; background: ${backgroundColor}; text-transform: uppercase; padding: 5px 20px;`;
  }
  
  let hnTagArray = [],
    hnTagContentArray = [];
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function (t, i) {
    hnTagArray.push(t.tagName.toLowerCase());
    hnTagContentArray.push(t.innerText);
  });
  
  let structure = '', 
    previousHn = null;
  
  hnTagArray.forEach(function (currentHn, index) {
    const currentHnContent = hnTagContentArray[index];
    const currentHnIndex = parseInt(currentHn.charAt(1));
    const parentStyle = window.getComputedStyle(document.querySelector(currentHn));
  
    if (index > 0) {
      const isValid = isHeadingValid(currentHn, previousHn);
  
      if (!isValid) {
        const missingHeadingsCount = currentHnIndex - (parseInt(previousHn.charAt(1)) + 1);
  
        for (let i = 1; i <= missingHeadingsCount; i++) {
          const missingHnIndex = parseInt(previousHn.charAt(1)) + i;
          const missingHn = `h${missingHnIndex}`;
          const missingHnContent = `Missing Heading - ${missingHn}`;
          const missingHeadingStyle = getHeadingStyle(false, missingHnIndex, parentStyle);
          structure += `<${missingHn} class="missing" style="${missingHeadingStyle}"><span style="${getSpanStyle(parentStyle, false, true)}">${missingHn}</span> - ${missingHnContent}</${missingHn}><br>`;
              // Vérifier les doublons de H1
            
        }
      }
          if (currentHn === 'h1' && hasDuplicateH1()) {
            structure += `<${currentHn} class="duplicate" style="${getHeadingStyle(false, currentHnIndex, parentStyle)}"><span style="${getSpanStyle(parentStyle, false, false)}">Warning: Duplicate H1</span> - ${currentHnContent}</${currentHn}><br>`;
          }
    };
    const headingStyle = getHeadingStyle(true, currentHnIndex, parentStyle);
    structure += `<${currentHn} style="${headingStyle}"><span style="${getSpanStyle(parentStyle, true, false)}">${currentHn}</span> - ${currentHnContent}</${currentHn}><br>`;
    previousHn = currentHn;
  });
  
  const newWindow = window.open('', '_blank');
  newWindow.document.write('<html><head><title>Structure corrigée</title>');
  newWindow.document.write('<style>.missing {background-color: white!important;color: orange!important;}.noMissingHeading { background-color:green }.duplicate { background-color: orange }</style>');
  newWindow.document.write(`</head><body>${structure}<body></html>`);
  newWindow.document.close();
