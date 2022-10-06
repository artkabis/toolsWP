
/************************* FONCTION CATALOGUE >> Gestion du panier avec centralisation des produits dans le formulaire de commande (les datas sont sauvegardés dans le local storage **********************/

//Global function
var addToCart = new Function();
var addItem = new Function();
var updateAreaProduct = new Function();
//Si le type de Storage n'est pas undefined : alors Storage est supporté par le navigateur
if (typeof(Storage) !== "undefined") {
        console.log('Storage géré');
    //Création de la fonction addItem, elle prend 4 paramètres : le sku (unique), le nom du produit, la quantité et le prix
    function addItem ($sku, $name, $qty, $price) {
        var oldItems = JSON.parse(localStorage.getItem('productsToForm')) || [];//sauvegarde des produits déjà présent dans le localStorage "productsToForm"  
        //Sauvegarde des nouveaux paramètres du nouveau produit passés depuis la fonction addItem
        var newItem = {
            'sku': $sku,
            'produit': $name,
            'quantite': $qty,
            'prix' : $price
        };
        oldItems.push(newItem);//On incrémente les ancien produit avec le nouveau (si ancien il y a)
        localStorage.setItem('productsToForm', JSON.stringify(oldItems));
    }
    /*** Ajout des éléments intéractifs dans le DOM : Popup, boutons de validation, ajout et de suppression des produits ***/
    $('#Header #Top_bar .top_bar_left').append('<a id="cart" href="/commande/"><span>0</span><em></em></a>');//Ajout dans le DOM du panier comportant le nombre de produit
    
    //Si nous somme dans le shop et que nous avons un woocommerce-content présent dans le DOM
    if(window.location.pathname.indexOf("shop") > -1 && $('.woocommerce-content').length){
        
        console.log('woocommerce-content >> présent');
        var closePopup = function (){
            $('.btnClose').trigger('click');
        };
        $('#Wrapper').prepend(`
            <div class="popupShop">
                <div class="contentPopup">
                    <a href="#" class="btnClose">X</a>
                    <div class="textPopup">
                        Votre produit a bien été ajouté au panier. Si vous souhaitez valider votre commande : 
                        <a href="/commande/">Ma commande </a> ou <a class="closePopup"> continuer mes achats</a> 
                    </div>
                </div>
            </div>`);
        $('.btnClose, .closePopup').on('click',function(me){
            $('.popupShop').fadeOut(300);
        });
        $('.popupShop').fadeOut(0);
        $('.woocommerce-content .price').after(`
            <div class="conteneurItems">
                <button id="valProdutcs"> Valider les produits</div>
                <div id="valueQty">0</div>
                <input type="text" id="idProduct" min="0" max="1000" value="">
                <button id="btnLess" type="button" data-type="minus">-</button>
                <button id="btnMore" type="button" data-type="plus">+</button>
            </div>
        `);
        $('.woocommerce-content .product_meta').after(`
            <div class="conteneurRedirection">
                <a  id="redirection" href="/commande/"> Revenir à la boutique</a>
            </div>
        `);
        
        //Si la valeur et la quantité sont présentes dans le DOM
        if($('#valProdutcs').length && $('#valueQty').length){
            var oldItems,skuToUse,existingItem,newItem;
            $("#valProdutcs").on('click',function () {
                /*** Récupération des informations du produit ***/
                var idProduct = $(".woocommerce-content .sku_wrapper .sku").text();// Récupération du sku
                var nameProduct = $(".woocommerce-content .product_title").text();//Du nom
                var qtyProduct = $("#valueQty").text();//Et de la quantité
                var priceProduct = Number( Number(($(".price .amount").text()+'').split('€')[0]) *  Number(qtyProduct)).toFixed(2) +'€';//Calcule du prix (prix * quantité) et ajout du €

                oldItems = JSON.parse(localStorage.getItem('productsToForm')) || [];
                skuToUse = idProduct;
                existingItem = oldItems.find(({sku}) => sku === skuToUse);//On vérifie si un sku est déjà présent
                
                //Si un produit est déjà présent, alors il nous faut le mettre à jour et non le réinjecter et recalculer la quantité ainsi que le prix
                if (existingItem) {
                    console.log('le produit existe >> ',existingItem);
                    console.log('Ancien prix >> ',(Number(String(existingItem.prix).split('€')[0])));
                    console.log('Nouveau prix >> ',Number(priceProduct.split('€')[0]));
                    Object.assign(existingItem, {'quantite': qtyProduct,'prix': priceProduct});//Ecrasement des anciens paramètres du produit existant par les nouvelles valeurs
                    console.log('produit après modification >> ',existingItem);
                }else {
                  newItem = {
                    'sku' : skuToUse,
                    'produit': nameProduct,
                    'quantite': qtyProduct,
                    'prix': priceProduct,
                  };
                  oldItems.push(newItem);//S'il n'y a pas de nouveau produit on ajoute alors les valeur du nouveau produit
                }
                localStorage.setItem('productsToForm', JSON.stringify(oldItems));//On met à jour le localStorage, oldItems comportera : soit une fusion des items mis à jour, soit les produits ajoutés
                console.log('nouveau produit ajouté >> ',newItem);
                var something = JSON.parse(localStorage.productsToForm);//Formatage du JSON pour la préparation de l'affichage dans le textarea
                var length = something.length;//Nombre d'item (de ligne de produit)
                $('#cart span').text(length || 0);//On incrémente le nombre de produit dans le panier, si length ne retourn pas une valeur numéric, on y place 0
                localStorage.setItem('itemsToCart',  length || 0);//On fait de même cette fois-ci pour item "itemToCart" du localStorage
                console.log( 'nombre de produit >> ',length);
                $('.popupShop').fadeIn(300);//On affiche la popup permettant de valider la commande ou de continuer les achats
            });
            //Préparation des intéraction + ou moins sur la page d'un produit
            var cmp = 0;
            $('#btnMore').on('click',function(me){
                cmp ++;//On incrémente le compteur si btnMore est cliqué
                $('#valueQty').text(cmp);//On met à jour la quantité dans le DOM
            });
            $('#btnLess').on('click',function(me){
                if(cmp>0){cmp--;}else{cmp=0;}//On décrémente le compteur si btnLess est cliqué
                //cmp = (cmp>0) ? cmp-- : 0;
                $('#valueQty').text(cmp);//On met à jour la quantité dans le DOM
            });
        }
    }
    
    //Gestion du module sur la page commande
    if(localStorage.getItem('productsToForm') && window.location.pathname === "/commande/"){
        var items = [];//Tableau qui contiendra l'ensemble des items
        var item = (localStorage.getItem('productsToForm')+' ').toString();//Récupération des produit est conversion en chaîne de cractère (toString)
        console.log('page commande ouverte');
        items = item.split('},{');//Séparation de chaque produit via leur séparateur '},{
        
        //Formatage du produit afin de supprimer les éléments restant du json

        /*** Utilisation du regexerStorage - clean du retour pour l'affichage dans le form ***/
        function regexStorage(elem){
            if(elem && typeof elem === "string"){
                const cleanValue = elem.split('[').join('').split(']').join('').split('{').join('').split('}').join('').replace(/\{.*?\}/g,'').replace(/"/g,'');
                return cleanValue;
            }
        }



        //Si le tableau items n’est pas encore défini
        if(items === undefined){
            //var it = JSON.stringify(localStorage.getItem('productsToForm')).replace('/[\{\}]/g','');
            var it = regexStorage((localStorage.getItem('productsToForm')+' '));//On formate les produits pour l'affichage
            $('.productsSave #input_30_14').val(it);//On ajoute les produits formatés dans le textarea du formulaire (Gravityforms)
            console.log('item est undefined, ajout de ',it,' dans le textarea');
        }else{
            //Si items n'est pas undefined, alors on aura un update du contenu du textarea en fonction des nouveaux produits à ajouter.
            function updateAreaProduct(){
                var valAre=$('.productsSave textarea').attr('data-value').split('sku:').length;//Récupération du nombre d'élément déjà présent dans le textarea(car save dans un attribut)
                var valSessionString = String(localStorage.getItem('productsToForm')).split('sku:').length;//Récupération du nombre total d'items présent dans le localStorage
                console.log('valArea >> ',valAre,'   valSessionString > ',valSessionString);
                
                //Lors d'une intéraction avec le textarea
                $('.productsSave textarea').on('input', function(){
                    var value = this.value;//Récupération de son contenu
                    console.log('mavalue >>>>>>>>>>>> ',value, 'type value > ',typeof value);
                    var values = value.replace(/\n/g,' ').split('sku:');//Récupération de tous les items et remplacement des saut de ligne par un espace
                    console.log('val area >> ', value);
                    values = values.filter(entry => /\S/.test(entry));//Récupération des items
                    console.log('value >> ',values,'   nb value >> ',values.length);
                    $('#cart span').text(String(values.length));//On update le nombre de produit dans le panier
                    localStorage.setItem('itemsToCart', values.length);//Et celui du localStorage
                    console.log('nombre items apres modif >> ',localStorage.itemsToCart,'valeur récupérée >> ',values.length);
                    localStorage.removeItem('productsToForm');//On supprime l'ensemble des produits via le remove du conteneur
                    
                    
                    //Nous pouvons désormais recréer une liste des produits mis à jour, même si un produit a été supprimé dans le textarea, il sera sauvegardé dans le localStorage via addItem
                    var sku,produit,quantite,prix;
                    for(var i=0;i<values.length;i++){
                        console.log('values[i] >> ',values[i]);
                        values[i]='\nsku:'+values[i];
                        console.log('value après push');
                        sku = values[i].split('sku:')[1].split(',')[0];
                        produit = (values[i].split('produit:')[1]).split(',')[0];
                        quantite = (values[i].split('quantite:')[1]).split(',')[0];
                        prix = values[i].split('prix:')[1];
                        addItem(sku,produit,quantite,prix);
                        console.log('réinjection des éléments modifiés dans le localStore = sku > ',sku,'  produit > ',produit, '  quantite > ',quantite, '  prix > ',prix);
                    }
                    $('.productsSave textarea').val(values);//Mise à jour du textarea
                });
            }
            
            var value='';
            for(var i=0;i<items.length;i++){
                value+=items[i]+'\r\n';//Préparation des items en ajoutant un saut de ligne pour facilité la lecture dns le textarea
                console.log('item i >> ',items[i],'value >> ',value);
            }
            $('.productsSave #input_30_14').val(regexStorage(value));//On réimplémente les items formatés dans le textarea
            $('.productsSave #input_30_14').attr('data-value',regexStorage(value));//On ajoute par la même occasion ces donné dans l'attribut "data-value"
            updateAreaProduct();
        }
    }
    //Si nous avons des produits dans le localStorage ansi qu'un nombre de produits dans le panier.
    if (localStorage.getItem('productsToForm') && $('#cart').length) {
       var nb = JSON.parse( localStorage.productsToForm ).length;//On préférera récupérer le nombre d'item du localStorage pour mettre à jour le panier
        //var nb = ((localStorage.getItem('productsToForm')+' ').toString().split('}{').length === 0) ? 0 : (localStorage.getItem('productsToForm')+' ').toString().split('}{').length;
         //console.log('nb items >> ',nb);
        localStorage.setItem('itemsToCart', nb);//MAJ du itemsToCart lié au localStorage
        $('#cart span').text(nb);//Et du panier lié au DOM
    }
}else{
    console.log("Attention votre navigateur ne vous permet pas d'utiliser l'ajout au panier !!! ");
}

//Ajout d'un lien permettant de revenir à la boutique dans DOM
$('.woocommerce-content').after('    <div class="pageRedirection">        <a  id="redirection" href="/commande/"> Revenir à la boutique</a></div>');

/************************* FIN FONCTION CATALOGUE **********************/
