const debut = new Date("December 01, 2023 00:00:00");// Date de départ
const fin = new Date("December 15, 2023 18:00:00");//Date de fin 
const auj = new Date();// date du jour
const evenOn = auj.getTime()>debut.getTime() && auj.getTime()<fin.getTime();//événement en cours
(!evenOn)&&setTimeout(()=>$('#info-15').remove(),05);
