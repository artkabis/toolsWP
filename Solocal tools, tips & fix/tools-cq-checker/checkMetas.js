javascript:(($)=>{const title = $('title').text();const desc = $('meta[name="description"]').attr('content');    $('body').prepend(`    <style class="styleInfosMeta">        .containerMeta {            position: fixed;            left: 50%;            top: 50%;            transform: translate(-50%,-50%);            background: rgb( 0 0 0 /95%);            color: orange;            padding: 30px;            z-index: 99999;        }            a.btnClose {            position: absolute;            right: 0;            top: 0;            transform: translateY(-100%);            background: red;            padding: 5px 15px;            color: white;        }        .presMeta {            color: white;        }    </style>    <div class="containerMeta" style=""><a class="btnClose">X</a><div class="contentMeta"><span class="presMeta">meta title >> </span>${title}<br><span class="presMeta">nb caractéres >> </span>${title.length}<br><br><span class="presMeta">meta descrption >> </span>${desc}<br><span class="presMeta">nb caractéres >> </span>${desc.length}</div></div>`);$('.btnClose').on('click',()=>$('.containerMeta, .styleInfosMeta').fadeOut(300,function(){$(this).remove()}));})(jQuery);