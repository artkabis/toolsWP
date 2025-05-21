/**
 * Vérification avancée de la cohérence entre le texte des liens et leurs pages d'atterrissage
 * Optimisé pour les sites web français avec analyse linguistique poussée
 * @version 2.0
 * @returns {Object} Résultats de l'analyse
 */
function checkLinkTextRelevance() {
  console.log('🔍 Démarrage analyse cohérence liens/URL...');
  console.time('Analyse complète');
  
  // Récupérer tous les liens analysés précédemment ou directement de la page
  let links = [];
  
  // Si des liens ont déjà été analysés (via votre système existant)
  if (window.analyzedLinks && window.analyzedLinks.length > 0) {
    links = window.analyzedLinks;
  } else {
    // Sinon, récupérer tous les liens de la page
    const domLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="javascript:"]):not([href^="mailto:"]):not([href^="tel:"])');
    
    domLinks.forEach(link => {
      links.push({
        element: link,
        href: link.getAttribute('href'),
        text: link.textContent.trim() || (link.querySelector('img') ? 'ALT: "' + (link.querySelector('img').getAttribute('alt') || 'Image sans ALT') + '"' : '')
      });
    });
  }
  
  // Résultats de l'analyse
  const results = {
    coherent: [],
    incoherent: [],
    totalChecked: 0,
    metadata: {
      // Métriques générales
      menuLinks: 0,
      ctaLinks: 0,
      imageLinks: 0,
      logoLinks: 0,
      otherLinks: 0,
      // Types de correspondances
      directMatches: 0,      // Correspondance directe texte/URL
      semanticMatches: 0,    // Correspondance sémantique
      patternMatches: 0,     // Correspondance linguistique (pattern)
      contextualMatches: 0,  // Correspondance contextuelle
      // Types d'incohérences spécifiques
      ctaGenericToSpecific: 0,
      imageToUnrelatedPage: 0,
      footerLinksIssues: 0,
      majorInconsistencies: 0
    },
    // Cache pour éviter les calculs répétitifs
    cache: {
      cooccurrenceData: null,
      wordStemCache: {},
      semanticCheckCache: {}
    }
  };
  
  /**
   * Liste exhaustive des patterns de transformation en français
   */
  const transformationPatterns = [
    /* ===== SINGULIER -> PLURIEL ===== */
    // Règles standards
    { pattern1: /^(.+)$/, pattern2: /^(.+)s$/ },          // chat -> chats
    { pattern1: /^(.+)$/, pattern2: /^(.+)x$/ },          // cheveu -> cheveux
    { pattern1: /^(.+)au$/, pattern2: /^(.+)aux$/ },      // tableau -> tableaux
    { pattern1: /^(.+)eau$/, pattern2: /^(.+)eaux$/ },    // bateau -> bateaux
    { pattern1: /^(.+)eu$/, pattern2: /^(.+)eux$/ },      // adieu -> adieux
    { pattern1: /^(.+)ou$/, pattern2: /^(.+)oux$/ },      // genou -> genoux
    { pattern1: /^(.+)al$/, pattern2: /^(.+)aux$/ },      // journal -> journaux
    { pattern1: /^(.+)ail$/, pattern2: /^(.+)aux$/ },     // travail -> travaux
    
    /* ===== MASCULIN -> FÉMININ ===== */
    // Règles générales
    { pattern1: /^(.+)$/, pattern2: /^(.+)e$/ },            // petit -> petite
    { pattern1: /^(.+)er$/, pattern2: /^(.+)ere$/ },        // premier -> première
    { pattern1: /^(.+)et$/, pattern2: /^(.+)ette$/ },       // violet -> violette
    { pattern1: /^(.+)on$/, pattern2: /^(.+)onne$/ },       // bon -> bonne
    { pattern1: /^(.+)en$/, pattern2: /^(.+)enne$/ },       // ancien -> ancienne
    { pattern1: /^(.+)s$/, pattern2: /^(.+)se$/ },          // gris -> grise
    { pattern1: /^(.+)c$/, pattern2: /^(.+)che$/ },         // blanc -> blanche
    { pattern1: /^(.+)f$/, pattern2: /^(.+)ve$/ },          // actif -> active
    { pattern1: /^(.+)eur$/, pattern2: /^(.+)euse$/ },      // vendeur -> vendeuse
    { pattern1: /^(.+)eur$/, pattern2: /^(.+)rice$/ },      // directeur -> directrice
    { pattern1: /^(.+)teur$/, pattern2: /^(.+)trice$/ },    // acteur -> actrice
    { pattern1: /^(.+)x$/, pattern2: /^(.+)se$/ },          // heureux -> heureuse
    { pattern1: /^(.+)eau$/, pattern2: /^(.+)elle$/ },      // beau -> belle
    
    /* ===== CONJUGAISONS VERBALES ===== */
    // Infinitif -> Participe présent
    { pattern1: /^(.+)er$/, pattern2: /^(.+)ant$/ },        // parler -> parlant
    { pattern1: /^(.+)ir$/, pattern2: /^(.+)issant$/ },     // finir -> finissant
    { pattern1: /^(.+)re$/, pattern2: /^(.+)ant$/ },        // prendre -> prenant
    
    // Infinitif -> Participe passé
    { pattern1: /^(.+)er$/, pattern2: /^(.+)e$/ },          // parler -> parlé
    { pattern1: /^(.+)ir$/, pattern2: /^(.+)i$/ },          // finir -> fini
    { pattern1: /^(.+)re$/, pattern2: /^(.+)u$/ },          // vendre -> vendu
    
    // Infinitif -> Présent (3e pers. sing)
    { pattern1: /^(.+)er$/, pattern2: /^(.+)e$/ },          // parler -> parle
    { pattern1: /^(.+)ir$/, pattern2: /^(.+)it$/ },         // finir -> finit
    { pattern1: /^(.+)re$/, pattern2: /^(.+)$/ },           // vendre -> vend
    
    /* ===== TRANSFORMATIONS NOMINALES ===== */
    // Verbe -> Nom d'action
    { pattern1: /^(.+)er$/, pattern2: /^(.+)age$/ },        // laver -> lavage
    { pattern1: /^(.+)er$/, pattern2: /^(.+)ement$/ },      // placement -> placement
    { pattern1: /^(.+)er$/, pattern2: /^(.+)ation$/ },      // animer -> animation
    { pattern1: /^(.+)er$/, pattern2: /^(.+)aison$/ },      // livrer -> livraison
    { pattern1: /^(.+)er$/, pattern2: /^(.+)ance$/ },       // assister -> assistance
    { pattern1: /^(.+)ir$/, pattern2: /^(.+)issement$/ },   // investir -> investissement
    { pattern1: /^(.+)er$/, pattern2: /^(.+)ure$/ },        // écrire -> écriture
    { pattern1: /^(.+)re$/, pattern2: /^(.+)ure$/ },        // clore -> clôture
    { pattern1: /^(.+)ir$/, pattern2: /^(.+)ion$/ },        // réunir -> réunion
    
    // Nom -> Nom d'agent
    { pattern1: /^(.+)$/, pattern2: /^(.+)eur$/ },          // chant -> chanteur
    { pattern1: /^(.+)$/, pattern2: /^(.+)euse$/ },         // vend -> vendeuse
    { pattern1: /^(.+)$/, pattern2: /^(.+)ier$/ },          // café -> cafetier
    { pattern1: /^(.+)$/, pattern2: /^(.+)iere$/ },         // jardin -> jardinière
    { pattern1: /^(.+)$/, pattern2: /^(.+)iste$/ },         // journal -> journaliste
    { pattern1: /^(.+)$/, pattern2: /^(.+)aire$/ },         // bibliothèque -> bibliothécaire
    { pattern1: /^(.+)$/, pattern2: /^(.+)ant$/ },          // commerce -> commerçant
    
    // Nom -> Nom de lieu
    { pattern1: /^(.+)$/, pattern2: /^(.+)erie$/ },         // boulanger -> boulangerie
    { pattern1: /^(.+)$/, pattern2: /^(.+)iere$/ },         // thé -> théière
    { pattern1: /^(.+)$/, pattern2: /^(.+)otheque$/ },      // biblio -> bibliothèque
    { pattern1: /^(.+)$/, pattern2: /^(.+)odrome$/ },       // aéro -> aérodrome
    { pattern1: /^(.+)$/, pattern2: /^(.+)arium$/ },        // aqua -> aquarium
    { pattern1: /^(.+)$/, pattern2: /^(.+)oir$/ },          // abreuv -> abreuvoir
    { pattern1: /^(.+)$/, pattern2: /^(.+)oire$/ },         // observat -> observatoire
    
    /* ===== TRANSFORMATIONS ADJECTIVALES ===== */
    // Nom -> Adjectif
    { pattern1: /^(.+)e$/, pattern2: /^(.+)ique$/ },        // économie -> économique
    { pattern1: /^(.+)$/, pattern2: /^(.+)ien$/ },          // musique -> musicien
    { pattern1: /^(.+)$/, pattern2: /^(.+)el$/ },           // nature -> naturel
    { pattern1: /^(.+)$/, pattern2: /^(.+)al$/ },           // nation -> national
    { pattern1: /^(.+)$/, pattern2: /^(.+)aire$/ },         // budget -> budgétaire
    { pattern1: /^(.+)$/, pattern2: /^(.+)eux$/ },          // danger -> dangereux
    { pattern1: /^(.+)$/, pattern2: /^(.+)if$/ },           // sport -> sportif
    { pattern1: /^(.+)e$/, pattern2: /^(.+)atif$/ },        // norme -> normatif
    { pattern1: /^(.+)ite$/, pattern2: /^(.+)itique$/ },    // analyse -> analytique
    { pattern1: /^(.+)e$/, pattern2: /^(.+)if$/ },          // masse -> massif
    { pattern1: /^(.+)e$/, pattern2: /^(.+)ive$/ },         // masse -> massive
    { pattern1: /^(.+)ent$/, pattern2: /^(.+)entiel$/ },    // existence -> existentiel
    
    // Verbe -> Adjectif
    { pattern1: /^(.+)er$/, pattern2: /^(.+)able$/ },       // laver -> lavable
    { pattern1: /^(.+)er$/, pattern2: /^(.+)ible$/ },       // convertir -> convertible
    { pattern1: /^(.+)er$/, pattern2: /^(.+)if$/ },         // créer -> créatif
    { pattern1: /^(.+)ir$/, pattern2: /^(.+)issant$/ },     // finir -> finissant
    { pattern1: /^(.+)ir$/, pattern2: /^(.+)issable$/ },    // définir -> définissable
    
    /* ===== TRANSFORMATIONS PAR PRÉFIXATION ===== */
    // Négation
    { pattern1: /^(.+)$/, pattern2: /^in(.+)$/ },           // utile -> inutile
    { pattern1: /^(.+)$/, pattern2: /^im(.+)$/ },           // possible -> impossible
    { pattern1: /^(.+)$/, pattern2: /^ir(.+)$/ },           // réel -> irréel
    { pattern1: /^(.+)$/, pattern2: /^il(.+)$/ },           // légal -> illégal
    { pattern1: /^(.+)$/, pattern2: /^a(.+)$/ },            // moral -> amoral
    { pattern1: /^(.+)$/, pattern2: /^anti(.+)$/ },         // virus -> antivirus
    { pattern1: /^(.+)$/, pattern2: /^non(.+)$/ },          // sens -> nonsens
    
    // Diminutif/Augmentatif
    { pattern1: /^(.+)$/, pattern2: /^mini(.+)$/ },         // jupe -> minijupe
    { pattern1: /^(.+)$/, pattern2: /^micro(.+)$/ },        // onde -> microonde
    { pattern1: /^(.+)$/, pattern2: /^macro(.+)$/ },        // économie -> macroéconomie
    { pattern1: /^(.+)$/, pattern2: /^maxi(.+)$/ },         // format -> maxiformat
    { pattern1: /^(.+)$/, pattern2: /^hyper(.+)$/ },        // marché -> hypermarché
    { pattern1: /^(.+)$/, pattern2: /^super(.+)$/ },        // marché -> supermarché
    { pattern1: /^(.+)$/, pattern2: /^ultra(.+)$/ },        // son -> ultrason
    
    // Préfixes spatiaux/temporels
    { pattern1: /^(.+)$/, pattern2: /^pre(.+)$/ },          // histoire -> préhistoire
    { pattern1: /^(.+)$/, pattern2: /^post(.+)$/ },         // guerre -> postguerre
    { pattern1: /^(.+)$/, pattern2: /^ex(.+)$/ },           // président -> ex-président
    { pattern1: /^(.+)$/, pattern2: /^re(.+)$/ },           // faire -> refaire
    { pattern1: /^(.+)$/, pattern2: /^sur(.+)$/ },          // vol -> survol
    { pattern1: /^(.+)$/, pattern2: /^sous(.+)$/ },         // marin -> sous-marin
    { pattern1: /^(.+)$/, pattern2: /^trans(.+)$/ },        // atlantique -> transatlantique
    { pattern1: /^(.+)$/, pattern2: /^inter(.+)$/ },        // national -> international
    { pattern1: /^(.+)$/, pattern2: /^intra(.+)$/ },        // veineux -> intraveineux
    
    /* ===== TRANSFORMATIONS PAR SUFFIXATION ===== */
    // Caractéristique/Appartenance
    { pattern1: /^(.+)$/, pattern2: /^(.+)esque$/ },        // roman -> romanesque
    { pattern1: /^(.+)$/, pattern2: /^(.+)ais$/ },          // France -> français
    { pattern1: /^(.+)$/, pattern2: /^(.+)ois$/ },          // Chine -> chinois
    { pattern1: /^(.+)$/, pattern2: /^(.+)ien$/ },          // Paris -> parisien
    { pattern1: /^(.+)$/, pattern2: /^(.+)een$/ },          // Europe -> européen
    
    // Science/Doctrine
    { pattern1: /^(.+)$/, pattern2: /^(.+)isme$/ },         // commun -> communisme
    { pattern1: /^(.+)$/, pattern2: /^(.+)ologie$/ },       // bio -> biologie
    { pattern1: /^(.+)$/, pattern2: /^(.+)istique$/ },      // langue -> linguistique
    { pattern1: /^(.+)$/, pattern2: /^(.+)ite$/ },          // bronche -> bronchite
    
    // Métiers/Activités
    { pattern1: /^(.+)$/, pattern2: /^(.+)iste$/ },         // journal -> journaliste
    { pattern1: /^(.+)$/, pattern2: /^(.+)logue$/ },        // psycho -> psychologue
    { pattern1: /^(.+)$/, pattern2: /^(.+)graphe$/ },       // photo -> photographe
    { pattern1: /^(.+)$/, pattern2: /^(.+)cien$/ },         // musique -> musicien
    { pattern1: /^(.+)$/, pattern2: /^(.+)ien$/ },          // technique -> technicien
    { pattern1: /^(.+)$/, pattern2: /^(.+)ier$/ },          // bijou -> bijoutier
  ];

  /**
   * Liste exhaustive des préfixes courants en français
   */
  const commonPrefixes = [
    // Préfixes de négation/opposition
    'a', 'an', 'anti', 'contre', 'dé', 'dés', 'dis', 'in', 'im', 'ir', 'il', 'non',
    
    // Préfixes quantitatifs
    'bi', 'di', 'du', 'hemi', 'mono', 'multi', 'omni', 'pluri', 'poly', 'semi', 'tri', 'uni',
    
    // Préfixes de taille/intensité
    'archi', 'extra', 'hyper', 'hypo', 'infra', 'macro', 'maxi', 'mega', 'micro', 'mini', 'super', 'sur', 'ultra',
    
    // Préfixes temporels
    'ante', 'avant', 'pré', 'post', 'pro', 're', 'ré', 'rétro',
    
    // Préfixes spatiaux
    'circon', 'cis', 'co', 'col', 'com', 'con', 'endo', 'ex', 'exo', 'extra', 'inter', 'intra', 'intro', 'para', 
    'péri', 'sub', 'sous', 'sus', 'trans', 'télé',
    
    // Préfixes de relation
    'auto', 'allo', 'homo', 'hétéro', 'iso', 'néo', 'paléo', 'proto', 'pseudo', 'quasi', 'vice',
    
    // Préfixes numériques
    'cent', 'déca', 'déci', 'hémi', 'kilo', 'milli', 'tri', 'quadri', 'quint', 'uni', 'zéro',
    
    // Préfixes scientifiques
    'aéro', 'agro', 'anthropo', 'astro', 'auto', 'bio', 'cardio', 'chrono', 'cosmo', 'crypto', 'cyber', 
    'démo', 'éco', 'électro', 'géo', 'hydro', 'logo', 'méta', 'neuro', 'paléo', 'philo', 'photo', 
    'physio', 'psycho', 'socio', 'techno', 'thermo', 'zoo'
  ];

  /**
   * Liste enrichie des suffixes courants en français
   */
  const commonSuffixes = [
    // Suffixes verbaux
    'er', 'ir', 're', 'iser', 'ifier', 'oyer', 'eler',
    
    // Suffixes des formes verbales
    'ant', 'ent', 'é', 'i', 'u', 'ée', 'is', 'us', 'ions', 'iez', 'aient', 'eront',
    
    // Suffixes nominaux (personnes)
    'aire', 'ateur', 'atrice', 'eur', 'euse', 'er', 'ère', 'ien', 'ienne', 'ier', 'ière', 
    'iste', 'logue', 'ard', 'aud', 'cien', 'cienne', 'graphe', 'naute', 'nome', 'phile',
    
    // Suffixes nominaux (concepts/actions)
    'ade', 'age', 'ail', 'aison', 'ance', 'ation', 'ement', 'ence', 'ée', 'erie', 'esse', 
    'ette', 'eur', 'ie', 'ification', 'isation', 'isme', 'ité', 'itude', 'oir', 'oire', 
    'on', 'té', 'tion', 'ure',
    
    // Suffixes adjectivaux
    'able', 'al', 'ale', 'el', 'elle', 'esque', 'eux', 'euse', 'ien', 'ienne', 'ier', 'ière', 
    'if', 'ive', 'in', 'ine', 'ique', 'issant', 'issante', 'iste', 'oire', 'ois', 'oise',
    
    // Suffixes pour lieux
    'arium', 'drome', 'ère', 'erie', 'oir', 'oire', 'orium', 'thèque', 'toire',
    
    // Suffixes scientifiques/techniques
    'gramme', 'graphie', 'logie', 'logique', 'logue', 'mètre', 'métrie', 'nome', 'nomie', 
    'pathie', 'scope', 'thérapie', 'tomie', 'type',
    
    // Suffixes de diminutifs/augmentatifs
    'asse', 'âtre', 'eau', 'elle', 'et', 'ette', 'illon', 'in', 'ine', 'ot', 'otte', 'ole', 'ule'
  ];
  
  // Dictionnaire étendu de correspondances sémantiques en français (pour référence)
  const semanticMatches = {
    // Page d'accueil
    accueil: ['accueil', 'home', 'bienvenue', 'index', 'principale', 'welcome', 'decouvrir', 'decouverte', 'page principale'],
    
    // Page de contact
    contact: ['contact', 'contactez', 'nous contacter', 'formulaire', 'message', 'ecrire', 'ecrivez', 'coordonnees', 
              'adresse', 'telephone', 'tel', 'mail', 'email', 'courriel', 'joindre', 'appeler', 'appelez', 'demande', 'devis'],
    
    // Page à propos
    apropos: ['propos', 'presentation', 'equipe', 'entreprise', 'societe', 'histoire', 'valeurs', 
              'philosophie', 'sommes', 'qui', 'about', 'decouvrir'],
    
    // Page de services/matériel
    services: ['materiel', 'equipement', 'location', 'produit', 'service', 'prestation', 'propose', 
                'offre', 'gamme', 'catalogue', 'solution', 'article', 'dispo', 'table'],
    
    // Page de photos/galerie
    photos: ['photo', 'galerie', 'image', 'album', 'portfolio', 'realisation', 'apercu', 'visuel', 'voir', 'verre'],
    
    // Page de tentes/chapiteaux
    tentes: ['tente', 'chapiteau', 'chapiteaux', 'abri', 'toile', 'structure', 'reception', 'evenement'],
    
    // Page de vaisselle
    vaisselle: ['vaisselle', 'assiette', 'verre', 'couvert', 'porcelaine', 'couverts', 'ustensile', 'gobelet', 'table'],
    
    // Mentions légales, etc.
    mentions: ['mention', 'legale', 'condition', 'cgv', 'cgu', 'juridique', 'cookie', 'confidentialite', 'privacy'],
    
    // Vie privée
    vieprivee: ['vie', 'privee', 'privacy', 'donnee', 'personnel', 'confidentialite', 'rgpd', 'cookie']
  };
  
  /**
   * Normalise une chaîne de caractères en français de manière robuste
   */
  function normalizeText(text) {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")  // Enlever accents
      .replace(/[^\w\s\-]/g, " ")       // Remplacer caractères spéciaux par espaces, mais conserver les tirets
      .replace(/\s+/g, " ")             // Remplacer espaces multiples par un espace
      .trim();
  }
  
  /**
   * Extrait les mots individuels d'une chaîne avec gestion améliorée des tirets
   */
  function extractWords(text) {
    if (!text) return [];
    
    const normalizedText = normalizeText(text);
    
    // Extraire à la fois les mots entiers et les parties de mots séparées par des tirets
    const words = [];
    
    // Ajouter les mots complets
    const fullWords = normalizedText.split(/\s+/);
    words.push(...fullWords.filter(word => word.length > 2));
    
    // Ajouter les parties de mots séparées par des tirets
    fullWords.forEach(word => {
      if (word.includes('-')) {
        const parts = word.split('-').filter(part => part.length > 2);
        words.push(...parts);
      }
    });
    
    return [...new Set(words)]; // Éliminer les doublons
  }
  
  /**
   * Extrait le chemin et les segments de l'URL
   */
  function extractPathInfo(url) {
    try {
      // Supprimer l'hôte, les paramètres et les ancres
      let path = url.split('?')[0].split('#')[0];
      
      // Si l'URL contient un protocole et un domaine, les retirer
      if (path.includes('://')) {
        path = path.split('://')[1].split('/').slice(1).join('/');
      }
      
      // Si le chemin est vide, c'est la racine (homepage)
      if (path === '' || path === '/') {
        return {
          path: '/',
          lastSegment: '',
          segments: [],
          isHomePage: true
        };
      }
      
      // Nettoyer le chemin
      path = '/' + path.replace(/^\/+|\/+$/g, '');
      
      // Extraire tous les segments
      const segments = path.split('/').filter(Boolean);
      const lastSegment = segments.length > 0 ? segments[segments.length - 1] : '';
      
      // Vérifier si c'est potentiellement une page d'accueil
      const isHomePage = (lastSegment === '' || 
                        lastSegment === 'index.html' || 
                        lastSegment === 'index.php' || 
                        lastSegment === 'home' ||
                        path === '/');
      
      return {
        path,
        lastSegment,
        segments,
        isHomePage
      };
    } catch (e) {
      console.error('Erreur lors de l\'analyse de l\'URL:', url, e);
      return {
        path: url,
        lastSegment: url,
        segments: [url],
        isHomePage: false
      };
    }
  }
  
  /**
   * Calcule la distance de Levenshtein entre deux chaînes
   * (nombre minimal de caractères à modifier pour passer d'une chaîne à l'autre)
   */
  function levenshteinDistance(a, b) {
    if (!a || !b) return Math.max((a || '').length, (b || '').length);
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    
    const matrix = [];
    
    // Initialiser la matrice
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    // Remplir la matrice
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // suppression
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  }
  
  /**
   * Vérifie la cohérence sémantique entre deux textes en français
   * @param {string} linkText - Texte du lien
   * @param {string} urlSegment - Segment d'URL
   * @returns {Object} - Résultat de l'analyse avec le statut et la raison
   */
  function checkSemanticCoherence(linkText, urlSegment) {
    // Utiliser le cache si disponible
    const cacheKey = `${linkText}|${urlSegment}`;
    if (results.cache.semanticCheckCache[cacheKey]) {
      return results.cache.semanticCheckCache[cacheKey];
    }
    
    // Normaliser les textes
    const normalizedLinkText = normalizeText(linkText);
    const normalizedUrlSegment = normalizeText(urlSegment);
    
    // Extraire les mots significatifs (> 3 caractères)
    const linkWords = extractWords(normalizedLinkText);
    const urlWords = extractWords(normalizedUrlSegment);
    
    // 1. Vérifier les correspondances directes (mots exacts ou inclusions)
    for (const linkWord of linkWords) {
      for (const urlWord of urlWords) {
        // Correspondance exacte
        if (linkWord === urlWord && linkWord.length > 3) {
          const result = { 
            isCoherent: true, 
            reason: `Mot exact: "${linkWord}"`
          };
          results.cache.semanticCheckCache[cacheKey] = result;
          return result;
        }
        
        // Inclusion si les mots sont assez longs (un contient l'autre)
        if (linkWord.length > 4 && urlWord.length > 4) {
          if (linkWord.includes(urlWord) || urlWord.includes(linkWord)) {
            const result = { 
              isCoherent: true, 
              reason: `Mots apparentés: "${linkWord}" et "${urlWord}"`
            };
            results.cache.semanticCheckCache[cacheKey] = result;
            return result;
          }
        }
      }
    }
    
    // 2. Vérifier la racine des mots (stemming simplifié pour le français)
    const urlStems = urlWords.map(word => getWordStem(word));
    const linkStems = linkWords.map(word => getWordStem(word));
    
    for (const linkStem of linkStems) {
      if (urlStems.some(stem => stem === linkStem && stem.length > 3)) {
        const result = { 
          isCoherent: true, 
          reason: `Même racine de mot trouvée`
        };
        results.cache.semanticCheckCache[cacheKey] = result;
        return result;
      }
    }
    
    // 3. Vérifier les transformations courantes en français
    for (const linkWord of linkWords) {
      for (const urlWord of urlWords) {
        // Détection des variations verbe/nom
        if (areRelatedWordForms(linkWord, urlWord)) {
          const result = { 
            isCoherent: true, 
            reason: `Formes linguistiques liées: "${linkWord}" ↔ "${urlWord}"`
          };
          results.cache.semanticCheckCache[cacheKey] = result;
          return result;
        }
        
        // Vérifier les synonymes et concepts liés courants
        if (areConceptuallySimilar(linkWord, urlWord)) {
          const result = { 
            isCoherent: true, 
            reason: `Concepts liés: "${linkWord}" ↔ "${urlWord}"`
          };
          results.cache.semanticCheckCache[cacheKey] = result;
          return result;
        }
      }
    }
    
    // 4. Vérifier le contexte de la page (concomitance)
    if (checkCooccurrence(normalizedLinkText, normalizedUrlSegment)) {
      const result = { 
        isCoherent: true, 
        reason: `Association contextuelle dans la page`
      };
      results.cache.semanticCheckCache[cacheKey] = result;
      return result;
    }
    
    // 5. Vérifier la distance de Levenshtein pour les fautes de frappe potentielles
    for (const linkWord of linkWords) {
      for (const urlWord of urlWords) {
        // Uniquement pour les mots suffisamment longs
        if (linkWord.length > 4 && urlWord.length > 4) {
          const distance = levenshteinDistance(linkWord, urlWord);
          // Tolère plus d'erreurs pour les mots plus longs
          const maxDistance = Math.min(2, Math.floor(Math.max(linkWord.length, urlWord.length) / 4));
          
          if (distance <= maxDistance) {
            const result = { 
              isCoherent: true, 
              reason: `Similitude orthographique: "${linkWord}" ≈ "${urlWord}"`
            };
            results.cache.semanticCheckCache[cacheKey] = result;
            return result;
          }
        }
      }
    }
    
    // Pas de correspondance trouvée
    const result = { isCoherent: false, reason: "" };
    results.cache.semanticCheckCache[cacheKey] = result;
    return result;
  }
  
  /**
   * Extrait la racine d'un mot français (stemming simplifié)
   */
  function getWordStem(word) {
    // Utiliser le cache si disponible
    if (results.cache.wordStemCache[word]) {
      return results.cache.wordStemCache[word];
    }
    
    if (!word || word.length <= 4) {
      results.cache.wordStemCache[word] = word || '';
      return word || '';
    }
    
    // Supprimer les suffixes courants en français
    let stem = word;
    
    for (const suffix of commonSuffixes) {
      if (word.length > suffix.length + 3 && word.endsWith(suffix)) {
        stem = word.slice(0, word.length - suffix.length);
        break;
      }
    }
    
    results.cache.wordStemCache[word] = stem;
    return stem;
  }
  
  /**
   * Vérifie si deux mots sont des formes liées en français
   * (verbe/nom, singulier/pluriel, etc.)
   */
  function areRelatedWordForms(word1, word2) {
    if (!word1 || !word2) return false;
    
    // Simplifions les deux mots en supprimant les terminaisons courantes
    const simplified1 = word1.replace(/(?:er|ir|re|es|s|e|ent|ons)$/, '');
    const simplified2 = word2.replace(/(?:er|ir|re|es|s|e|ent|ons)$/, '');
    
    // Si les formes simplifiées sont identiques et suffisamment longues
    if (simplified1 === simplified2 && simplified1.length > 3) {
      return true;
    }
    
    // Vérifier les patterns de transformation linguistiques
    for (const { pattern1, pattern2 } of transformationPatterns) {
      // Direction 1: word1 -> word2
      const match1Word1 = word1.match(pattern1);
      const match1Word2 = word2.match(pattern2);
      
      if (match1Word1 && match1Word2 && match1Word1[1] && match1Word2[1]) {
        // Vérifier si les radicaux sont similaires
        const stem1 = match1Word1[1];
        const stem2 = match1Word2[1];
        
        if (levenshteinDistance(stem1, stem2) <= 1) {
          return true;
        }
      }
      
      // Direction 2: word2 -> word1
      const match2Word1 = word1.match(pattern2);
      const match2Word2 = word2.match(pattern1);
      
      if (match2Word1 && match2Word2 && match2Word1[1] && match2Word2[1]) {
        // Vérifier si les radicaux sont similaires
        const stem1 = match2Word1[1];
        const stem2 = match2Word2[1];
        
        if (levenshteinDistance(stem1, stem2) <= 1) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  /**
   * Vérifie si deux mots sont conceptuellement liés
   * (analyse linguistique et contextuelle)
   */
  function areConceptuallySimilar(word1, word2) {
    if (!word1 || !word2) return false;
    
    // Vérifier les variations sémantiques communes basées sur préfixes
    const hasSemanticVariation = checkSemanticVariation(word1, word2);
    if (hasSemanticVariation) return true;
    
    // Si les deux mots partagent un préfixe commun significatif
    const prefixLength = findCommonPrefixLength(word1, word2);
    const minWordLength = Math.min(word1.length, word2.length);
    
    // Si le préfixe commun est significatif (au moins 60% du mot le plus court et 4+ caractères)
    if (prefixLength >= 4 && prefixLength >= minWordLength * 0.6) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Trouve la longueur du préfixe commun entre deux chaînes
   */
  function findCommonPrefixLength(str1, str2) {
    if (!str1 || !str2) return 0;
    
    let i = 0;
    const minLength = Math.min(str1.length, str2.length);
    
    while (i < minLength && str1[i] === str2[i]) {
      i++;
    }
    
    return i;
  }
  
  /**
   * Vérifie si les deux mots sont des variations sémantiques communes
   * basées sur les préfixes et suffixes courants
   */
  function checkSemanticVariation(word1, word2) {
    if (!word1 || !word2) return false;
    
    // Vérifier si l'un des mots est l'autre avec un préfixe commun ajouté
    for (const prefix of commonPrefixes) {
      if ((word1.startsWith(prefix) && word1.substring(prefix.length) === word2) || 
          (word2.startsWith(prefix) && word2.substring(prefix.length) === word1)) {
        return true;
      }
      
      // Vérifier avec une petite tolérance pour l'orthographe
      if (word1.startsWith(prefix)) {
        const root1 = word1.substring(prefix.length);
        if (levenshteinDistance(root1, word2) <= 1) {
          return true;
        }
      }
      
      if (word2.startsWith(prefix)) {
        const root2 = word2.substring(prefix.length);
        if (levenshteinDistance(root2, word1) <= 1) {
          return true;
        }
      }
    }
    
    // Extraire les racines (parties sans suffixes)
    let stem1 = word1;
    let stem2 = word2;
    
    for (const suffix of commonSuffixes) {
      if (word1.endsWith(suffix)) {
        stem1 = word1.substring(0, word1.length - suffix.length);
      }
      if (word2.endsWith(suffix)) {
        stem2 = word2.substring(0, word2.length - suffix.length);
      }
    }
    
    // Si les racines sont similaires (après suppression des suffixes)
    if (stem1.length > 3 && stem2.length > 3 && levenshteinDistance(stem1, stem2) <= 1) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Vérifie si deux mots apparaissent souvent ensemble dans la page
   * (analyse de concomitance simplifiée)
   */
  function checkCooccurrence(word1, word2) {
    if (!word1 || !word2) return false;
    
    // Obtenir les données de concomitance (avec mise en cache)
    const cooccurrenceData = getCooccurrenceData();
    
    // Mots normalisés pour recherche
    const normalizedWord1 = normalizeText(word1);
    const normalizedWord2 = normalizeText(word2);
    
    // Extraire les mots individuels
    const words1 = extractWords(normalizedWord1);
    const words2 = extractWords(normalizedWord2);
    
    // Compteurs
    let cooccurrenceCount = 0;
    let word1Count = 0;
    let word2Count = 0;
    
    // Analyser chaque paragraphe
    for (const paragraph of cooccurrenceData.paragraphs) {
      // Vérifier si des mots de chaque groupe apparaissent dans le paragraphe
      const hasWord1 = words1.some(word => paragraph.includes(word));
      const hasWord2 = words2.some(word => paragraph.includes(word));
      
      if (hasWord1) word1Count++;
      if (hasWord2) word2Count++;
      
      // S'ils apparaissent ensemble dans le même paragraphe
      if (hasWord1 && hasWord2) {
        cooccurrenceCount++;
      }
    }
    
    // Calculer le score de concomitance (coefficient de Jaccard simplifié)
    // Nombre de paragraphes où les deux mots apparaissent / Nombre de paragraphes où au moins un mot apparaît
    const totalOccurrences = word1Count + word2Count - cooccurrenceCount;
    
    if (totalOccurrences > 0) {
      const cooccurrenceScore = cooccurrenceCount / totalOccurrences;
      
      // Si le score est suffisamment élevé, ils sont probablement liés
      return cooccurrenceScore > 0.25; // Seuil ajustable (0.25 = 25% de co-apparition)
    }
    
    return false;
  }
  
  /**
   * Récupère ou génère les données de concomitance de la page
   * (avec mise en cache pour éviter de recalculer)
   */
  function getCooccurrenceData() {
    // Si déjà calculé, retourner le cache
    if (results.cache.cooccurrenceData) {
      return results.cache.cooccurrenceData;
    }
    
    // Récupérer tout le texte visible de la page
    const pageText = getVisibleText();
    
    // Normaliser et découper en paragraphes
    const paragraphs = pageText
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/\n\s*\n|\r\n\s*\r\n|\r\s*\r/);
    
    // Paragraphes normalisés et filtrés (non vides)
    const normalizedParagraphs = paragraphs
      .map(p => normalizeText(p))
      .filter(p => p.length > 10);
    
    // Sauvegarder en cache
    results.cache.cooccurrenceData = {
      paragraphs: normalizedParagraphs,
      wordFrequency: calculateWordFrequency(normalizedParagraphs)
    };
    
    return results.cache.cooccurrenceData;
  }
  
  /**
   * Calcule la fréquence des mots dans un ensemble de paragraphes
   */
  function calculateWordFrequency(paragraphs) {
    const wordCounts = {};
    
    paragraphs.forEach(paragraph => {
      const words = extractWords(paragraph);
      
      words.forEach(word => {
        if (!wordCounts[word]) {
          wordCounts[word] = 1;
        } else {
          wordCounts[word]++;
        }
      });
    });
    
    return wordCounts;
  }
  
  /**
   * Récupère tout le texte visible de la page
   */
  function getVisibleText() {
    // Récupérer tous les éléments textuels
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, a, span, div');
    let text = '';
    
    // Extraire le texte de chaque élément
    elements.forEach(element => {
      // Ignorer les éléments cachés
      const style = window.getComputedStyle(element);
      if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
        // Ajouter le texte avec un séparateur
        text += element.textContent + '\n';
      }
    });
    
    return text;
  }
  
  /**
   * Détermine si un texte est un CTA générique
   */
  function isGenericCta(text) {
    if (!text) return false;
    
    const genericCtas = [
      'plus d\'infos', 'plus d\'info', 'plus d\'information', 'plus d\'informations',
      'en savoir plus', 'voir plus', 'lire plus', 'lire la suite',
      'contact', 'contactez-nous', 'nous contacter', 'contactez nous',
      'découvrir', 'decouvrir', 'explorer',
      'cliquez ici', 'click here', 'cliquer ici',
      'devis', 'gratuit', 'demander', 'demandez',
      'télécharger', 'telecharger', 'download',
      'commander', 'acheter', 'réserver', 'reserver',
      'consulter', 'voir', 'visiter'
    ];
    
    const normalizedText = normalizeText(text);
    
    return genericCtas.some(cta => normalizedText.includes(cta));
  }
  
  /**
   * Nettoie le texte ALT des images
   */
  function cleanAltText(text) {
    if (!text) return '';
    
    if (text.startsWith('ALT: "') && text.endsWith('"')) {
      return text.substring(6, text.length - 1);
    }
    return text;
  }
  
  /**
   * Détecte si une image est probablement un logo
   */
  function isProbablyLogo(node, text, href, isImageLink, isMenuLink) {
    if (!text) return false;
    
    // Si ce n'est pas une image ou un lien de menu, ce n'est probablement pas un logo
    if (!isImageLink && !isMenuLink) return false;
    
    // Normaliser le texte pour rechercher des indices
    const normalizedText = normalizeText(text);
    const altText = text.startsWith('ALT: "') ? cleanAltText(text) : text;
    
    // Vérifier si l'ALT ou le texte contient des indices de logo
    const logoKeywords = [
      'logo','entreprise', 'societe',
      'home', 'accueil'
    ];
    
    // Si le texte/alt est vide ou très court (< 3 caractères), cela peut aussi être un logo
    if (altText.length < 3 && isImageLink) return true;
    
    // Vérifier les mots clés dans le texte/alt
    for (const keyword of logoKeywords) {
      if (normalizedText.includes(keyword)) return true;
    }
    
    // Si c'est une image dans un menu et qui pointe vers l'accueil, c'est probablement un logo
    if (isImageLink && isMenuLink && 
        (href.split('?')[0].split('#')[0].endsWith('/') || 
         href.includes('index') || 
         href.includes('accueil') || 
         href.includes('home'))) {
      return true;
    }
    
    // Position dans la page (en haut et à gauche = probablement logo)
    if (isImageLink) {
      try {
        const imgElement = document.querySelector(`img[alt="${altText}"]`);
        if (imgElement) {
          const rect = imgElement.getBoundingClientRect();
          // Si l'image est dans le quart supérieur gauche de la page
          if (rect.top < window.innerHeight / 4 && rect.left < window.innerWidth / 4) {
            return true;
          }
        }
      } catch (e) {
        // Ignorer les erreurs de sélection d'élément
      }
    }
    
    return false;
  }
  
  /**
   * Vérifie si un texte contient des mots significatifs
   * @param {string} text - Texte à analyser
   * @returns {boolean} - Vrai si le texte contient des mots significatifs
   */
  function hasSignificantContent(text) {
    if (!text) return false;
    
    // Normaliser et extraire les mots
    const normalizedText = normalizeText(text);
    const words = extractWords(normalizedText);
    
    // Si le texte contient des mots significatifs (longueur > 3)
    return words.some(word => word.length > 3);
  }
  
  // Analyser chaque lien
  links.forEach(link => {
    results.totalChecked++;
    
    // Récupérer l'URL et le texte
    const href = link.href;
    let linkText = link.text;
    
    // Déterminer le type de lien
 
    const isMenuLink = document.querySelector(`a[href="${href}"]`).closest('.dmLinksMenu') || document.querySelector(`a[href="${href}"]`).closest('#menu');
    const isCta = href.includes('CTA detecté') || linkText.toUpperCase() === linkText;
    const isImageLink = linkText.startsWith('ALT:') || href.includes('CTA avec image');
    
    // Nettoyer le texte ALT des images
    if (linkText.startsWith('ALT:')) {
      linkText = cleanAltText(linkText);
    }
    
    // Vérifier si c'est probablement un logo
    const isLogo = isProbablyLogo(link, link.text, href, isImageLink, isMenuLink);
    
    // Mettre à jour les statistiques
    if (isLogo) results.metadata.logoLinks++;
    else if (isMenuLink) results.metadata.menuLinks++;
    else if (isCta) results.metadata.ctaLinks++;
    else if (isImageLink) results.metadata.imageLinks++;
    else results.metadata.otherLinks++;
    
    // Analyser l'URL
    const urlInfo = extractPathInfo(href);
    
    // Vérifier la cohérence
    let isCoherent = false;
    let matchReason = '';
    let matchType = '';
    let inconsistencyType = '';
    
    // CAS SPÉCIAL 0: Absence de contenu significatif dans le texte du lien
    // (accepte toujours les liens sans texte comme cohérents)
    if (!hasSignificantContent(linkText)) {
      isCoherent = true;
      matchReason = 'Lien sans texte significatif';
      matchType = 'defaultCoherent';
    }
    // CAS SPÉCIAL 1: Logo vers page d'accueil (priorité absolue)
    else if (!isCoherent && isLogo && urlInfo.isHomePage) {
      isCoherent = true;
      matchReason = 'Logo vers page d\'accueil';
      matchType = 'logoHome';
    }
    // CAS SPÉCIAL 2: Page d'accueil
    else if (!isCoherent && urlInfo.isHomePage && 
        (normalizeText(linkText).includes('accueil') || 
         normalizeText(linkText).includes('home'))) {
      isCoherent = true;
      matchReason = 'Texte "accueil/home" vers page d\'accueil';
      matchType = 'homeLink';
    }
    // CAS SPÉCIAL 3: Vérification directe de la correspondance entre texte et URL
    else if (!isCoherent) {
      // Normaliser le texte du lien et l'URL pour comparaison
      const normalizedLinkText = normalizeText(linkText);
      const normalizedUrl = normalizeText(urlInfo.path);
      
      // Vérifier si des mots du texte se retrouvent dans l'URL
      if (hasSignificantWordOverlap(linkText, urlInfo.path)) {
        isCoherent = true;
        matchReason = 'Correspondance directe texte/URL';
        matchType = 'directMatch';
        results.metadata.directMatches++;
      }
      // Sinon, faire une analyse sémantique pour chaque segment d'URL
      else {
        // Vérifier les correspondances sémantiques pour chaque segment
        for (const segment of urlInfo.segments) {
          const coherenceCheck = checkSemanticCoherence(linkText, segment);
          
          if (coherenceCheck.isCoherent) {
            isCoherent = true;
            matchReason = `Correspondance sémantique: ${coherenceCheck.reason}`;
            matchType = 'semanticMatch';
            results.metadata.semanticMatches++;
            break;
          }
        }
        
        // Vérifier spécifiquement pour les CTAs génériques
        if (!isCoherent && isCta && isGenericCta(linkText)) {
          isCoherent = true;
          matchReason = 'CTA générique accepté';
          matchType = 'genericCta';
        }
        
        // Vérifier spécifiquement pour les liens de menu
        if (!isCoherent && isMenuLink) {
          isCoherent = true;
          matchReason = 'Lien de menu (toujours accepté)';
          matchType = 'menuLink';
        }
      }
    }
    
    // Si toujours pas cohérent, identifier le type d'incohérence
    if (!isCoherent) {
      if (isCta) {
        inconsistencyType = 'CTA non pertinent';
        results.metadata.ctaGenericToSpecific++;
      } else if (isImageLink) {
        inconsistencyType = 'Image vers page non reliée';
        results.metadata.imageToUnrelatedPage++;
      } else if (urlInfo.path.includes('mentions') || urlInfo.path.includes('privacy') || urlInfo.path.includes('vie')) {
        inconsistencyType = 'Incohérence dans liens de pied de page';
        results.metadata.footerLinksIssues++;
      } else {
        inconsistencyType = 'Incohérence majeure';
        results.metadata.majorInconsistencies++;
      }
    }
    
    // Enregistrer le résultat
    const result = {
      text: linkText,
      href: href,
      path: urlInfo.path,
      lastSegment: urlInfo.lastSegment,
      isHomePage: urlInfo.isHomePage,
      isMenuLink: isMenuLink,
      isCta: isCta,
      isImageLink: isImageLink,
      isLogo: isLogo,
      matchReason: matchReason,
      matchType: matchType,
      inconsistencyType: inconsistencyType
    };
    
    if (isCoherent) {
      results.coherent.push(result);
    } else {
      results.incoherent.push(result);
    }
  });
  
  // Trier les résultats par type
  results.coherent.sort((a, b) => {
    // Priorité aux logos, puis menus, puis CTAs
    if (a.isLogo !== b.isLogo) return b.isLogo ? 1 : -1;
    if (a.isMenuLink !== b.isMenuLink) return b.isMenuLink ? 1 : -1;
    if (a.isCta !== b.isCta) return b.isCta ? 1 : -1;
    // Ensuite par chemin d'URL
    return a.path.localeCompare(b.path);
  });
  
  results.incoherent.sort((a, b) => {
    // Priorité aux incohérences majeures
    if (a.inconsistencyType !== b.inconsistencyType) {
      if (a.inconsistencyType === 'Incohérence majeure') return -1;
      if (b.inconsistencyType === 'Incohérence majeure') return 1;
    }
    // Ensuite par chemin d'URL
    return a.path.localeCompare(b.path);
  });
  
  // Calculer le score de qualité global
  const consistencyScore = results.coherent.length / results.totalChecked;
  results.score = Math.round(consistencyScore * 100);
  
  // Déterminer le niveau de qualité
  if (results.score >= 90) {
    results.quality = 'excellent';
  } else if (results.score >= 75) {
    results.quality = 'good';
  } else if (results.score >= 60) {
    results.quality = 'fair';
  } else {
    results.quality = 'poor';
  }
  
  // Afficher un résumé dans la console
  console.timeEnd('Analyse complète');
  console.log(`✅ Analyse terminée: ${results.totalChecked} liens analysés`);
  console.log(`   ✓ ${results.coherent.length} liens cohérents (${results.score}%)`);
  console.log(`   ✗ ${results.incoherent.length} liens potentiellement incohérents`);
  console.log('📊 Détails:');
  console.log(`   ► ${results.metadata.logoLinks} liens avec logo`);
  console.log(`   ► ${results.metadata.menuLinks} liens de menu`);
  console.log(`   ► ${results.metadata.ctaLinks} boutons CTA`);
  console.log(`   ► ${results.metadata.imageLinks} liens avec images`);
  console.log(`   ► ${results.metadata.otherLinks} autres liens`);
  
  if (results.metadata.majorInconsistencies > 0) {
    console.warn(`⚠️ ${results.metadata.majorInconsistencies} incohérences majeures détectées!`);
  }
  
  return results;
}

/**
 * Vérifie si deux textes partagent des mots significatifs
 * Fonction auxiliaire avec comparaison robuste
 */
function hasSignificantWordOverlap(text1, text2) {
  if (!text1 || !text2) return false;
  
  // Normaliser les textes
  const normalizedText1 = text1.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s\-]/g, " ")
    .trim();
  
  const normalizedText2 = text2.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s\-]/g, " ")
    .trim();
  
  // Extraire les mots
  const words1 = normalizedText1.split(/\s+/).filter(word => word.length > 2);
  const words2 = normalizedText2.split(/\s+/).filter(word => word.length > 2);
  
  // Si l'un des textes est vide après filtrage, pas de correspondance
  if (words1.length === 0 || words2.length === 0) return false;
  
  // Vérifier les correspondances exactes
  for (const word1 of words1) {
    for (const word2 of words2) {
      // Correspondance exacte
      if (word1 === word2 && word1.length > 3) return true;
      
      // Une chaîne contient l'autre
      if (word1.length > 4 && word2.length > 4) {
        if (word1.includes(word2) || word2.includes(word1)) return true;
      }
    }
  }
  
  return false;
}

