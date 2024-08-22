
// Cet élément doit être intégré en html, vous pouvez utiliser la fonction reverseEmail ci-dessous avec le each afin de récupérer vos e-mails en reverse

//Ici l'élément <a> avec la classe permettant d'afficher correctement l'adresse mail qui a été précédemment inversée >>.
//<a class="encodemail">moc.eniamod@tcatnoc</a>


(function($){
    const reverseEmail = ($mail) => ($mail) && $mail.split("").reverse().join("");

    //Ceci permet de récupérer les adresses mails inversé (avant intégration). 
    //Il faudra supprimer cette méthode qui ne sert qu'à convertir vos/votre adresse mail.
    $.each(["monadress1@gmail.com","monadress2@gmail.com","monadress3@gmail.com"],function(i,t){
        console.log(reverseEmail(t));//retourne : moc.liamg@1sserdano,moc.liamg@2sserdanom,moc.liamg@3sserdano

    });
    //Les e-mails seront désormais visibles dans leur format initial, sans que ce soit le cas dans le DOM
    $('.encodemail').each(function(i,t){
        $(this).css({unicodeBidi:"bidi-override",direction:"rtl",cursor:"pointer"});
    });
    //Reconstruction de l'e-mail uniquement après click, puis ouverture du mailto
    $('.encodemail').on('click',function(){
        const mailReverse = reverseEmail($(this).text());
        location.href = "mailto:"+mailReverse+"?cc=lemailencopie@gmail.com&subject=Prise de contact depuis votre site monsite.com&body=Ce mail concerne votre site internet";
    });
})(jQuery)


/************** Si vous avait aussi une adresse mail en lien avec le menu donc vous ne pourrez ajouter la classe encodeMail uniquement sur le <li> et non le <a> 

Voici un script qui permet d'identifier les deux et de les gérer séparément ->
***/

/**** DOM html qui sera traité par le script >>
LE A : <a class="encodemail">rf.oodanaw@2leinad.tohcorb</a>
LE LI : <li class="encodemail"><a href="mailto:rf.oodanaw@2leinad.tohcorb">Email</a></li>
**/
const reverseEmail = ($mail) => $mail && $mail.split("").reverse().join("");
 
//Les e-mails seront désormais visibles dans leur format initial, sans que ce soit le cas dans le DOM
$('.encodemail').each(function(i,t){
    const isA = $(this)[0].nodeName == 'A'  ? true : false;
    (isA) && $(this).css({unicodeBidi:"bidi-override",direction:"rtl",cursor:"pointer"});
});

//Reconstruction de l'e-mail uniquement après click, puis ouverture du mailto
$('.encodemail').on('click',function(){
    const isA = $(this)[0].nodeName == 'A'  ? true : false;
    const mailReverse = isA ? reverseEmail($(this).text()) : reverseEmail($(this).find('a').attr('href').split('mailto:')[1]);
    window.location.href = "mailto:"+mailReverse+"?&subject=Prise de contact depuis votre site sarlbrochot.fr";
});
 

