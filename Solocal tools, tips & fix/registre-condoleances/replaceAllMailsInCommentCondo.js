
const isCondo = window.location.pathname.includes('/condolences');
if(isCondo){
    const regex = /([\w\.\-\pL]+@\w+\.\w+)/g
    $('.commentlist .message p:last-child').each((i,t)=>{
         t.innerText = t.innerText.replace(regex,'');
    });
}
