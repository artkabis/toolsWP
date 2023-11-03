// MODULE CTA VERTICAL V3 : show phone number
//
const phones = { 0: 'Magasin Commune 01 <br>01 01 01 01 01', 1: 'Magasin Commune 02 <br>02 02 02 02 02', 2: 'Magasin Commune 03 <br>03 03 03 03 03' };
const sitename = dmAPI.getSiteName();

// remove href (desktop-tablet-view)
$('.widget-a6e864-container.desktop-tablet-view a[class*="link_"]').each(function (i, t) {
    $(this).removeAttr('href').css({ cursor: 'pointer' }).attr('onclick', `;return dm_gaq_push_event('ClickToCall', 'Call',null,'${sitename}', this);`);
});
//show phone on click (desktop-tablet-view)
$('.widget-a6e864-container.desktop-tablet-view a[class*="link_"]').on('click', function (me) {
    me.preventDefault();
    const id = Number($(this).attr('class').at(-1)) - 1;
    console.log('id : ', id);
    $(this).children().html(phones[id]);
});
