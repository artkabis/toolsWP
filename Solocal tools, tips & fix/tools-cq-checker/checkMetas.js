javascript:(($)=>{
    const title = $('title').text();
    const desc = $('meta[name="description"]').attr('content');
    console.log('test title:',title?.length,(title.length>=50 && title.length<=65));
    console.log('test desc:',desc?.length,(desc.length>=140 && desc.length<=156));
        $('body').prepend(`    <style class="styleInfosMeta">        .containerMeta {            position: fixed;            left: 50%;            top: 50%;            transform: translate(-50%,-50%);            background: rgb( 0 0 0 /95%);            color: orange;            padding: 30px;            z-index: 99999;        }            a.btnClose {            position: absolute;            right: 0;            top: 0;            transform: translateY(-100%);            background: red;            padding: 5px 15px;            color: white;        }        .presMeta {            color: white;        }    </style>    <div class="containerMeta" style=""><a class="btnClose" style="cursor:pointer;">X</a><div class="contentMeta"><span class="presMeta">meta title >> </span>${title}<br><span class="presMeta" style="color:${title.length>=50 && title.length<=65 ? "orange" : "red"}">nb caractéres >> ${title.length} (de 50 à 65)</span><br><br><span class="presMeta">meta descrption >> </span>${desc}<br><span class="presMeta" style="color:${desc.length>=140 && desc.length<=156 ? "orange" : "red"};">nb caractéres >> ${desc.length}  (de 140 à 156)</span></div></div>`);
    $('.btnClose').on('click',()=>$('.containerMeta, .styleInfosMeta').fadeOut(300,function(){$(this).remove()}));
})(jQuery);
