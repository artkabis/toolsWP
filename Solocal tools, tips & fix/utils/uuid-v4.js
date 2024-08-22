const Utils = {
 v4 : ()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){const b=16*Math.random()|0;return("x"===a?b:b&3|8).toString(16)}),
 log : (msg)=>console.log(msg),
}
Utils.v4();
Utils.log('test');
