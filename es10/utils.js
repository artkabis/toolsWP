"use strict";

export function randomMM (min,max){return Math.floor(Math.random() * (max - min + 1)) + min}
export function isNumber(n){ return !isNaN(parseFloat(n)) && isFinite(n)}
export function toNumber(s){ return (s) && +s}
export function noDuplcaArray(a){ return [...new Set(a)]}
