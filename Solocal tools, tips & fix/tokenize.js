


//Version sans Crypto
"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
                const t = 16 * Math.random() | 0;
                return ("x" === e ? t : 3 & t | 8).toString(16)
            });



//Version avec Crypto
const C = window.crypto || window.msCrypto
([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function(e) {
                        return (e ^ C.getRandomValues(new Uint32Array(1))[0] & 15 >> e / 4).toString(16)
                    })
