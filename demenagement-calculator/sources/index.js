jQuery(document).ready(function($) {

  var calcul = undefined;
  var categories_name=[];

  /**** Start calculator ***/
  // Calcul volume definitions
var defaults={reNumbers:/(-?\$?)(\d+(,\d{3})*(\.\d{1,})?|\.\d{1,})/g,cleanseNumber:function(v){return v.replace(/[^0-9.\-]/g,"")},useFieldPlugin:(!!$.fn.getValue),onParseError:null,onParseClear:null};$.Calculation={version:"0.4.09",setDefaults:function(options){$.extend(defaults,options)}};$.fn.parseNumber=function(options){var aValues=[];options=$.extend(options,defaults);this.each(function(){var $el=$(this),sMethod=($el.is(":input")?(defaults.useFieldPlugin?"getValue":"val"):"text"),v=$.trim($el[sMethod]()).match(defaults.reNumbers,"");if(v==null){v=0;if(jQuery.isFunction(options.onParseError))options.onParseError.apply($el,[sMethod]);$.data($el[0],"calcParseError",true)}else{v=options.cleanseNumber.apply(this,[v[0]]);if($.data($el[0],"calcParseError")&&jQuery.isFunction(options.onParseClear)){options.onParseClear.apply($el,[sMethod]);$.data($el[0],"calcParseError",false)}}aValues.push(parseFloat(v,10))});return aValues};$.fn.calc=function(expr,vars,cbFormat,cbDone){var $this=this,exprValue="",precision=0,$el,parsedVars={},tmp,sMethod,_,bIsError=false;for(var k in vars){expr=expr.replace((new RegExp("("+k+")","g")),"_.$1");if(!!vars[k]&&!!vars[k].jquery){parsedVars[k]=vars[k].parseNumber()}else{parsedVars[k]=vars[k]}}this.each(function(i,el){var p,len;$el=$(this);sMethod=($el.is(":input")?(defaults.useFieldPlugin?"setValue":"val"):"text");_={};for(var k in parsedVars){if(typeof parsedVars[k]=="number"){_[k]=parsedVars[k]}else if(typeof parsedVars[k]=="string"){_[k]=parseFloat(parsedVars[k],10)}else if(!!parsedVars[k]&&(parsedVars[k]instanceof Array)){tmp=(parsedVars[k].length==$this.length)?i:0;_[k]=parsedVars[k][tmp]}if(isNaN(_[k]))_[k]=0;p=_[k].toString().match(/\.\d+$/gi);len=(p)?p[0].length-1:0;if(len>precision)precision=len}try{exprValue=eval(expr);if(precision)exprValue=Number(exprValue.toFixed(Math.max(precision,4)));if(jQuery.isFunction(cbFormat)){var tmp=cbFormat.apply(this,[exprValue]);if(!!tmp)exprValue=tmp}}catch(e){exprValue=e;bIsError=true}$el[sMethod](exprValue.toString())});if(jQuery.isFunction(cbDone))cbDone.apply(this,[this]);return this};$.each(["sum","avg","min","max"],function(i,method){$.fn[method]=function(bind,selector){if(arguments.length==0)return math[method](this.parseNumber());var bSelOpt=selector&&(selector.constructor==Object)&&!(selector instanceof jQuery);var opt=bind&&bind.constructor==Object?bind:{bind:bind||"keyup",selector:(!bSelOpt)?selector:null,oncalc:null};if(bSelOpt)opt=jQuery.extend(opt,selector);if(!!opt.selector)opt.selector=$(opt.selector);var self=this,sMethod,doCalc=function(){var value=math[method](self.parseNumber(opt));if(!!opt.selector){sMethod=(opt.selector.is(":input")?(defaults.useFieldPlugin?"setValue":"val"):"text");opt.selector[sMethod](value.toString())}if(jQuery.isFunction(opt.oncalc))opt.oncalc.apply(self,[value,opt])};doCalc();return self.bind(opt.bind,doCalc)}});var math={sum:function(a){var total=0,precision=0;$.each(a,function(i,v){var p=v.toString().match(/\.\d+$/gi),len=(p)?p[0].length-1:0;if(len>precision)precision=len;total+=v});if(precision)total=Number(total.toFixed(precision));return total},avg:function(a){return math.sum(a)/a.length},min:function(a){return Math.min.apply(Math,a)},max:function(a){return Math.max.apply(Math,a)}}

var tabCuisine,tabChambre,tabSalon,tabAutres;
  var nameImgCuisine,titleCuisine,nameCuisine,valueCuisine;
  var nameImgChambre,titleChambre,nameChambre,valueChambre;
  var nameImgSalon,titleSalon,nameSalon,valueSalon;
  var nameImgAutres,titleAutres,nameAutres,valueAutres;
  var infos_catg_1,infos_catg_2,infos_catg_3,infos_catg_4=[];
  var url=base_url;//"https://centre-dimagerie.site-privilege.pagesjaunes.fr/wp-content/uploads/sites/1674/2019/06/";

  
  var urlXlsx = xlsx_url;
  var tab1,titleCatg=[],catg=[];
  var oReq = new XMLHttpRequest();
  oReq.open("GET", urlXlsx, true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function(e) {
    var arraybuffer = oReq.response;

    // convert data to binary string 
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");

    // Call XLSX 
    var workbook = XLSX.read(bstr, {type: "binary"});
    // DO SOMETHING WITH workbook HERE 
    var first_sheet_name = workbook.SheetNames[0];
    // Get worksheet 
    var worksheet = workbook.Sheets[first_sheet_name];
    tab1=XLSX.utils.sheet_to_json(worksheet, {raw: true});
  }
  oReq.send();
  
  var tab;
  var digitNb = $n=> {
    var v;
    (typeof $n === 'number') ? v=$n+'' : v=$n;
    if(v.length===3){v=''+v;}else if(v.length===2){v='0'+v;}else if(v.length===1){v='00'+v};
    return  v;
  };

  function cleanArray(array) {
    var i, j, len = array.length, out = [], obj = {};
    for (i = 0; i < len; i++) {obj[array[i]] = 0;}
    for (j in obj) {out.push(j);}
    return out;
  }
  function cleanArea($str,dataType){
    return (dataType)?$.trim($str.replace(/\s\s+/g, '')).replace(/,/g, '\n') : $.trim($str.replace(/\s\s+/g, '')).replace(/,/g, '\n');
  }
  setTimeout(()=>{
    tab = tab1;
    for( var i =0; i<tab.length;i++ ){ 
        var names  = tab[i].name;//["name"];//.name;
        catg.push(tab[i].categorie);
        titleCatg = cleanArray(catg);
    }
  },600);
  function constructTab($titleCatg){
       if(typeof  $titleCatg!== undefined){
         for(var i=0;i<$titleCatg.length;i++){ 
            var num=1+i;
            console .log('contruction de ',$titleCatg[i]);
            $('.resp-tabs-list').append('<li><a href="#tab-'+num+'">'+$titleCatg[i]+'</a></li>');
            $('.resp-tabs-container').append(`<div id="tab-${num}" class="tab"></div>`);
            if(i ===$titleCatg.length-1){
              $("#Tabs").tabs();
              return;
            }
          }
       }else{
            console.error("Les catégories du fichier xlsx n'ont pu être récupérées");
       }
    }

  function constructItem(){
    var tNames=[];
    //categories_name = titleCatg;
    $.grep( tab, function( n, i ) {
      //console.log('all grep tab1 i >> ',i,n);
      for(var j=0;j<titleCatg.length;j++){
          if( n.categorie == titleCatg[j]){
             var name = n.name;
             var img = n["content/img"];
             var title = n["content/title"];
             var value = n["content/val"];
             $('#tab-'+(j+1)).append(`<div id="item-${digitNb(i)}" class="item ${name}"><span class="item-text">${title}</span><span id="price_item_${digitNb(i)}">${value}</span><span class="img_item"></span><input type="button" value="-" class="qtyminus" /><input type="text" class="qtyvalue" value="0" size="2"><input type="button" value="+" class="qtyplus"/><input class="totalitem" id="total_item" type="hidden" value="0"></div>`);   
             var lastUrl = url+img;
             $("."+name).find(".img_item").css('background-image',"url("+lastUrl+")");
        }
      }
    });
  }
  /***** Récupération des informations liées aux différentes catégories et création du DOM ****/
  var volumeItem = 0;
  $("input[name^=qty_item_]").bind("keyup", recalc);
  function recalc() {
    if (typeof calcul !== 'undefined') {
      $("[id^=total_item]").calc(calcul.calcStr, {qty: calcul.qty,price: calcul.price
                                                 }, function(s) {
        return s.toFixed(2);
      }, function($this) {
        var sum = $this.sum();
        $("#grandTotal").text(sum.toFixed(2));
        $("#input_25_335").val(sum.toFixed(2));
      });
    }else if (typeof calcul === 'undefined' || typeof calcul === 'null') {
      //console.log('si undefined >> calcul = '+calcul);
      console.log('calcul de base mis en place');
      $("[id^=total_item]").calc("qty * price", {qty: $("input[name^=qty_item_]"),price: $("[id^=price_item_]")}, function(s) {
        return s.toFixed(2);
      }, function($this) {
        var sum = $this.sum();
        $("#grandTotal").text(sum.toFixed(2));
        $("#input_25_335").val(sum.toFixed(2));
      });
    }
  }
  function construcBtn(){
    $(".qtyminus").each(function() {
        var nb1 = $(this).closest('.item').attr('id');
        $(this).attr("field", "qty_item_" + nb1);
    });
    $(".qtyplus").each(function() {
        var nb2 = $(this).closest('.item').attr('id');
        $(this).attr("field", "qty_item_" + nb2);
    });
    $(".qtyvalue").each(function() {
        var nb3 = $(this).closest('.item').attr('id');
        $(this).attr("name", "qty_item_" + nb3);
    });
    $(".qtyvalue").each(function() {
        var nb4 = $(this).closest('.item').attr('id');
        $(this).attr("name", "qty_item_" + nb4);
    });
    $(".totalitem").each(function() {
        var nb5 = $(this).closest('.item').attr('id');
        $(this).attr("id", "total_item_" + nb5);
    });
    
    $('.qtyplus').on('click',function(e) {
       var temp = '';
        e.preventDefault();
        fieldName = $(this).attr('field');
      console.log('filed name : ',fieldName);
        var currentVal = parseInt($('input[name=' + fieldName + ']').val(),10);
        if (!isNaN(currentVal)) {
            $('input[name=' + fieldName + ']').val(currentVal + 1);
            var actVal = $(this).siblings('.qtyvalue').val();
            var itemName = $(this).siblings('.item-text').text();
            var itemId = $(this).parent().attr('id');
            recalc();
            var volumeItem = $(this).siblings('.totalitem').val();
            console.log('fieldName : ',fieldName, 'actVal >>' + actVal + 'itemName>> ' + itemName + 'itemId >>' + itemId);
            if (actVal > 0) {
                $(this).parents('.item').addClass("selected");
                $(".volume-a-calculer div[class$='" + itemId + "']").remove();
                $('.volume-a-calculer').append(`<div class="new-item-${fieldName}"> <span class="item-name">${itemName}</span>  : <span class="item-qty">${actVal}</span><span class="item-volume"> :  Volume  : ${volumeItem} m³ ,</span> </div>`);
            }
            if (actVal === 0) {
                $(".volume-a-calculer div[class$='" + itemId + "']").remove();
            }
        } else {
            $(".volume-a-calculer div[class$='" + itemId + "']").remove();
            $('input[name=' + fieldName + ']').val(0);
        }
        // reset du textearea
        $('.result-volume-a-calculer textarea').val('');
        //Ajout du contenu de volume-a-calculer avec saut de ligne
        $('.volume-a-calculer div').each(function(index) {
            $('.liste-fourniture-send textarea').val(cleanArea(temp + $(this).text(),true).replaceAll('m³','m³\n'));
            $('.result-volume-a-calculer textarea').val( cleanArea(temp +$(this).text()).replaceAll('m³','m³\n'));
            temp = $('.result-volume-a-calculer textarea').val();
        });
        recalc();
    });


    $(".qtyminus").click(function(e) {
        e.preventDefault();
        fieldName = $(this).attr('field');
        var currentVal = parseInt($('input[name=' + fieldName + ']').val(), 10);
        if (!isNaN(currentVal) && (currentVal >= 1)) {
            $('input[name=' + fieldName + ']').val(currentVal - 1);
            var actVal = $(this).siblings('.qtyvalue').val();
            var itemName = $(this).siblings('.item-text').text();
            var itemId = $(this).parent().attr('id');
            recalc();
            var volumeItem = $(this).siblings('.totalitem').val();
            if (actVal > 0) {
                $(".volume-a-calculer div[class$='" + itemId + "']").remove();
                $('.volume-a-calculer').append(`<div class="new-item-${fieldName}"><span class="item-name">${itemName}</span>  : <span class="item-qty">${actVal}</span><span class="item-volume">  Volume  : ${volumeItem} m³ ,</span> </div>`);
             }else if (actVal == 0) {
                $(this).parents('.item').removeClass("selected");
                $(".volume-a-calculer div[class$='" + itemId + "']").remove();
            }
        }else {
            $(".volume-a-calculer div[class$='" + itemId + "']").remove();
            $('input[name=' + fieldName + ']').val(0);
        }
        // reset du textearea
        var temp = '';
        $('.result-volume-a-calculer textarea').val('');
        //Ajout du contenu de volume-a-calculer avec saut de ligne
        $('.volume-a-calculer div').each(function(index) {
            $('.liste-fourniture-send textarea').val(cleanArea(temp + $(this).text()));
            $('.result-volume-a-calculer textarea').val(cleanArea(temp + $(this).text()));
            temp = $('.result-volume-a-calculer textarea').val();
        });

        recalc();
    });
    /***Reset calc forms***/
    $( '.reset-calculateur' ).on('click',function() {
      $( '.qtyvalue' ).val('0');
      $( '#grandTotal' ).html('0');
      $( '.volume-a-calculer' ).html('');
      $( '.result-volume-a-calculer textarea' ).val('');
      $( '.item' ).removeClass( "selected" );
    });
  }
  /**** Gestion deplacement volume à demenager
  **/
  $(window).on('scroll',function() {
    var menuH = $( ".row-top .col-menu" ).height();
    var space = (spaceTop) ? spaceTop : -300;
    var In = $( '.row-top' ).offset().top + space;
    var Out = $( '.row-bottom' ).offset().top - menuH + space;
    var screenTop = $(document).scrollTop() + space;
    if (( $(this).scrollTop() >= In ) && ($(this).scrollTop() < Out )) {
      $( '.row-top' ).addClass( "m-sticky" );
      $('.col-menu').css('top', screenTop);
    } else if ( $(this).scrollTop() >= Out ) {
      $( '.row-top' ).removeClass( "m-sticky" );
      $( '.row-top' ).addClass( "m-sticky-bot" );
    } else {
      $( '.row-top' ).removeClass( "m-sticky" );
      $( '.row-top' ).removeClass( "m-sticky-bot" );
    }
  });
  setTimeout(function(){
    constructTab(titleCatg);
    constructItem();
    recalc();
    construcBtn();

/******************** sauvegarde des éléments du calculateur dans le localStorage ****/

    $(window).on('beforeunload',function (e) {
      console.log('*************reload');
      var labelVolume = []; var valueVolume = [];
      $('#Tabs .item').each(function () {
        if ($(this).find('.qtyvalue').val() > 0) {
          var laLabel = $(this).attr('id'); 
          labelVolume.push(laLabel);
          var laValue = $(this).find('.qtyvalue').val(); 
          valueVolume.push(laValue);
        }
      });
      localStorage.setItem('labelVolume', labelVolume);
      localStorage.setItem('valueVolume', valueVolume);
      localStorage.setItem('totalVolume', $('#grandTotal').text());
      localStorage.setItem('exerptVolume', cleanArea($('#input_37_321').val()).replaceAll('m³','m³,'));
      localStorage.setItem('suppVolume', $('#input_37_383').val());
    });
    $( document ).ready(function (e){
        if (localStorage.getItem("labelVolume").length > 0) {
            var labelVolume = localStorage.getItem("labelVolume").split(",");
            var valueVolume = localStorage.getItem("valueVolume").split(",");
            var expertVolume = localStorage.getItem("exerptVolume").split(",");
            $('#grandTotal').html(localStorage.getItem("totalVolume"));
            $('.result-volume-a-calculer textarea').val(localStorage.getItem("exerptVolume").replaceAll(',','').replace(/\s/g, '').replaceAll('m³','m³\n'));//.replaceAll('m³','m³\n')
          for (var i =0; i< labelVolume.length; i++) {
            var thisid = "#" + labelVolume[i]; 
            var thisvalue = valueVolume[i];
            var exp = expertVolume[i]
            $(thisid).addClass('selected');
            thisid = thisid + " .qtyvalue";
            $(thisid).val(thisvalue);
            $('.volume-a-calculer').append(`<div class="new-item-${labelVolume[i]}"><span class="item-name">${exp}</span> </div>`);
          }
        }
    });
  },800);
});
