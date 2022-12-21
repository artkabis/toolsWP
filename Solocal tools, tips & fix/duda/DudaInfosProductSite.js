const siteName = dmAPI.getSiteName();
const externalId = dmAPI.getSiteExternalId();
const planId = dmAPI.getSitePlanID();
const device = dmAPI.getCurrentDeviceType();
dmAPI.runOnReady('DudaReadyDOM',funcReadyDomDM);



function funcReadyDomDM(){
    console.log('Duda ready - infos -> siteName:',siteName,' - externalId : ',externalId,' - planId : ',planId,' - device : ',device);
}
