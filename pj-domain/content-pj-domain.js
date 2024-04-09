// Liscouet Baptiste
const myURL = "https://pj-plugin.yelsterdigital.com";
// const myURL = "https://pj-plugin.dev.yelsterdigital.com";
// const myURL ="http://localhost:3000";

const googleDomainList = ["google.com", "webcache.googleusercontent.com"]
const selector = {
  "divList": {
    'search_result1': '#center_col div.MjjYud > .g:not(.AuVD)',
    'search_result2': '#center_col div.MjjYud > div > .g:not(.AuVD)',
    'search_result3': '#center_col div.sATSHe:not(:has(.Ww4FFb))',
    'search_result4': '#center_col div.Ww4FFb',
    'ads': '#center_col div.uEierd:not(.v5yQqb)',
    'annuaire': 'a.Ky0SRd'
  },
  "anchor": "a[data-ved]"
}

const domainNoDNSRecord = [
  {
    'domain_name': 'commerces-ouverts.fr',
    'offer': 'LocalPartner'
  },
  {
    'domain_name': 'pagesbreizh.bzh',
    'offer': 'LocalPartner'
  },
  {
    'domain_name': '123pages.fr',
    'offer': 'LocalPartner'
  },
  {
    'domain_name': '118712.fr',
    'offer': '118712'
  },
  {
    'domain_name': 'annuaire.118712.fr',
    'offer': '118712'
  }
]

if (document.body.id) {
  function updateDomainsAndDivList() {
    let domains = [];
    try {
      let divList = selector && document.querySelectorAll(Object.values(selector.divList).join(','));// + ', .Ky0SRd[href*="pagesjaunes"]');
      console.log('------------divList : ', divList)
      let urls = getUrl(divList);
      urls.forEach(domain => {
        domains.push(domain);
      });
      highlightApiData(JSON.stringify(domains), selector, divList);
    } catch (err) {
      console.log(err);
    }
  }
  const observer = new MutationObserver(updateDomainsAndDivList);
  const targetNode = document.body;
  const observerConfig = { childList: true, subtree: true };
  observer.observe(targetNode, observerConfig);
  updateDomainsAndDivList();
}

