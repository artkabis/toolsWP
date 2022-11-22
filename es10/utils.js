"use strict";

export function getMessage() {
  return "Hello world";
}
export function funcMod1 (...args) {
 return String('funcMod1 -> arg : '+ args+ ' --- arg length : '+ args.length); 
}
export function funcMod2 (...args) {
  return String('funcMod2 -> arg : '+ args+ ' --- arg length : '+ args.length); 
}
