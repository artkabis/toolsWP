"use strict";
export const cl = () => console.log.bind(window.console,'LOG: ');
export const ce = () => console.error.bind(window.console,'ERROR: ');
export const toCamelCase = (str) => str.toLowerCase().replace(/^\w|\s\w/g, (letter, index) =>index === 0 ? letter.toLowerCase() : letter.toUpperCase()).replace(/\s+/g, '');
export const randomMM = (min,max)=> Math.floor(Math.random() * (max - min + 1)) + min;
export const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);
export const toNumber = (s) =>  (s) && +s;
export const isEven = (n) => n % 2 === 0;
export const isOdd = (n) => n % 2 === 1;
export const noDuplcaArray = (a) =>  [...new Set(a)];
export const  onlyValidValueArray = (a) =>a.filter(Boolean);
export const generateToken = () =>{const shuffle = ()=>Math.random().toString(36).substr(2);let tokenA = [];[0,0,0].forEach((t)=>tokenA.push(shuffle()+shuffle()));return String(tokenA.join(''));}
export const shuffleArray = (arr) => {let tabRange, randomiz;(arr && Array.isArray(arr)) && (tabRange = [...new Set(arr)].sort(),randomiz =  tabRange.sort(()=> Math.random()-0.5));return randomiz}
export const maxValueArray = (arr) => arr.reduce((a,b) => a>b?a:b);
export const ascii2hex = (str) =>{var arr1 = [];for (var n = 0, l = str.length; n < l; n ++){var hex = Number(str.charCodeAt(n)).toString(16);arr1.push(hex);}return arr1.join('');}
export const hex2ascii = (str1) =>{var hex  = str1.toString();var str = '';for (var n = 0; n < hex.length; n += 2) {str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));}return str;}
export const shortenText = (text, length = 10, ellipsisCount = 3) =>{(!(typeof text === "string" || text instanceof String)) && (()=>{console.error(`expecting a string, ${typeof text} provided`);return ""})();(isNaN(length) || isNaN(ellipsisCount)) && (()=>{console.error("length and ellipsisCount must be valid numbers");return})();(text.length <= length) && (()=>{return text})();const ellipsis = Array.from(Array(ellipsisCount)).map(() => ".").join("");return `${text.substr(0, length)}${ellipsis}`}
export const sortJsonKey = (o,v) => o.sort((a, b) => a[v].localeCompare(b[v]));
export const clamp = (value, range) => Math.min(Math.max(value, range[0]), range[1]);//return the closest value with [min,max], ex : (5,[10,20]) => 10, (22,[10,20]) => 22
export const getNavigator=()=>{const userAgent = navigator.userAgent;const isGoogle = navigator.vendor==="Google Inc.";const chrome = (userAgent.match(/Chrome/i) && isGoogle) && "Chrome";const firefox = (userAgent.match(/firefox|fxios/i) && !isGoogle) && "Firefox"; const safari = (userAgent.match(/safari/i) && !isGoogle) && "Safari";const opera = (userAgent.match(/opr\//i) && !isGoogle) && "Opera";const edge = (userAgent.match(/edg/i) && !isGoogle) && "Edge";const android = (userAgent.match(/android/i) && !isGoogle) && "Android";const iphone = (userAgent.match(/iphone/i) && !isGoogle) && "Iphone";const browser = chrome || firefox || safari || opera  || edge || android || iphone || "Inconnu";return browser;}
export const reject = (predicate, array) =>array.reduce((newArray, item) => {(predicate(item) === false) && newArray.push(item);return newArray; }, []);
export const findKeyArray = (key, array) =>array.reduce((values, current) => {values.push(current[key]);return values;}, []);
