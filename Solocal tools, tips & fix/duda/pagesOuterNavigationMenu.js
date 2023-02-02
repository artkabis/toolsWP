(()=>{
        const menuJson = JSON.parse(atob(Parameters.NavItems));
        const subNavOk = menuJson.filter((t)=>t.subNav.length>0);
        const nv1OutNav = menuJson.filter((t)=>t.inNavigation===false);
        let nv2Temp = {};
        const nv2OutNav = (subNavOk) && subNavOk.filter((s)=>s.inNavigation==false);
    return (nv2OutNav>0) ? {nv1OutNav,nv2OutNav} : nv1OutNav
})()
