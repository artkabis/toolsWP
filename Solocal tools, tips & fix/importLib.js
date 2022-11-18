const T = function() {
    const t = document.createElement("link").relList;
    return t && t.supports && t.supports("modulepreload") ? "modulepreload" : "preload"
}()
  , b = {}
  , C = "/"
  , L = function(t, s) {
    return !s || s.length === 0 ? t() : Promise.all(s.map(r=>{
        if (r = `${C}${r}`,
        r in b)
            return;
        b[r] = !0;
        const n = r.endsWith(".css")
          , o = n ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${r}"]${o}`))
            return;
        const i = document.createElement("link");
        if (i.rel = n ? "stylesheet" : T,
        n || (i.as = "script",
        i.crossOrigin = ""),
        i.href = r,
        document.head.appendChild(i),
        n)
            return new Promise((c,u)=>{
                i.addEventListener("load", c),
                i.addEventListener("error", ()=>u(new Error(`Unable to preload CSS for ${r}`)))
            }
            )
    }
    )).then(()=>t())
};
function v(e, t) {
    return Array(t + 1).join(e)
}
var O = function() {
    function e(t, s, r) {
        t === void 0 && (t = []),
        s === void 0 && (s = []),
        r === void 0 && (r = []);
        var n = this;
        this.getCurrentStyles = function() {
            return n._currentStyles
        }
        ,
        this.getTexts = function() {
            return n._texts
        }
        ,
        this.getStyles = function() {
            return n._styles
        }
        ,
        this.style = function(o) {
            return new e(n._currentStyles.concat([o]),n._texts,n._styles)
        }
        ,
        this.color = function(o) {
            return n.style("color:" + o)
        }
        ,
        this.bgColor = function(o) {
            return n.style("background-color:" + o)
        }
        ,
        this.bold = function() {
            return n.style("font-weight:bold")
        }
        ,
        this.italic = function() {
            return n.style("font-style:italic")
        }
        ,
        this.size = function(o) {
            var i = typeof o == "number" ? o + "px" : o;
            return n.style("font-size:" + i)
        }
        ,
        this.reset = function() {
            return new e([],n._texts,n._styles)
        }
        ,
        this.text = function() {
            for (var o = [], i = 0; i < arguments.length; i++)
                o[i] = arguments[i];
            var c = n._texts.slice()
              , u = n._styles.slice();
            return o.forEach(function(f) {
                f instanceof e ? (c.push.apply(c, f.getTexts()),
                u.push.apply(u, f.getStyles())) : (c.push(f),
                u.push(n._currentStyles.join(";")))
            }),
            new e(n._currentStyles,c,u)
        }
        ,
        this.space = function(o) {
            return o === void 0 && (o = 1),
            n.text(v(" ", o))
        }
        ,
        this.newline = function(o) {
            return o === void 0 && (o = 1),
            n.text(v(`
`, o))
        }
        ,
        this._output = function(o) {
            return function() {
                for (var i = [], c = 0; c < arguments.length; c++)
                    i[c] = arguments[c];
                var u = n.text.apply(n, i);
                return console[o].apply(console, [u.getTexts().map(function(f) {
                    return "%c" + f
                }).join("")].concat(u._styles)),
                new e(u.getCurrentStyles())
            }
        }
        ,
        this.log = this._output("log"),
        this.info = this._output("info"),
        this.warn = this._output("warn"),
        this.error = this._output("error"),
        this._currentStyles = t,
        this._texts = s,
        this._styles = r
    }
    return e
}()
  , p = new O;
const x = "[$i]: "
  , R = p.color("blue").text
  , l = p.color("blue").bold().text
  , P = p.color("red").text
  , a = (...e)=>p.log(R(x), ...e)
  , m = (...e)=>p.log(P(x), ...e);
let d = null;
function y(e) {
    return ()=>{
        d = new Set(Object.keys(window)),
        a(l(e), " is loading, please be patient...")
    }
}
function g(e, t) {
    return ()=>{
        const s = t ? `(${t})` : "";
        a(l(e), `${s} is loaded.`);
        const r = Object.keys(window)
          , n = r.filter(o=>!(d != null && d.has(o)));
        n.length > 0 && a("The new global variables are as follows: ", l(n.join(",")), " . Maybe you can use them."),
        d = new Set(r)
    }
}
function w(e, t) {
    return ()=>{
        const s = t ? `(${l(t)})` : "";
        m("Fail to load ", l(e), ", is this URL", s, " correct?")
    }
}
function S() {
    const e = document.querySelector("meta[name=referrer]");
    if (e) {
        const t = e.content;
        return e.content = "no-referrer",
        function() {
            e.content = t
        }
    } else {
        const t = document.createElement("meta");
        return t.name = "referrer",
        t.content = "no-referrer",
        document.head.appendChild(t),
        function() {
            t.content = "no-referrer-when-downgrade",
            document.head.removeChild(t)
        }
    }
}
function $(e, t, s) {
    const r = S()
      , n = document.createElement("script");
    n.src = e,
    n.onload = t,
    n.onerror = s,
    document.body.appendChild(n),
    r(),
    document.body.removeChild(n)
}
function z(e, t, s) {
    const r = S()
      , n = document.createElement("link");
    n.href = e,
    n.rel = "stylesheet",
    n.onload = t,
    n.onerror = s,
    document.head.appendChild(n),
    r()
}
function k(e, t=y(e), s=g(e), r=w(e)) {
    return t(),
    /\.css$/.test(e) ? z(e, s, r) : $(e, s, r)
}
function E(e) {
    a("Searching for ", l(e), ", please be patient..."),
    fetch(`https://api.cdnjs.com/libraries?search=${e}`, {
        referrerPolicy: "no-referrer"
    }).then(t=>t.json()).then(({results: t})=>{
        if (t.length === 0) {
            m("Sorry, ", l(e), " not found, please try another keyword.");
            return
        }
        const s = t.filter(o=>o.name === e)
          , {name: r, latest: n} = s[0] || t[0];
        e !== r && a(l(e), " not found, import ", l(r), " instead."),
        k(n, y(r), g(r, n), w(r, n))
    }
    ).catch(()=>{
        m("There appears to be some trouble with your network. If you think this is a bug, please report an issue:"),
        m("https://github.com/pd4d10/console-importer/issues")
    }
    )
}
function j(e) {
    y(e)();
    const t = `https://unpkg.com/${e}`;
    $(t, g(e, t), w(e, t))
}
async function A(e) {
    return a(l(e), "(esm) is loading, please be patient..."),
    await L(()=>import(`https://esm.run/${e}`), [])
}
function h(e) {
    if (typeof e != "string")
        throw new Error("Argument should be a string, please check it.");
    const t = e.trim();
    return /^https?:\/\//.test(t) ? k(t) : t.indexOf("@") !== -1 ? j(t) : E(t)
}
h.cdnjs = E;
h.unpkg = j;
h.esm = A;
h.toString = ()=>"$i";
console.$i = h;
const _ = window;
typeof _.$i == "undefined" ? _.$i = h : a("$i is already in use, please use `console.$i` instead");
