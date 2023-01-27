const axios = require('axios');
const xml2js = require('xml2js');
const cheerio = require('cheerio');
const fs = require('fs');
const url = require('url');
const puppeteer = require('puppeteer');
const jsdom = require("jsdom");

const DudaWebSite = true;



const urlOrigine = (DudaWebSite) ? 'https://www.groupama-antilles.com' : 'https://www.meric-auto-industrie.fr';
const sitemapUrl = (DudaWebSite) ? urlOrigine + '/sitemap.xml' : urlOrigine + '/page-sitemap.xml';
const validLinks = [], inValidLinks = [];
const findValue = (obj, value) => {
  for (const [key, val] of Object.entries(obj)) {
    if (val === value) {
      return key;
    }
    if (typeof val === "object") {
      const result = findValue(val, value);
      if (result) {
        return result;
      }
    }
  }
}

async function checkLinksWithPuppeteer(link) {
  // Lancement de la navigateur
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  // Navigation vers la page à vérifier
  await page.goto(link);
  // Attendre le chargement complet de la page (les éléments de la page sont interactifs)
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  // Récupération des liens de la page
  const links = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    return links.map(link => link.href);
  });
  console.log(links);
  // Fermeture de la fenêtre de navigation
  await browser.close();
  return links
}

const { JSDOM } = jsdom;

async function getDataDOM(url) {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const windowD = dom.window
    const document = windowD.document;
    return document.querySelectorAll('a');


    // // Récupération des informations depuis le DOM
    // const title = document.querySelector("title").textContent;
    // const h1 = document.querySelector("h1").textContent;

  } catch (error) {
    console.error(error);
  }
}

async function checkLinksFromSitemap() {
  try {
    // Récupération du sitemap
    const response = await axios.get(sitemapUrl);
    const sitemapXml = response.data;
    const parser = new xml2js.Parser();
    parser.parseString(sitemapXml, (err, result) => {
      if (err) {
        console.log(`Error parsing sitemap: ${err}`);
        return;
      }
      console.log('result : ', result.urlset.url.map(url => url.loc))
      // Récupération des liens dans le sitemap
      const links = result.urlset.url.map(url => (!DudaWebSite) ? url.loc[0] : url.loc);
      console.log('links : ', links);
      async function getLinks() {
        for (const link of links) {
          try {
            // Vérification de la validité de la requête vers chaque lien du sitemap
            const response = await axios.get(link);
            console.log('response >>>>>>>>>>>>>>>>>>>>>> ', response.status)
            if (response.status === 200) {
              // Récupération des liens internes de chaque page associée au lien du sitemap
              const $ = cheerio.load(response.data);
              let linksPage;
              (!DudaWebSite) ? linksPage = $('a') : await getDataDOM(link);//await checkLinksWithPuppeteer(link);
              console.log('linksPage ------> ', linksPage);
              linksPage.each(async (i, linkPage) => {
                if ($(linkPage).attr('href')) {
                  if ($(linkPage).attr('href').at(0) === "/" || $(linkPage).attr('href').includes(urlOrigine)) {
                    //console.log('scan page - ', link, ' ----- cheerio link href : ', $(linkPage).attr('href'));
                    const urlFinal = ($(linkPage).attr('href').at(0) === "/") ? urlOrigine + $(linkPage).attr('href') : $(linkPage).attr('href')
                    const response = await axios.get(urlFinal);

                    let parsedURL;
                    if (response && response.status === 200) {
                      //const { _currentUrl } = response;
                      //console.log(findValue(response.data, "_currentUrl"));
                      parsedURL = url.parse(response.config.url).href;
                      //console.log(parsedURL);

                      validLinks.push({ baseUrl: link, checkurl: parsedURL, status: response.status });
                      console.log('*************************** ', validLinks);
                      fs.writeFileSync('validLinks1.json', JSON.stringify(validLinks));


                    } else {
                      parsedURL = url.parse(response.config.url).href;
                      //console.log(i, urlOrigine + $(linkPage).attr('href'));
                      inValidLinks.push({ baseurl: linkPage, checkurl: parsedURL, status: response.status });
                      fs.writeFileSync('inValidLinks1.json', JSON.stringify(inValidLinks));
                    }
                  }
                }
              });
            }
          } catch (error) {
            console.log(`Error fetching ${link}: ${error}`);
          }
        }
      }
      getLinks();
      //setTimeout(function() {

      //}, 15000)
      // Ecriture des résultats dans des fichiers txt
      //fs.writeFileSync('valid_links.txt', validLinks.join('\n'));
      //fs.writeFileSync('invalid_links.txt', inValidLinks.join('\n'));
      //fs.writeFileSync('validLinks.json', JSON.stringify(validLinks));
      //fs.writeFileSync('inValidLinks.json', JSON.stringify(validLinks));

    });

  } catch (error) {
    console.log(`Error fetching sitemap: ${error}`);
  }
}

checkLinksFromSitemap(sitemapUrl)

 // fs.writeFileSync('validLinks.json', JSON.stringify(validLinks));
  //fs.writeFileSync('inValidLinks.json', JSON.stringify(validLinks));


