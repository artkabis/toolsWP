const newWindow = window.open('', '_blank');
newWindow.document.write('<html><head><title>Structure corrigée</title>');
newWindow.document.write('<style>.missing { background-color: orange; }</style>');
newWindow.document.write('<style>.noMissingHeading { background-color: green; }</style>');
newWindow.document.write('<style>.noMissingHeading span { color: white!important; background: green!important; padding: 5px 20px!important; }</style>');
newWindow.document.write('<style>.H1Cloned span { background: red!important; }</style>');
newWindow.document.write('</head><body>');

hnTagArray.forEach(function (currentHn, index) {
  const currentHnContent = hnTagContentArray[index];
  const currentHnIndex = parseInt(currentHn.charAt(1));
  const parentStyle = window.getComputedStyle(document.querySelector(currentHn));

  if (index === 0 && currentHn === 'h1') {
    newWindow.document.write(`<h1 class="noMissingHeading" style="${getHeadingStyle(true, currentHnIndex, parentStyle)}"><span style="${getSpanStyle(parentStyle, true, false)}">${currentHn}</span> - ${currentHnContent}</h1><br>`);
  } else {
    if (currentHn === 'h1' && hnTagArray.slice(0, index).includes('h1')) {
      const headingStyle = getHeadingStyle(true, currentHnIndex, parentStyle);
      newWindow.document.write(`<h1 class="H1Cloned" style="${headingStyle}"><span style="${getSpanStyle(parentStyle, true, false)}">${currentHn}</span> - ${currentHnContent}</h1><br>`);
    } else {
      const isValid = isHeadingValid(currentHn, previousHn);

      if (!isValid) {
        const missingHeadingsCount = currentHnIndex - (parseInt(previousHn.charAt(1)) + 1);

        for (let i = 1; i <= missingHeadingsCount; i++) {
          const missingHnIndex = parseInt(previousHn.charAt(1)) + i;
          const missingHn = `h${missingHnIndex}`;
          const missingHnContent = `H${missingHnIndex} (Missing Heading ${missingHnIndex})`; // Modified content with tag correction
          const missingHeadingStyle = getHeadingStyle(false, missingHnIndex, parentStyle);
          newWindow.document.write(`<${missingHn} class="missing" style="${missingHeadingStyle}"><span style="${getSpanStyle(parentStyle, false, true)}">${missingHn}</span> - ${missingHnContent}</${missingHn}><br>`);
        }
      }

      const headingStyle = getHeadingStyle(true, currentHnIndex, parentStyle);
      if (index > 0 && !newWindow.document.querySelector(`.${currentHn}.missing`)) {
        newWindow.document.write(`<${currentHn} class="noMissingHeading" style="${headingStyle}"><span style="${getSpanStyle(parentStyle, true, false)}">${currentHn}</span> - ${currentHnContent}</${currentHn}><br>`);
           } else {
        newWindow.document.write(`<${currentHn} style="${headingStyle}"><span style="${getSpanStyle(parentStyle, true, false)}">${currentHn}</span> - ${currentHnContent}</${currentHn}><br>`);
      }
    }

    previousHn = currentHn;
  }
});

newWindow.document.write('</body></html>');
newWindow.document.close();
