import * as jQuery from 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js';
import * as jQueryui from 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js';
import * as calc from 'https://rawcdn.githack.com/artkabis/toolsWP/b2154687760ca3b152066029ceb912aa48057b08/demenagement-calculator/sources/calculator.min.js';
import * as jszip from 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js';
import * as xlsx from 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js';





/****
** online WP implementation : https://www.provence-demenagement.com/testing-calculator/
** For view calculateur segment page : add this script in your console (F12) & keypress "Enter"->
document.querySelector('#gform_page_49_1').style.display="none";
document.querySelector('#gform_page_49_3').style.display="block"
***/


export const Calculator = {
  init: ({baseUrl=base_url,xlsxUrl = xlsx_url, datas = undefined, calcul = undefined})=>{
      console.log('loading DOM');
      /**** Start calculator ***/
      //External function "calc"  (codepen js parameters) : https://rawcdn.githack.com/artkabis/toolsWP/b2154687760ca3b152066029ceb912aa48057b08/demenagement-calculator/sources/calculator.min.js

      //var url=//"https://centre-dimagerie.site-privilege.pagesjaunes.fr/wp-content/uploads/sites/1674/2019/06/";
      let [categories_name,tab1,titleCatg,catg] = [[],[],[],[]];//Destructuring assignement
      let [url,urlXlsx,dataJson] = [baseUrl,xlsxUrl,datas];

    /* uncomment for online version and delete const datas ***.
    /*/
     //request xlsx to json (uncomment in current domain)
    console.log('calcul : ',calcul,'   dataJson : ',dataJson);
    if(!dataJson){
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
          //let _read = jszip.read();
          console.log('jzip : ',jszip);
          console.log('  read init',jszip.read());
          console.log('_read custom : ', jszip.read);
          var workbook = xlsx.XLSX.jszip.read(bstr, {type: "binary"});
          // DO SOMETHING WITH workbook HERE 
          var first_sheet_name = workbook.SheetNames[0];
          // Get worksheet 
          var worksheet = workbook.Sheets[first_sheet_name];
          tab1=xlsx.XLSX.utils.sheet_to_json(worksheet, {raw: true});
        }
        oReq.send();
    }
      let tab;//global data init
      const digitNb = $n=> {
        return ((typeof $n === 'number') ? String($n) : $n).padStart(4, '0');//digt : if 1 > 0001, if 10 > 0010, if 100 > 0100, ...
      };
      const cleanArray = (array) => {
        return [...new Set(array)];//fusion multiple values array
      }
      const cleanArea = ($str,dataType)=> {
        return (dataType) ? $.trim($str.replace(/\s\s+/g, '').replace(/,/g, '\n').replaceAll(/^\s+|\s+$/gm,'')) : $.trim($str.replace(/,/g, '\n'));
      }
      setTimeout(()=>{
        tab = (dataJson) ? dataJson : tab1;//Si la requête est décommenter, à remplacer par tab1
        console.log(tab)
        for( var i =0; i<tab.length;i++ ){catg.push(tab[i].categorie);}
        titleCatg = cleanArray(catg);//Titles categories (no-duplicate)
      },300);
      const constructTab = ($titleCatg) =>{
           (typeof  $titleCatg!== undefined) ? (()=>{
             for(var i=0;i<$titleCatg.length;i++){ 
                var num=1+i;
                $('.resp-tabs-list').append('<li><a href="#tab-'+num+'">'+$titleCatg[i]+'</a></li>');
                $('.resp-tabs-container').append(`<div id="tab-${num}" class="tab"></div>`);
                (i ===$titleCatg.length-1) && (()=>{$("#Tabs").tabs(); return})();
              }
           })() : (()=>{
                console.error("Les catégories du fichier xlsx n'ont pu être récupérées");
           })();
        }
      const  constructItem = () =>{
        let tNames=[];
        $.grep( tab, ( n, i )=> {
          for(var j=0;j<titleCatg.length;j++){
              ( n.categorie == titleCatg[j]) && (()=>{        
                 const name = n.name,img = n["content/img"],title = n["content/title"],value = n["content/val"];
                 $('#tab-'+(j+1)).append(`<div id="item-${digitNb(i)}" class="item ${name}"><span class="item-text">${title}</span><span id="price_item_${digitNb(i)}">${value}</span><span class="img_item"></span><input type="button" value="-" class="qtyminus" /><input type="text" class="qtyvalue" value="0" size="2"><input type="button" value="+" class="qtyplus"/><input class="totalitem" id="total_item" type="hidden" value="0"></div>`);   
                 $("."+name).find(".img_item").css('background-image',"url("+url+img+")");
             })();
          }
        });
      }
      /***** Extract datas for the categories and creat DOM ****/
      $("input[name^=qty_item_]").bind("keyup", recalc);
      function recalc() {
        //calcul is global var in html page DOM, qty & price contains a string to eval
        const calculEval = (calcul) && {calcStr:calcul.calcStr, qty: eval(calcul.qty),price: eval(calcul.price)};
        (calculEval) ? (()=>{
          $("[id^=total_item]").calc(calculEval.calcStr, {qty: calculEval.qty,price: calculEval.price}, function(s) {
            return s;
          }, function($this) {
            const sum = $this.sum().toFixed(2);
            $("#grandTotal").text(sum);
            $("#input_25_335").val(sum);
          });
        })() : (()=>{
          //if no calcul global var, construct the calc function
          $("[id^=total_item]").calc("qty * price", {qty: $("input[name^=qty_item_]"),price: $("[id^=price_item_]")}, function(s) {
            return s;
          }, function($this) {
            const sum = $this.sum().toFixed(2);
            $("#grandTotal").text(sum);
            $("#input_25_335").val(sum);
          });
        })();
      }
      const construcBtn = () =>{
        $(".qtyvalue").each(function() {
            const id = $(this).closest('.item').attr('id');
            $(this).attr("name", "qty_item_" + id);
        });
        $(".totalitem").each(function() {
            const id = $(this).closest('.item').attr('id');
            $(this).attr("id", "total_item_" + id);
        });  
        $(".qtyplus").each(function() {
            var id = $(this).closest('.item').attr('id');
            $(this).attr("field", "qty_item_" + id);
        }).on('click',function(e) {
            let temp = '';
            e.preventDefault();
            const fieldName = $(this).attr('field');
            let currentVal = Number($('input[name=' + fieldName + ']').val());
            (!isNaN(currentVal)) ? (()=>{
                $('input[name=' + fieldName + ']').val(currentVal + 1);
              recalc();
               const actVal = $(this).siblings('.qtyvalue').val(),
                     itemName = $(this).siblings('.item-text').text(),
                     itemId = $(this).parent().attr('id'),
                     volumeItem = $(this).parent().find('.totalitem').val();
              (actVal > 0) ? (()=>{
                 $(this).parents('.item').addClass("selected");
                    $(".volume-a-calculer div[class$='" + itemId + "']").remove();
                    $('.volume-a-calculer').append(`<div class="new-item-${fieldName}"> <span class="item-name">${itemName}</span>&nbsp;:&nbsp;<span class="item-qty">${actVal}</span><span class="item-volume">&nbsp;->&nbsp;Volume&nbsp;:&nbsp;${volumeItem} m³ ,</span> </div>`);
              })() :  $(".volume-a-calculer div[class$='" + itemId + "']").remove();
           })() : (()=>{
                $(".volume-a-calculer div[class$='" + itemId + "']").remove();
                $('input[name=' + fieldName + ']').val(0);
            })();

            // reset du textearea
            $('.result-volume-a-calculer textarea').val('');
            //Ajout du contenu de volume-a-calculer avec saut de ligne
            $('.volume-a-calculer div').each(function(index) {
                $('.liste-fourniture-send textarea').val(cleanArea(temp + $(this).text(),true));
               $('.result-volume-a-calculer textarea').val(cleanArea(temp + $(this).text(),false));
                temp = $('.result-volume-a-calculer textarea').val();
            });
            recalc();
        });

        //click less button and calcul new value
        $(".qtyminus").each(function() {
            const id = $(this).closest('.item').attr('id');
            $(this).attr("field", "qty_item_" + id);
        }).on('click',function(e) {
            e.preventDefault();
            let fieldName = $(this).attr('field');
            const currentVal = Number($('input[name=' + fieldName + ']').val());
            (!isNaN(currentVal) && (currentVal >= 1)) ? (()=>{
                $('input[name=' + fieldName + ']').val(currentVal - 1);
              recalc();
                const actVal = $(this).siblings('.qtyvalue').val(),
                    itemName = $(this).siblings('.item-text').text(),
                    itemId = $(this).parent().attr('id'),
                    volumeItem = $(this).siblings('.totalitem').val();
                (actVal && actVal > 0) ? (()=>{
                  //console.log('if actVal > 0 itemId: ',itemId, 'select item : ',$(".volume-a-calculer div[class$='" + itemId + "']"));
                   $(".volume-a-calculer div[class$='" + itemId + "']").remove();
                   $('.volume-a-calculer').append(`<div class="new-item-${fieldName}"><span class="item-name">${itemName}</span>&nbsp;:&nbsp;<span class="item-qty">${actVal}</span><span class="item-volume">&nbsp;->&nbsp;Volume&nbsp;:>&nbsp;${volumeItem} m³ ,</span> </div>`);
                })() : ($(this).parents('.item').removeClass("selected"),$(".volume-a-calculer div[class$='" + itemId + "']").remove());
            })() : (()=>{
                $(".volume-a-calculer div[class$='" + itemId + "']").remove();
                $('input[name=' + fieldName + ']').val(0);
            })();
            // reset du textearea
            let temp = '';
            $('.result-volume-a-calculer textarea').val('');
            //Add content to volume-a-calculer with break line
            $('.volume-a-calculer div').each(function(index) {
                $('.liste-fourniture-send textarea').val(cleanArea(temp + $(this).text(),true));
               $('.result-volume-a-calculer textarea').val(cleanArea(temp +$(this).text(), false));
                temp = $('.result-volume-a-calculer textarea').val();
            });
            recalc();
        });
        /***Reset calc forms***/
        $( '.reset-calculateur' ).on('click',(me)=>{
          $( '.qtyvalue' ).val('0');
          $( '#grandTotal' ).html('0');
          $( '.volume-a-calculer' ).html('');
          $( '.result-volume-a-calculer textarea' ).val('');
          $( '.item' ).removeClass( "selected" );
        });
      }
      /**** Gestion deplacement volume à demenager
      **/

      $(window).on('scroll',(e)=>{
        const menuH = $( ".row-top .col-menu" ).height();
        const space = (spaceTop) ? spaceTop : -300;//External constante
        const In = $( '.row-top' ).offset().top + space;
        const Out = $( '.row-bottom' ).offset().top - menuH + space;
        const screenTop = $(document).scrollTop() + space;
        ( $(this).scrollTop() >= In  && $(this).scrollTop() < Out ) ? ($( '.row-top' ).addClass( "m-sticky" ),$('.col-menu').css('top', screenTop)) : ($( '.row-top' ).removeClass( "m-sticky" ),$( '.row-top' ).addClass( "m-sticky-bot" )) ? ( $(this).scrollTop() >= Out ) : ($( '.row-top' ).removeClass( "m-sticky" ),$( '.row-top' ).removeClass( "m-sticky-bot" ))
      });


      //Start construct steps calculator
      setTimeout(function(){
        constructTab(titleCatg);//Create tab with titleCategories (global constante)
        constructItem();//Start construct items (datas xlsx to json)
        recalc();//Init calcul
        construcBtn();//Construct button and attach event (mor & less products)

    /******************** save elements in localStorage ****/
        $(window).on('beforeunload',(e)=> {
          let  [labelVolume, valueVolume, laLabel, laValue] = [ [], [], '', '' ];
          $('#Tabs .item').each(function () {
            ($(this).find('.qtyvalue').val() > 0) && (laLabel = $(this).attr('id'), labelVolume.push(laLabel), laValue = $(this).find('.qtyvalue').val(), valueVolume.push(laValue))
          });
          localStorage.setItem('labelVolume', labelVolume);
          localStorage.setItem('valueVolume', valueVolume);
          localStorage.setItem('totalVolume', $('#grandTotal').text());
          localStorage.setItem('exerptVolume', cleanArea($('#input_37_321').val()).replaceAll('m³','m³,'));
          localStorage.setItem('suppVolume', $('#input_37_383').val());
        });

        //after ready document and if localStorage item > 0
        $( document ).ready((e)=>{
            (localStorage.getItem("labelVolume").length > 0) && (()=>{
                let labelVolume = localStorage.getItem("labelVolume").split(","), valueVolume = localStorage.getItem("valueVolume").split(","), exerptVolume = localStorage.getItem("exerptVolume").split(",");
                $('#grandTotal').html(localStorage.getItem("totalVolume"));
                $('.result-volume-a-calculer textarea').val( String(exerptVolume).replaceAll(',','').replace(/\s/g, '').replaceAll('m³','m³\n').replaceAll('->',' -> ').replaceAll(':',' : ') );//.replaceAll('m³','m³\n')
              //loop labelVolume items
              for (var i =0; i< labelVolume.length; i++) {
                let thisid = "#" + labelVolume[i]; 
                const thisvalue = valueVolume[i],
                      thisexp = exerptVolume[i]
                $(thisid).addClass('selected');
                thisid = thisid + " .qtyvalue";
                $(thisid).val(thisvalue);
                $('.volume-a-calculer').append(`<div class="new-item-${labelVolume[i]}"><span class="item-name">${thisexp}</span> </div>`);
              }
            })();
        });
      },400);
  }
}
