(()=>{
        const menuJson = JSON.parse(atob(Parameters.NavItems));
        const subNavOk = menuJson.filter((t)=>t.subNav.length>0);
        const nv1OutNav = menuJson.filter((t)=>t.inNavigation===false);
        const nv1InNav = menuJson.filter((t)=>t.inNavigation===true);
        nv1OutNav.map((t)=>t.niveau1Out = true),nv1InNav.map((t)=>t.niveau1In = true);
        let nv2Temp = {};
        const nv2OutNav = (subNavOk) && subNavOk.filter((s)=>s.inNavigation==false);
        nv2OutNav.niveau2Out = true;
        const nv2InNav = (subNavOk) && subNavOk.filter((s)=>s.inNavigation==true);
        nv2InNav.niveau2In = true;
        const finalNavOut = (nv2OutNav>0) ? {nv1OutNav,nv2OutNav} : nv1OutNav;
        const finalNavIn = (nv2InNav>0) ? {nv1InNav,nv2InNav} : nv1InNav
        console.log('---------------------------------- Visible en navigation (depuis le menu) --------------------------------------------');
        console.table( finalNavIn );
        console.log('---------------------------------- Non visible dans la navigation (depuis le menu) --------------------------------------------');
        console.table( finalNavOut );
})()