/**
 * Affiche les résultats de l'analyse dans un rapport visuel amélioré
 */
function displayLinkRelevanceReport() {
  const results = checkLinkTextRelevance();
  
  // Créer un rapport visuel sur la page
  const reportDiv = document.createElement('div');
  reportDiv.id = 'link-relevance-report';
  reportDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #fff; border: 2px solid #333; ' +
                           'padding: 0; z-index: 9999; max-width: 600px; max-height: 85vh; overflow: hidden; ' +
                           'box-shadow: 0 0 20px rgba(0,0,0,0.3); border-radius: 8px; font-family: Arial, sans-serif;';
  
  // Créer la structure du rapport
  reportDiv.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; background: #333; color: white; padding: 10px 15px;">
      <h3 style="margin: 0; font-size: 16px;">🔍 Analyse de cohérence des liens</h3>
      <button id="close-report-btn" style="background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0;">✕</button>
    </div>
    
    <div style="padding: 15px;">
      <!-- Score global -->
      <div style="text-align: center; margin-bottom: 15px;">
        <div style="position: relative; width: 100px; height: 100px; margin: 0 auto;">
          <canvas id="score-chart" width="100" height="100"></canvas>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; font-weight: bold;">${results.score}%</div>
        </div>
        <div style="margin-top: 5px; font-size: 14px; color: ${getQualityColor(results.quality)}; font-weight: bold; text-transform: uppercase;">${getQualityLabel(results.quality)}</div>
      </div>
      
      <!-- Statistiques principales -->
      <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
        <div style="flex: 1; min-width: 100px; background: #f5f5f5; padding: 10px; border-radius: 4px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold;">${results.totalChecked}</div>
          <div style="font-size: 12px; color: #666;">Total</div>
        </div>
        <div style="flex: 1; min-width: 100px; background: #e8f5e9; padding: 10px; border-radius: 4px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #4caf50;">${results.coherent.length}</div>
          <div style="font-size: 12px; color: #2e7d32;">Cohérents</div>
        </div>
        <div style="flex: 1; min-width: 100px; background: #ffebee; padding: 10px; border-radius: 4px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #f44336;">${results.incoherent.length}</div>
          <div style="font-size: 12px; color: #c62828;">Incohérents</div>
        </div>
      </div>
      
      <!-- Types de liens -->
      <div style="margin-bottom: 15px;">
        <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #333;">Types de liens</h4>
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 12px; height: 12px; background: #4caf50; border-radius: 50%; margin-right: 5px;"></span>
              <span style="font-size: 12px;">Logos</span>
            </div>
            <span style="font-size: 12px; font-weight: bold;">${results.metadata.logoLinks}</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 12px; height: 12px; background: #2196f3; border-radius: 50%; margin-right: 5px;"></span>
              <span style="font-size: 12px;">Menu</span>
            </div>
            <span style="font-size: 12px; font-weight: bold;">${results.metadata.menuLinks}</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 12px; height: 12px; background: #ff9800; border-radius: 50%; margin-right: 5px;"></span>
              <span style="font-size: 12px;">CTA</span>
            </div>
            <span style="font-size: 12px; font-weight: bold;">${results.metadata.ctaLinks}</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 12px; height: 12px; background: #9c27b0; border-radius: 50%; margin-right: 5px;"></span>
              <span style="font-size: 12px;">Images</span>
            </div>
            <span style="font-size: 12px; font-weight: bold;">${results.metadata.imageLinks}</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 12px; height: 12px; background: #607d8b; border-radius: 50%; margin-right: 5px;"></span>
              <span style="font-size: 12px;">Autres</span>
            </div>
            <span style="font-size: 12px; font-weight: bold;">${results.metadata.otherLinks}</span>
          </div>
        </div>
      </div>
      
      <!-- Filtres -->
      <div style="display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap;">
        <button id="all-links-btn" class="filter-btn" style="background: #2196f3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 13px;">Tous</button>
        <button id="incoherent-links-btn" class="filter-btn" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 13px;">⚠️ Incohérents (${results.incoherent.length})</button>
        <button id="logo-links-btn" class="filter-btn" style="background: #4caf50; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 13px;">🏢 Logos (${results.metadata.logoLinks})</button>
        <button id="cta-links-btn" class="filter-btn" style="background: #ff9800; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 13px;">🔘 CTA (${results.metadata.ctaLinks})</button>
        <button id="image-links-btn" class="filter-btn" style="background: #9c27b0; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 13px;">🖼️ Images (${results.metadata.imageLinks})</button>
        <button id="export-csv-btn" class="filter-btn" style="background: #607d8b; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 13px;">📊 Exporter CSV</button>
      </div>
      
      <!-- Liste des résultats -->
      <div id="results-container" style="max-height: 210px; overflow-y: auto; padding-right: 5px;"></div>
    </div>
  `;
  
  document.body.appendChild(reportDiv);
  
  // Dessiner le graphique de score
  drawScoreChart(results.score);
  
  // Ajouter les gestionnaires d'événements
  document.getElementById('close-report-btn').addEventListener('click', () => reportDiv.remove());
  document.getElementById('all-links-btn').addEventListener('click', () => renderLinks([...results.coherent, ...results.incoherent]));
  document.getElementById('incoherent-links-btn').addEventListener('click', () => renderLinks(results.incoherent, 'incoherent'));
  document.getElementById('logo-links-btn').addEventListener('click', () => renderLinks([...results.coherent, ...results.incoherent].filter(link => link.isLogo)));
  document.getElementById('cta-links-btn').addEventListener('click', () => renderLinks([...results.coherent, ...results.incoherent].filter(link => link.isCta)));
  document.getElementById('image-links-btn').addEventListener('click', () => renderLinks([...results.coherent, ...results.incoherent].filter(link => link.isImageLink && !link.isLogo)));
  document.getElementById('export-csv-btn').addEventListener('click', () => exportLinkRelevanceResultsCSV(results));
  
  // Rendre les boutons mutuellement exclusifs avec état actif
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.style.opacity = '0.7');
      btn.style.opacity = '1';
    });
  });
  
  // Fonction pour obtenir la couleur selon la qualité
  function getQualityColor(quality) {
    switch (quality) {
      case 'excellent': return '#4caf50';
      case 'good': return '#8bc34a';
      case 'fair': return '#ffc107';
      case 'poor': return '#f44336';
      default: return '#607d8b';
    }
  }
  
  // Fonction pour obtenir le libellé selon la qualité
  function getQualityLabel(quality) {
    switch (quality) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Bien';
      case 'fair': return 'Moyen';
      case 'poor': return 'À améliorer';
      default: return 'Non évalué';
    }
  }
  
  // Fonction pour dessiner le graphique circulaire du score
  function drawScoreChart(score) {
    const canvas = document.getElementById('score-chart');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 40;
    
    // Dessiner le cercle de fond
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#f5f5f5';
    ctx.fill();
    
    // Dessiner le cercle de score
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * score / 100));
    ctx.lineTo(centerX, centerY);
    
    // Couleur selon le score
    let color;
    if (score >= 90) color = '#4caf50';
    else if (score >= 75) color = '#8bc34a';
    else if (score >= 60) color = '#ffc107';
    else color = '#f44336';
    
    ctx.fillStyle = color;
    ctx.fill();
    
    // Dessiner le cercle blanc au centre
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.7, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
  
  // Fonction pour rendre les liens filtrés
  function renderLinks(links, filter = null) {
    const container = document.getElementById('results-container');
    container.innerHTML = '';
    
    if (links.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Aucun lien trouvé</p>';
      return;
    }
    
    // Grouper par type d'incohérence si on affiche les incohérents
    if (filter === 'incoherent' && links.length > 0) {
      const groups = {
        'Incohérence majeure': [],
        'CTA non pertinent': [],
        'Image vers page non reliée': [],
        'Incohérence dans liens de pied de page': []
      };
      
      links.forEach(link => {
        if (groups[link.inconsistencyType]) {
          groups[link.inconsistencyType].push(link);
        } else {
          groups['Incohérence majeure'].push(link);
        }
      });
      
      // Afficher chaque groupe
      for (const [groupName, groupLinks] of Object.entries(groups)) {
        if (groupLinks.length > 0) {
          const groupTitle = document.createElement('h4');
          groupTitle.textContent = `${groupName} (${groupLinks.length})`;
          groupTitle.style.cssText = 'margin: 15px 0 5px 0; padding-bottom: 5px; border-bottom: 1px solid #eee; font-size: 14px;';
          container.appendChild(groupTitle);
          
          renderLinkList(groupLinks);
        }
      }
    } else {
      // Affichage normal
      renderLinkList(links);
    }
  }
  
  // Fonction pour rendre une liste de liens
  function renderLinkList(links) {
    const container = document.getElementById('results-container');
    const list = document.createElement('ul');
    list.style.cssText = 'list-style: none; padding: 0; margin: 0;';
    
    links.forEach(link => {
      const item = document.createElement('li');
      
      // Déterminer le style de l'élément selon sa cohérence
      const isCoherent = results.coherent.includes(link);
      const borderColor = isCoherent ? '#4caf50' : '#f44336';
      const bgColor = isCoherent ? '#f5f5f5' : '#ffebee';
      
      item.style.cssText = `
        padding: 10px; 
        margin-bottom: 10px; 
        background: ${bgColor}; 
        border-radius: 4px; 
        border-left: 4px solid ${borderColor};
        position: relative;
      `;
      
      // Informations de base (texte et URL)
      const basic = document.createElement('div');
      basic.style.marginBottom = '5px';
      basic.innerHTML = `<strong>${link.text}</strong> → <span style="color: #0277bd;">${link.path}</span>`;
      
      // URL complète (togglable)
      const urlDetails = document.createElement('div');
      urlDetails.style.cssText = 'font-size: 12px; word-break: break-all; margin-top: 3px; color: #666; display: none;';
      urlDetails.innerHTML = link.href;
      
      // Bouton pour voir l'URL complète
      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = '🔍';
      toggleBtn.title = 'Voir l\'URL complète';
      toggleBtn.style.cssText = 'background: none; border: none; font-size: 11px; color: #2196f3; cursor: pointer; padding: 0; margin-left: 5px;';
      toggleBtn.onclick = () => {
        urlDetails.style.display = urlDetails.style.display === 'none' ? 'block' : 'none';
      };
      
      basic.appendChild(toggleBtn);
      
      // Badge "Survoler"
      if (link.element) {
        const highlightBtn = document.createElement('button');
        highlightBtn.textContent = '👁️';
        highlightBtn.title = 'Mettre en évidence ce lien sur la page';
        highlightBtn.style.cssText = 'background: none; border: none; font-size: 11px; color: #9c27b0; cursor: pointer; padding: 0; margin-left: 5px;';
        highlightBtn.onclick = () => {
          // Restaurer les styles précédents
          if (window.highlightedElement) {
            window.highlightedElement.style.outline = window.highlightedElementOriginalOutline;
            window.highlightedElement.style.backgroundColor = window.highlightedElementOriginalBg;
          }
          
          // Sauvegarder les styles originaux
          window.highlightedElement = link.element;
          window.highlightedElementOriginalOutline = link.element.style.outline;
          window.highlightedElementOriginalBg = link.element.style.backgroundColor;
          
          // Mettre en évidence l'élément
          link.element.style.outline = '3px solid #f50057';
          link.element.style.backgroundColor = 'rgba(245, 0, 87, 0.1)';
          
          // Défiler jusqu'à l'élément
          link.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Restaurer après 3 secondes
          setTimeout(() => {
            if (window.highlightedElement) {
              window.highlightedElement.style.outline = window.highlightedElementOriginalOutline;
              window.highlightedElement.style.backgroundColor = window.highlightedElementOriginalBg;
            }
          }, 3000);
        };
        
        basic.appendChild(highlightBtn);
      }
      
      // Badges
      const badges = document.createElement('div');
      badges.style.cssText = 'display: flex; gap: 5px; flex-wrap: wrap; margin: 5px 0;';
      
      if (link.isLogo) {
        const badge = document.createElement('span');
        badge.textContent = 'Logo';
        badge.style.cssText = 'font-size: 11px; background: #4caf50; color: white; padding: 2px 6px; border-radius: 20px;';
        badges.appendChild(badge);
      }
      
      if (link.isHomePage) {
        const badge = document.createElement('span');
        badge.textContent = 'Accueil';
        badge.style.cssText = 'font-size: 11px; background: #2196f3; color: white; padding: 2px 6px; border-radius: 20px;';
        badges.appendChild(badge);
      }
      
      if (link.isMenuLink) {
        const badge = document.createElement('span');
        badge.textContent = 'Menu';
        badge.style.cssText = 'font-size: 11px; background: #03a9f4; color: white; padding: 2px 6px; border-radius: 20px;';
        badges.appendChild(badge);
      }
      
      if (link.isCta) {
        const badge = document.createElement('span');
        badge.textContent = 'CTA';
        badge.style.cssText = 'font-size: 11px; background: #ff9800; color: white; padding: 2px 6px; border-radius: 20px;';
        badges.appendChild(badge);
      }
      
      if (link.isImageLink && !link.isLogo) {
        const badge = document.createElement('span');
        badge.textContent = 'Image';
        badge.style.cssText = 'font-size: 11px; background: #9c27b0; color: white; padding: 2px 6px; border-radius: 20px;';
        badges.appendChild(badge);
      }
      
      // Raison de cohérence ou incohérence
      const reason = document.createElement('div');
      reason.style.cssText = 'font-size: 12px; color: ' + (isCoherent ? '#4caf50' : '#f44336') + ';';
      reason.textContent = isCoherent ? 
                          (link.matchReason || 'Cohérent') : 
                          (link.inconsistencyType || 'Incohérence détectée');
      
      // Assembler l'élément
      item.appendChild(basic);
      item.appendChild(urlDetails);
      if (badges.childNodes.length > 0) {
        item.appendChild(badges);
      }
      item.appendChild(reason);
      list.appendChild(item);
    });
    
    container.appendChild(list);
  }
  
  // Afficher les liens incohérents par défaut
  document.getElementById('incoherent-links-btn').click();
  
  // Rendre disponible globalement
  window.linkRelevanceResults = results;
  
  return results;
}

/**
 * Exportation des résultats au format CSV
 */
function exportLinkRelevanceResultsCSV(results) {
  if (!results && !window.linkRelevanceResults) {
    console.error('Exécutez d\'abord l\'analyse de cohérence des liens');
    return;
  }
  
  const data = results || window.linkRelevanceResults;
  const allLinks = [...data.coherent, ...data.incoherent];
  
  // Créer l'en-tête CSV
  let csv = 'Texte du lien,URL,Cohérent,Type,Raison\n';
  
  // Ajouter chaque lien
  allLinks.forEach(link => {
    // Échapper les virgules et les guillemets dans les champs
    const text = `"${(link.text || '').replace(/"/g, '""')}"`;
    const href = `"${(link.href || '').replace(/"/g, '""')}"`;
    const isCoherent = data.coherent.includes(link) ? 'Oui' : 'Non';
    
    let type = [];
    if (link.isLogo) type.push('Logo');
    if (link.isHomePage) type.push('Accueil');
    if (link.isMenuLink) type.push('Menu');
    if (link.isCta) type.push('CTA');
    if (link.isImageLink && !link.isLogo) type.push('Image');
    if (type.length === 0) type.push('Standard');
    
    const reason = data.coherent.includes(link) ? 
                  `"${(link.matchReason || 'Cohérent').replace(/"/g, '""')}"` : 
                  `"${(link.inconsistencyType || 'Incohérence').replace(/"/g, '""')}"`;
    
    csv += `${text},${href},${isCoherent},"${type.join(', ')}",${reason}\n`;
  });
  
  // Créer et télécharger le fichier CSV
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'coherence_liens_' + new Date().toISOString().slice(0, 10) + '.csv');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Ajoute la vérification de cohérence de liens à votre liste d'outils existante
 */
