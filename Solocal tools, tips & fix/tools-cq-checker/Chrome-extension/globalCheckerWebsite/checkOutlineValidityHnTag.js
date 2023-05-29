const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
let previousLevel = 0;
let previousIndex = -1;
let hasH1 = false;
let cmp=0;
headings.forEach((heading, index) => {
    cmp++;
  const currentLevel = parseInt(heading.tagName.charAt(1), 10);
  index = parseInt(heading.tagName.charAt(1), 10);
  if (currentLevel > previousLevel) {
    previousIndex = index - 1;
  } else if (currentLevel < previousLevel) {
    previousIndex = getPreviousIndex(headings, currentLevel, index - 1);
  }
  
  let validity;
  if (currentLevel === 1) {
    validity = true;
    hasH1 = true;
  } else if (previousIndex >= 0 && currentLevel > parseInt(headings[previousIndex].tagName.charAt(1), 10)) {
    validity = false;
  } else {
    validity = true;
    if (index > 0 && index < headings.length - 1) {
      const previousSiblingLevel = parseInt(headings[index - 1].tagName.charAt(1), 10);
      const nextSiblingLevel = parseInt(headings[index + 1].tagName.charAt(1), 10);
      if (previousSiblingLevel !== currentLevel || nextSiblingLevel !== currentLevel) {
        validity = false;
      }
    }
  }

  let message = `Tag: ${heading.tagName}, Current Index: ${index}, Previous Index: ${previousIndex}`;
  let color = validity ? 'green' : 'red';

  if (validity) {
      console.log(heading, ' :  ',index,cmp);
    if (currentLevel === 1 && cmp > 1 && hasH1) {
        validity = false;
      message += `, Validity: ${validity}, Duplicate H1`;
      color = 'red';
    } else {
        validity = true;
      message += `, Validity: ${validity}`;
    }
  } else {
      validity = false
    message += `, Validity: ${validity}`;
  }

  let iteration = getIteration(headings, currentLevel, index);
  message += `, Iteration: ${iteration}`;

  console.log(`%c${message}`, `color:${color}`);

  previousLevel = currentLevel;
});

if (previousLevel > 1) {
  const lastHeadingIndex = headings.length - 1;
  const previousIndex = getPreviousIndex(headings, previousLevel - 1, lastHeadingIndex - 1);
  console.log(`%cTag: ${headings[lastHeadingIndex].tagName}, Current Index: ${lastHeadingIndex}, Previous Index: ${previousIndex}, Validity: ${validity}`, 'color: red');
}

function getPreviousIndex(headings, level, index) {
  while (index >= 0) {
    if (parseInt(headings[index].tagName.charAt(1), 10) === level) {
      return index;
    }
    index--;
  }
  return -1;
}

function getIteration(headings, level, index) {
  let iteration = 1;
  for (let i = 0; i < index; i++) {
    const heading = headings[i];
    const headingLevel = parseInt(heading.tagName.charAt(1), 10);
    if (headingLevel === level) {
      iteration++;
    }
  }
  return iteration;
}