function getUrl(divList) {
  let urls = [];
  for (let div of Object.values(divList)) {
    try {
      let aTag = div.tagName !== "A" ? div.querySelector(selector.anchor) : div;
      if (aTag) {
        url = getHostName(aTag.getAttribute("href"));
        urls.push(url);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return urls;
}

async function getDNSRecod(domain) {
  request = "https://dns.google/resolve?name=" + domain;
  const response = await fetch(request);
  const result = await response.json();
  let results = []

  if (result && result.Answer && result.Answer !== null) {
    let answers = result.Answer
    answers.map((data) => {
      results.push(data.data)
    })
  }
  return results
}

async function filterGoogleDomain(domains) {
  const result = domains.filter((domain) => {
    return !googleDomainList.includes(domain);
  })
  return result
}

async function isStoreLocatorThenHighlight(request, div) {
  const response = await fetch(request);
  const result = await response.json();

  if (result.Answer && result.Answer[0].data.includes("leadformance.com")) {
    highlightResults(div, "LeadFormance");
  }
}

async function highlightApiData(domains, selector, divList) {
  let parseDomains = JSON.parse(domains);
  parseDomains = await filterGoogleDomain(parseDomains);

  if (parseDomains && parseDomains.length > 0) {
    let domain_dns = [];
    let query_data = [];

    for (let domain of parseDomains) {
      let domain_item = {
        domain: domain,
        dns_record: await getDNSRecod(domain),
        offer: null
      };
      domain_dns.push(domain_item);

      for (let record of domain_item.dns_record) {
        query_data.push(record);
        query_data.push(domain);
      }
    }

    let datas = [];

    if (query_data.length) {
      const request_data = JSON.stringify(query_data);

      let response = await fetch(`${myURL}/query`, {
        method: "POST",
        body: request_data,
        headers: {
          "Content-Type": "application/json",
        },
      });

      datas = await response.json();
    }

    datas = [...datas, ...domainNoDNSRecord];

    if (datas && datas.length > 0) {
      datas.map(data => {
        for (let domain of domain_dns) {
          if (domain.offer == null) {
            if (data.domain_name == domain.domain) {
              domain.offer = data.offer;
              continue;
            } else {
              for (let dns_ip of domain.dns_record) {
                if (dns_ip == data.domain_name) {
                  domain.offer = data.offer;
                  break;
                }
              }
            }
          }
        }
      });
    }

    for (let item of divList) {
      let anchorElem = item.tagName !== "A" ? item.querySelector(selector.anchor) : item;
      if (anchorElem) {
        let url = getHostName(anchorElem.getAttribute("href"));
        let isChecked = false;

        // if (url && url.includes("pagesjaunes")) {
        //   highlightResults(item, "PagesJaunes");
        //   isChecked = true;
        // }

        if (!isChecked) {
          for (let domain of domain_dns) {
            if (domain.offer && domain.domain == url) {
              highlightResults(item, domain.offer);
              isChecked = true;
              break;
            }
          }
        }

        if (!isChecked) {
          isStoreLocatorThenHighlight("https://dns.google/resolve?name=" + url + "&type=CNAME", item);
        }
      }
    }
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

// const createTextOffer = (node, className, textName) => {
//   if (!node.classList.contains('pjSearchColor')) {
//     let newDiv = document.createElement('div');
//     node.className = 'pjSearchColor';
//     newDiv.style.backgroundColor = 'black';
//     newDiv.style.color = 'white';
//     newDiv.style.padding = '15px';
//     newDiv.classList.add(className);
//     newDiv.innerText = textName;
//     node.appendChild(newDiv);
//   } else {
//     return
//   }
// }

const highlightResults = (node, offer) => {
  node.style.padding = '15px';
  // const existingTextElement = node.querySelector('.pjSearchColor');
  // if (existingTextElement) {
  //   return;
  // } else {
    console.log('hreffffff :::: ',node.getAttribute('href'));
    if (offer == "Essentiel") {
      node.style.backgroundColor = "rgb(233 255 8 / 39%)";
      node.style.boxShadow = "0px 0px 10px 10px rgb(233 255 8 / 39%)";
      //createTextOffer(node, 'essentiel', 'Essentiel');
    } else if (offer == "Premium") {
      node.style.backgroundColor = "rgb(0 255 245 / 39%)";
      node.style.boxShadow = "0px 0px 10px 7px rgb(0 255 245 / 39%)";
      //createTextOffer(node, 'premium', 'Premium');
    } else if (offer == "Privilege") {
      node.style.backgroundColor = "rgb(7 139 255 / 48%)";
      node.style.boxShadow = "0px 0px 10px 7px rgb(7 139 255 / 48%)";
      //createTextOffer(node, 'privilege', 'Privilège');
    } else if (offer == "Minisite") {
      node.style.backgroundColor = "rgb(255 121 16 / 50%)";
      node.style.boxShadow = "0px 0px 10px 7px rgb(255 121 16 / 50%)";
      //createTextOffer(node, 'minisite', 'Minisite');
    } else if (offer == "LandingPage") {
      node.style.backgroundColor = "rgb(255 37 132 / 39%)";
      node.style.boxShadow = "0px 0px 10px 7px rgb(255 37 132 / 39%)";
      //createTextOffer(node, 'landingPage', 'LandingPage');
    } else if (offer == "LeadFormance") {
      node.style.backgroundColor = "rgb(175 96 254 / 39%)";
      node.style.boxShadow = "0px 0px 10px 7px rgb(175 96 254 / 39%)";
      //createTextOffer(node, 'leadFormance', 'LeadFormance');
    } else if (offer == "Mappy") {
      node.style.backgroundColor = "rgb(19 255 66 / 39%)";
      node.style.boxShadow = "0px 0px 10px 7px rgb(19 255 66 / 39%)";
      //createTextOffer(node, 'mappy', 'Mappy');
    } else if (offer == "118712") {
      node.style.backgroundColor = "rgb(19 255 66 / 39%)";
      node.style.boxShadow = "0px 0px 10px 7px rgb(19 255 66 / 39%)";
      //createTextOffer(node, 'offre118712', '118712');
    } else if (offer == "LocalPartner" ) {
      node.style.backgroundColor = "rgba(255, 7, 7, .4)";
      node.style.boxShadow = "0px 0px 10px 7px rgba(255, 7, 7, .36)";
      //createTextOffer(node, 'localPartner', 'LocalPartner');
    }
    // } else if ((offer == "PagesJaunes" || node.getAttribute('href').includes('pagesjaunes')) && !node.classList.contains('pjSearchColor')) {
    //   console.log('pj detected : children : ', node.children, ' class list children : ', node.classList, 'includes pagesjaunes class = ', node.classList.contains('pagesjaunes'));
    //   node.style.backgroundColor = "rgba(233, 255, 8, 0.39)";
    //   node.style.boxShadow = "rgba(233, 255, 8, 0.39) 0px 0px 10px 10px";
    //   createTextOffer(node, 'pagesjaunes', 'PagesJaunes');
    // }
  //}
}