function addLinkRelevanceToToolbox() {
  // S'intégrer à la barre d'outils existante si présente
  const toolbar = document.querySelector('#seo-tools-toolbar') || document.querySelector('#tools-toolbar');
  
  if (toolbar) {
    const button = document.createElement('button');
    button.textContent = '🔍 Cohérence Liens';
    button.style.cssText = 'background: #2196f3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin: 0 5px;';
    button.onclick = displayLinkRelevanceReport;
    toolbar.appendChild(button);
  } else {
    // Créer un bouton flottant si aucune barre d'outils n'est trouvée
    const floatingBtn = document.createElement('button');
    floatingBtn.textContent = '🔍 Cohérence Liens';
    floatingBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #2196f3; color: white; ' +
                              'border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; z-index: 9998; ' +
                              'box-shadow: 0 2px 5px rgba(0,0,0,0.2); font-size: 14px; font-family: Arial, sans-serif;';
    floatingBtn.onclick = displayLinkRelevanceReport;
    document.body.appendChild(floatingBtn);
  }
  
  // Ajouter à la console
  console.log('✅ Outil de vérification de cohérence des liens chargé');
  console.log('📌 Utilisez displayLinkRelevanceReport() pour lancer l\'analyse');
}

// Exécuter automatiquement si window.analyzedLinks existe déjà
if (window.analyzedLinks && window.analyzedLinks.length > 0) {
  console.log('🔄 Liens déjà analysés détectés, ajout de l\'outil de vérification de cohérence...');
  addLinkRelevanceToToolbox();
} else {
  // Sinon, rendre les fonctions disponibles sans exécution automatique
  console.log('🔧 Outil de vérification de cohérence des liens chargé');
  console.log('📌 Utilisez displayLinkRelevanceReport() pour lancer l\'analyse');
  
  // Pour faciliter les tests, on peut ajouter directement le bouton
  addLinkRelevanceToToolbox();
}

// Exécution immédiate pour les tests
displayLinkRelevanceReport();
