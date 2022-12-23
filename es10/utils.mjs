"use strict";
export const toCamelCase = (str) => str.toLowerCase().replace(/^\w|\s\w/g, (letter, index) =>index === 0 ? letter.toLowerCase() : letter.toUpperCase()).replace(/\s+/g, '');
export const randomMM = (min,max)=> Math.floor(Math.random() * (max - min + 1)) + min;
export const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);
export const checkInvalid= value => value === null || value === undefined;
export const isNotUndefined = (n) => n === undefined ? false : true;
export const toNumber = (s) =>  (s) && +s;
export const isEven = (n) => n % 2 === 0;
export const isOdd = (n) => n % 2 === 1;
export const getPercentage = (total, value) => (total && value) ? Math.round((value / total) * 100) : 0;
export const convertDate2fr = (el) => el.split('-').reverse(el).join('/');
export const hex2rgb = (hex) => {let r,g,b,result;(hex.length === 4) ? (r = hex.slice(1,2),g = hex.slice(2,3),b = hex.slice(3,4),r = parseInt(r+r, 16),g = parseInt(g+g, 16),b = parseInt(b+b, 16),result={ r, g, b}): (r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16), result={ r, g, b });return result;}
export const noDuplcaArray = (a) =>  [...new Set(a)];
export const onlyValidValueArray = (a) =>a.filter(Boolean);
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
export const logger=(w)=>{w.cl = w.console.log}
export const isVisible=(elem) =>{if(!(elem instanceof Element))  throw Error('DomUtil: elem is not an element.');const style = window.getComputedStyle(elem);const rect = elem.getBoundingClientRect();return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth) && style.display === 'block' && style.visibility !== 'hidden'&& style.opacity > 0 && elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +elem.getBoundingClientRect().width === 0);}
export const hrefMatch=(page,func)=>( location.href.match(String(page)) ) && func();
export const navig = (url,target)=>window.open(url,target);
export const stringInArray =(str,arr) =>{ const validStr=(typeof str ==='string'),validArray =Array.isArray(arr);return (validArray && validStr ) ?  arr.includes(str) : ('Arguments not valid : ',(!validArray) ? arr+' not a Array' : str+' not a String')};
export const updateQueryStringParam =(key, value) =>{var baseUrl = [location.protocol, '//', location.host, location.pathname].join(''),urlQueryString = document.location.search,newParam = key + '=' + value,params = '?' + newParam;if (urlQueryString) {const keyRegex = new RegExp('([\?&])' + key + '[^&]*');if (urlQueryString.match(keyRegex) !== null) {params = urlQueryString.replace(keyRegex, "$1" + newParam);} else {params = urlQueryString + '&' + newParam;}}window.history.replaceState({}, "", baseUrl + params);}
export const getQueryString = (key, default_) =>{if(default_==null){ default_="";}key = key.replace(/[[]/,"\[").replace(/[]]/,"\]");let regex = new RegExp("[\?&]"+key+"=([^&#]*)"), qs = regex.exec(window.location.href);console.log('url : ',window.location.href,'qs',qs);qs = (qs == null) ? default_ : qs[1];return qs;}
export const onMutation = ({observerConfig = {childList: true,subtree: true,},element = document.body,callbackFunction}) =>{ const observer = new MutationObserver(callbackFunction);observer.observe(element, observerConfig);}
export const $$$=(selector, rootNode=document.body) => {const arr = [],traverser = node => {if(node.nodeType !== Node.ELEMENT_NODE) {return}if(node.matches(selector)) {arr.push(node)}const children = node.children;if (children.length) {for(const child of children) {traverser(child)}}const shadowRoot = node.shadowRoot;if (shadowRoot) {const shadowChildren = shadowRoot.children;for(const shadowChild of shadowChildren) {traverser(shadowChild)}}};traverser(rootNode);return arr}
export const detectQueryParams = ({url=window.location.href,search=''})=>{const validHref = (url.length===0) ? window.location.href : url;let _url = new URL(validHref);let params = new URLSearchParams(_url.search);const result = params.has(search);return (result && !_url.search.match('&'))?_url.search.split('=')[1] : _url.search.split('=')[1].split('&')[0]}
export const displayTime = (params) => {const $endTime = params.dateEnd, $startTime = params.dateStart, $target = document.querySelector(params.target), $isClose = params.closing, $targetClose = ($isClose && params.targetClose)?document.querySelector(params.targetClose) : undefined, $separator= ($endTime.includes('-') && $startTime.includes('-')) ? '-' : '/', start = new Date($startTime.split($separator).reverse().join($separator)).getTime(), end = new Date($endTime.split($separator).reverse().join($separator)).getTime(), today = new Date().getTime();(today >=end || today < start) && ( $target &&  $target.remove());($isClose && $targetClose) && $targetClose.addEventListener('click',()=>$target && $target.remove());}
export const deletePropObject = (obj, prop) => (delete obj[prop],obj);
export const createButton = (config)  => {const configs = {target: undefined, color: '#dcdcdc',backgroundColor:'#333',backgroundColorHover:'#222',textColorHover:'#fff',disabled: false,title: '',padding: '0',href: '#',linkDecoration:'none', ...config};const TARGET = (typeof configs.target === "string") ? document.querySelector(configs.target) : configs.target;if(configs.target){const STYLES = {padding: configs.padding,textDecoration: configs.linkDecoration,transition: 'all .5s',};TARGET.innerHTML = `<a href="${configs.href}">${configs.title}</a>`;const __out=()=>Object.assign(TARGET.children[0].style, {...STYLES,...{backgroundColor: configs.backgroundColor,color: configs.color}});const __over=()=>Object.assign(TARGET.children[0].style, {...STYLES,...{backgroundColor:configs.backgroundColorHover,color: configs.textColorHover}});__out();TARGET.children[0].addEventListener("mouseover", __over, false);TARGET.children[0].addEventListener("mouseout", __out, false);if(configs.disabled)document.querySelector(configs.target).style.pointerEvents = "none"}};
export const getLinkStyleSheet = (styleSheetId) =>{{let result={};for(let i = 0; i < document.styleSheets.length; i++) {var node = document.styleSheets[i].ownerNode;if(node != null && (node !== undefined)) {var parent = node.parentNode;if(parent != null && (parent !== undefined)) {var id = (parent.id === styleSheetId)?parent.id : node.id;if(id != null && (id !== undefined)) {if(id === styleSheetId) {result = document.styleSheets[i];}}}}}return result.ownerNode ? result : null;}}
