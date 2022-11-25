export function randomMM (min,max){return Math.floor(Math.random() * (max - min + 1)) + min}
export function isNumber(n){ return !isNaN(parseFloat(n)) && isFinite(n)}
export function toNumber(s){ return (s) && +s}
export function noDuplcaArray(a){ return [...new Set(a)]}
export function onlyValidValueArray(a){a.filter(Boolean)}
export function generateToken(){const shuffle = ()=>Math.random().toString(36).substr(2);let tokenA = [];[0,0,0].forEach((t)=>tokenA.push(shuffle()+shuffle()));return String(tokenA.join(''));}
export function shuffleArray(arr){let tabRange, randomiz;(arr && Array.isArray(arr)) && (tabRange = [...new Set(arr)].sort(),randomiz =  tabRange.sort(()=> Math.random()-0.5));return randomiz}
export function maxValueArray(arr){return arr.reduce((a,b) => a>b?a:b)}
export function ascii2hex(str){var arr1 = [];for (var n = 0, l = str.length; n < l; n ++){var hex = Number(str.charCodeAt(n)).toString(16);arr1.push(hex);}return arr1.join('');}
export function hex2ascii(str1){var hex  = str1.toString();var str = '';for (var n = 0; n < hex.length; n += 2) {str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));}return str;}
export function shortenText (text, length = 10, ellipsisCount = 3){(!(typeof text === "string" || text instanceof String)) && (()=>{console.error(`expecting a string, ${typeof text} provided`);return ""})();(isNaN(length) || isNaN(ellipsisCount)) && (()=>{console.error("length and ellipsisCount must be valid numbers");return})();(text.length <= length) && (()=>{return text})();const ellipsis = Array.from(Array(ellipsisCount)).map(() => ".").join("");return `${text.substr(0, length)}${ellipsis}`}
export const sortKeyObject = (v) => objectArr.sort((a, b) => a[v].localeCompare(b[v]));