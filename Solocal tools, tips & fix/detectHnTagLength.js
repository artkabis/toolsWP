javascript:(()=>{
  var hn = document.getElementsByTagName('h1');
  for (var i = 0; i < hn.length; i++) {
    var hnLength = document.createElement('div');
    hnLength.innerHTML = `<span style="color:red;background:black;padding:15ps">${hn[i].tagName} : ${hn[i].innerText.length} caractères</span>`;
    hn[i].appendChild(hnLength);
  }
  var hn = document.getElementsByTagName('h2');
  for (var i = 0; i < hn.length; i++) {
    var hnLength = document.createElement('div');
    hnLength.innerHTML = `<span style="color:red;background:black;padding:15ps">${hn[i].tagName} : ${hn[i].innerText.length} caractères</span>`;
   hn[i].appendChild(hnLength);
  }
  var hn = document.getElementsByTagName('h3');
  for (var i = 0; i < hn.length; i++) {
    var hnLength = document.createElement('div');
    hnLength.innerHTML = `<span style="color:red;background:black;padding:15ps">${hn[i].tagName} : ${hn[i].innerText.length} caractères</span>`;
    hn[i].appendChild(hnLength);
  }
  var hn = document.getElementsByTagName('h4');
  for (var i = 0; i < hn.length; i++) {
    var hnLength = document.createElement('div');
    hnLength.innerHTML = `<span style="color:red;background:black;padding:15ps">${hn[i].tagName} : ${hn[i].innerText.length} caractères</span>`;
    hn[i].appendChild(hnLength);
  }
  var hn = document.getElementsByTagName('h5');
  for (var i = 0; i < hn.length; i++) {
    var hnLength = document.createElement('div');
    hnLength.innerHTML = `<span style="color:red;background:black;padding:15ps">${hn[i].tagName} : ${hn[i].innerText.length} caractères</span>`;
    hn[i].appendChild(hnLength);
  }
  var hn = document.getElementsByTagName('h6');
  for (var i = 0; i < hn.length; i++) {
    var hnLength = document.createElement('div');
    hnLength.innerHTML = `<span style="color:red;background:black;padding:15ps">${hn[i].tagName} : ${hn[i].innerText.length} caractères</span>`;
    hn[i].appendChild(hnLength);
  }
})()
