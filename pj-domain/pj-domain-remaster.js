javascript:(() =>{
    const myURL = "https://pj-plugin.yelsterdigital.com";
    const googleDomainList = ["google.com", "webcache.googleusercontent.com"];
    const selector = {
    "domainListval": ".g .tF2Cxc, .usJj9c, .uEierd, .jtfYYd",
    "querydivListval": "a:first-child"
    };
    if (document.body.id) {
        let domains = [];
        try {
        const divList = selector && Array.from( document.querySelectorAll(selector.domainListval));
        let urls = getUrl(divList);
        urls = urls.map(domain => domains.push(domain));
        highlightApiData(JSON.stringify(domains), selector, divList);
        }
        catch (err) {
        console.log(err);
        }
    }
    function getUrl(divList) {
    let urls = [];
    for (let div of divList) {
        try {
        let url = '';
        url = getHostName(div.querySelector(selector.querydivListval).getAttribute("href"));
        urls.push(url);
        }
        catch (err) {
        console.log(err);
        }
    }
    return urls
    }

    async function getDNSRecod(domain) {
    request = "https://dns.google/resolve?name=" + domain;
    const result = await fetch(request).then(json => {return json.json()}).catch(err => console.log(err));
    let results = [];
    if (result && result.Answer && result.Answer !== null) {
        result.Answer.map(data => results.push(data.data));
    }
    return results
    }
    async function filterGoogleDomain(domains) {
    return domains.filter(domain =>{ return !googleDomainList.includes(domain)})
    }
    async function isStoreLocatorThenHighlight(request, div, url) {
    const result = await fetch(request).then(json => {return json.json()}).catch(err => console.log(err));
    if (result.Answer && result.Answer[0].data.includes("leadformance.com")) {
        highlightResults(div, "LeadFormance",url);
    }
    };

    async function highlightApiData(domains, selector, divList) {
        parseDomains = await filterGoogleDomain(JSON.parse(domains));
        if (parseDomains && parseDomains.length > 0) {
            let domain_dns = [];
            var query_data = [];
            for (let domain of parseDomains) {
                let domain_item = {};
                domain_item.domain = domain;
                let dns_record = await getDNSRecod(domain);
                domain_item.dns_record = dns_record;
                domain_item.offer = null;
                domain_dns.push(domain_item);
                for (let record of dns_record) {
                    query_data.push(record);
                    query_data.push(domain);
                }
            }
            const request_data = JSON.stringify(query_data);
            let response = await fetch(`${myURL}/query`, {
            method: "POST",
            body: request_data,
            headers: {
                "Content-Type": "application/json",
            },
            }).catch(err => console.log(err));
            let datas = await response.json();
            if (datas && datas.length > 0) {
            datas.map(data => {
                for (let domain of domain_dns) {
                if (domain.offer == null) {
                    if (data.domain_name == domain.domain) {
                    domain.offer = data.offer;
                    continue
                    }
                    else {
                    for (let dns_ip of domain.dns_record) {
                        console.log('dn_ip : ',dns_ip, ' domaine name ',data.domain_name);
                        if (dns_ip == data.domain_name) {
                        domain.offer = data.offer;
                        break
                        }
                    }
                    }
                }
                else {
                    console.log(domain.offer);
                    continue
                }
                }
            });
            }
            let checkedDivList = [];
            for(let item of divList){
                let checkedItem = {};
                checkedItem.div = item;
                checkedItem.isChecked = false;
                let anchorElem = item.querySelector(selector.querydivListval);
                url = getHostName(anchorElem.getAttribute("href"));
                checkedItem.url = url;
                checkedDivList.push(checkedItem);
            }
            checkedDivList.map((item) => {
                for(let domain of domain_dns){
                    if (domain.offer && domain.domain == item.url) {
                    highlightResults(item.div, domain.offer,domain.domain);
                    item.isChecked = true;
                    break
                    }
                }
            });
            checkedDivList.map((item)=>{
                if(item.isChecked === false){
                    isStoreLocatorThenHighlight("https://dns.google/resolve?name=" + item.url + "&type=CNAME", item.div,item.url);
                }
            });
        }
    }

    function getHostName(url) {
        var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        if (
            match != null &&
            match.length > 2 &&
            typeof match[2] === "string" &&
            match[2].length > 0
        ) {
            return match[2];
        } else {
            return null;
        }
    }

    function highlightResults(node, offer,domain) {
        console.log(offer,domain);
        var newDiv = document.createElement('div'); 
        newDiv.className = 'pjSearchColor'; 
        newDiv.style.backgroundColor = 'black'; 
        newDiv.style.color = 'white'; 
        newDiv.style.padding = '5px 15px'; 
    if (offer == "Essentiel" && !domain.includes("pagesjaunes.fr")) {
            node.style.backgroundColor = 'rgb(148 8 255 / 39%)'; 
            node.style.boxShadow = '0px 0px 10px 7px rgb(148 8 255 / 39%)'; 
            newDiv.classList.add('essentielEncar'); 
            newDiv.innerText = 'Site Essentiel'; 
            node.appendChild(newDiv); 
    } else if (offer.includes("Essentiel") && domain.includes("pagesjaunes.fr")) {
            node.style.backgroundColor = 'rgb(217 255 8 / 39%)'; 
            node.style.boxShadow = '0px 0px 10px 7px rgb(217 255 8 / 39%)';
            newDiv.classList.add('pjEncar'); 
            newDiv.innerText = 'pagesjaunes'; 
            node.appendChild(newDiv); 
    }else if (offer == "Premium") {
            node.style.backgroundColor = 'rgb(0 255 245 / 39%)'; 
            node.style.boxShadow = '0px 0px 10px 7px rgb(0 255 245 / 39%)'; 
            newDiv.classList.add('premiumEncar'); 
            newDiv.innerText = 'Site Premium'; 
            node.appendChild(newDiv); 
    } else if (offer == "Privilege") {
            node.style.backgroundColor = 'rgb(7 139 255 / 48%)'; 
            node.style.boxShadow = '0px 0px 10px 7px rgb(7 139 255 / 48%)'; 
            newDiv.classList.add('privilegelEncar'); 
            newDiv.innerText = 'Site Privilege'; 
            node.appendChild(newDiv); 
    } else if (offer == "Minisite") {
            node.style.backgroundColor = 'rgb(255 121 16 / 50%)'; 
            node.style.boxShadow = '0px 0px 10px 7px rgb(255 121 16 / 50%)'; 
            newDiv.classList.add('ministeEncar'); 
            newDiv.innerText = 'Ministe'; 
            node.appendChild(newDiv); 
    } else if (offer == "LandingPage") {
            node.style.backgroundColor = 'rgb(255 37 132 / 39%)'; 
            node.style.boxShadow = '0px 0px 10px 7px rgb(255 37 132 / 39%)'; 
            newDiv.classList.add('landingpageEncar'); 
            newDiv.innerText = 'LandingPage'; 
            node.appendChild(newDiv); 
    } else if (offer == 'LeadFormance') { 
            node.style.backgroundColor = 'rgb(175 96 254 / 39%)'; 
            node.style.boxShadow = '0px 0px 10px 7px rgb(175 96 254 / 39%)'; 
            newDiv.classList.add('leadformanceEncar'); 
            newDiv.innerText = 'LeadFormance'; 
            node.appendChild(newDiv); 
    }else if (offer == 'Mappy') {
            node.style.backgroundColor = 'rgb(19 255 66 / 39%)'; 
            node.style.boxShadow = '0px 0px 10px 7px rgb(19 255 66 / 39%)'; 
            newDiv.classList.add('mappyEncar'); 
            newDiv.innerText = 'Mappy'; 
            node.appendChild(newDiv); 
    }else if (offer == "LocalPartner") {
        node.style.backgroundColor = "rgb(255 7 7 / 35%)";
        node.style.boxShadow = "0px 0px 10px 7px rgb(253 3 3 / 37%)"; 
            newDiv.classList.add('localPartenerEncar'); 
            newDiv.innerText = 'Partenaire local'; 
            node.appendChild(newDiv); 
    }else if (offer == 'SITECONNECT') {
            node.style.backgroundColor = 'rgb(255 94 0 / 58%)'; 
            node.style.boxShadow = '0px 0px 10px 7px rgb(255 94 0 / 58%)'; 
            newDiv.classList.add('siteConnectEncar');
            newDiv.innerText = 'Site Connect';
            node.appendChild(newDiv); 
        } 
    }
})();
