"use strict";

export function randomMM (min,max){return Math.floor(Math.random() * (max - min + 1)) + min}
export function isNumber(n){ return !isNaN(parseFloat(n)) && isFinite(n)}
export function toNumber(s){ return (s) && +s}
export function noDuplcaArray(a){ return [...new Set(a)]}
export function onlyValidValueArray(a){a.filter(Boolean)}
export function generateToken(){const shuffle = ()=>Math.random().toString(36).substr(2);let tokenA = [];[0,0,0].forEach((t)=>tokenA.push(shuffle()+shuffle()));return String(tokenA.join(''));}
export function shuffleArray(arr){let tabRange, randomiz;(arr && Array.isArray(arr)) && (tabRange = [...new Set(arr)].sort(),randomiz =  tabRange.sort(()=> Math.random()-0.5));return randomiz}
export function maxValueArray(arr){return arr.reduce((a,b) => a>b?a:b)}
