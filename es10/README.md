# Utils modern Javascript methodes

## Methodes presentation : 
[Codepen full preview exemples](https://codepen.io/artkabis/pen/PoaQaQy)

1. toCamelCase ->
2. randomMM -> (min:Number,max:Number) :: Number
3. isNumber -> (el:void) :: Boolean
4. isEven -> (el:Number) :: Boolean
5. isOdd -> (el:Number) :: Boolean****
6. generateToken -> () :: String //return random token, 64 alphanumercic values :: mrdy8auiju9bhyr89g22c44s8vqz657bwc8wrcgzly8s3d5la0lc2cwnttasadlq
7. shuffleArray -> (el:Array) :: Array // return array with random value (in older array) 
8. maxValueArray -> (el:Array) :: Array // return max value in Array (ex: [1,5,3,2] >>> 5)
9. ascii2hex -> (el:String) :: String // return hexadecimal value (ex : ('Artkabis') >>> 4172746B61626973)
10. hex2ascii -> (el:String) :: String // return ascii value (ex : ('4172746B61626973') >>> 'Artkabis')
11. shortenText -> (msg:String, cutLength:Number, nbDots:Number) :: String // resume string message and add dot
12. sortJsonKey -> (json:Object, KeyNamFilter:String) :: Object // return sort json with key value
13. clamp -> (n:Number,clamp:Array) :: Number // delimit value (ex : clamp(9,[10,30]) 9)
14. getNavigator -> () ::String //return navigator name
15. reject -> (filterMethode, valArr:Array) :: Array // rejection method from an array (ex : reject(isOdd, [1, 2, 3]) >>> [2])
16. findKeyArray -> (keyName:String, json:Object) :: Array
17. logger -> (window) :: add cl methode for replace console.log
18. isVisible -> (el:Node) :: Boolean // return if an element is visible in the DOM
19. hrefMatch -> (el:String) :: Boolean // detect if element string match in window.location.href
20. navig -> (link:String, target:String) :: Function //Navigate to url (_target, _blank, ...)
21. stringInArray -> (test:String, StrArr:Array) :: Boolean // detect if param one is detected in array (par two)
22. updateQueryStringParam (key:String, value:String) :: Function //add query params to url (ex ...gle.fr?test=true)
25. detectQueryParams -> (key:String) :: String // return value of key in query
26. getPercentage -> (bigValue:Number, partValue:Number) :: Number // return percentage (ex : getPercentage(200,10) >>> 5)
27. deletePropObject -> (obj:Object,key:String) :: Object return object any key & value with par two
28. onMutation -> (callback:Function) // start mutation observer callBack
24. $$$ -> (querSelector:String) :: Node // loop inner dom and shadow dom et return node element
29. hex2rgb -> 
30. createButton
31. getLinkStyleSheet
32. validateEmailFormat
33. lazyLoadImg
