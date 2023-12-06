
// Élément à intégrer en html, vous pouvez utiliser la fonction reverseEmail ci-dessous avec le each afin de récupérer vos e-mails en reverse
//<span class="encodemail">moc.eniamod@tcatnoc</span>
(function($){
    function reverseEmail($mail){
        return ($mail) && $mail.split("").reverse().join("")
    }
    //Ceci permet de récupérer les adresses mails inversé (avant intégration)
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
