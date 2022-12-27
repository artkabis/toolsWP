const siteName = dmAPI.getSiteName();
const externalId = dmAPI.getSiteExternalId();
const planId = dmAPI.getSitePlanID();
const device = dmAPI.getCurrentDeviceType();
dmAPI.runOnReady('DudaReadyDOM',funcReadyDomDM);

function funcReadyDomDM(){
    console.log('Duda ready - infos -> siteName:',siteName,' - externalId : ',externalId,' - planId : ',planId,' - device : ',device);
}

//Bookmark
javascript:(()=>console.table({'gamme':Parameters.ExternalUid.split('|')[0], 'epj':Parameters.ExternalUid.split('|')[1],'url onLive':Parameters.HomeUrl,'prepub':Parameters.AccountUUID,'device':window._currentDevice,' ID plan : ',dmAPI.getSitePlanID()}))()

