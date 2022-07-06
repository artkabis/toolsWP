
//Script permettant de charger jQuery est de l'utiliser ensuite dans votre projet.
const loadScript = async (url) => {
  const response = await fetch(url)
  const script = await response.text()
  eval(script)
}
const scriptUrl = "//cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
loadScript(scriptUrl);

//Une fois le script utilisé en console, vous pouvez désormais utiliser jQuery dans votre projet

//Essayez par exemple ceci
$('body').fadeOut(500).fadeIn(500).css({'transform':'rotate(360deg)', transition: "all 10s"});
