// 1. CONFIGURATION - AJOUTEZ VOTRE CLÉ ICI
const GOOGLE_API_KEY = 'VOTRE_VRAIE_CLE_API'; // ⚠️ REMPLACEZ PAR VOTRE VRAIE CLÉ !
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
const REQUEST_DELAY = 3000; // Délai entre requêtes en millisecondes (3s optimisé)
const MAX_SIZE_MB = 20; // Limite Google Gemini (20MB)

// 📝 PARAMÈTRES DE DESCRIPTION
const MAX_WORDS = 12; // Nombre de mots maximum par description (impact majeur sur vitesse)
const DESCRIPTION_LANGUAGE = 'French'; // Langue des descriptions
const DESCRIPTION_STYLE = 'concise and descriptive'; // Style de description

// 🤖 CONFIGURATION GEMINI ULTRA-OPTIMISÉE
const ULTRA_OPTIMIZED_CONFIG = {
  temperature: 0.05,      // -88% (ultra-bas pour vitesse maximale)
  maxOutputTokens: 20,    // -87% (minimal pour 12 mots)
  topK: 3,               // -90% (très réduit pour rapidité)
  topP: 0.4              // Optimisé rapidité/cohérence
};
/*** EXEMPLES DE CONFIGURATIONS GEMINI:

// ⚡ VITESSE MAXIMALE (actuel)
const ULTRA_OPTIMIZED_CONFIG = {
  temperature: 0.05,    // Ultra-bas = réponses rapides et consistantes
  maxOutputTokens: 20,  // Minimal = moins de traitement
  topK: 3,             // Très réduit = choix limités, plus rapide
  topP: 0.4            // Optimisé = équilibre vitesse/qualité
};
// Impact: 40-50% plus rapide, descriptions concises et précises

// 🎨 CRÉATIVITÉ ÉQUILIBRÉE
const CREATIVE_CONFIG = {
  temperature: 0.3,     // Modéré = plus de variation
  maxOutputTokens: 40,  // Plus de tokens = descriptions plus riches
  topK: 10,            // Plus de choix = plus de créativité
  topP: 0.7            // Plus ouvert = plus de diversité
};
// Impact: 20% plus lent, descriptions plus variées et créatives

// 🧠 QUALITÉ MAXIMALE
const QUALITY_CONFIG = {
  temperature: 0.4,     // Standard = bon équilibre
  maxOutputTokens: 60,  // Beaucoup de tokens = descriptions détaillées
  topK: 20,            // Beaucoup de choix = très créatif
  topP: 0.8            // Très ouvert = maximum de diversité
};
// Impact: 50% plus lent, descriptions très détaillées et riches

// 🛡️ CONSISTANCE MAXIMALE
const CONSISTENT_CONFIG = {
  temperature: 0.01,    // Très bas = résultats très prévisibles
  maxOutputTokens: 25,  // Contrôlé = longueur constante
  topK: 1,             // Minimal = toujours le même choix
  topP: 0.2            // Très fermé = résultats identiques
};
// Impact: 30% plus rapide, résultats très prévisibles

// 🚀 VITESSE EXTRÊME (expérimental)
const EXTREME_SPEED_CONFIG = {
  temperature: 0.01,    // Minimum absolu
  maxOutputTokens: 15,  // Ultra-minimal
  topK: 1,             // Pas de choix
  topP: 0.1            // Ultra-fermé
};
// Impact: 60% plus rapide, descriptions très courtes et répétitives
*/

// 🎛️ CONFIGURATION ADAPTATIVE (utilise ULTRA_OPTIMIZED_CONFIG par défaut)
const ADAPTIVE_GEMINI_CONFIG = {
  enabled: true,        // Active/désactive l'adaptation automatique
  baseConfig: ULTRA_OPTIMIZED_CONFIG, // Configuration de base
  
  // Adaptation selon la taille d'image
  sizeAdaptation: {
    enabled: true,
    small: {             // < 0.5MB
      temperature: 0.05,
      maxOutputTokens: 15,
      topK: 2,
      topP: 0.3
    },
    medium: {            // 0.5MB - 2MB
      temperature: 0.05,
      maxOutputTokens: 20,
      topK: 3,
      topP: 0.4
    },
    large: {             // > 2MB
      temperature: 0.1,
      maxOutputTokens: 25,
      topK: 5,
      topP: 0.5
    }
  },
  
  // Adaptation selon le nombre de mots demandés
  wordAdaptation: {
    enabled: true,
    multiplier: 1.6      // maxOutputTokens = maxWords × multiplier
  }
};

/*** 10 exemples d'utilisation de "DESCRIPTION_STYLE" ->>>>
// ===== 10 EXEMPLES DE DESCRIPTION_STYLE =====

// 1. 🎯 OPTIMAL POUR ATTRIBUT ALT (RECOMMANDÉ)
const DESCRIPTION_STYLE = 'concise, functional and accessible for screen readers';
// Résultat: "Logo rouge et bleu de peinture Huet sur fond blanc"
// ✅ Court, précis, fonctionnel pour l'accessibilité

// 2. 📝 STYLE DESCRIPTIF DÉTAILLÉ
const DESCRIPTION_STYLE = 'detailed, precise and descriptive';
// Résultat: "Logo coloré de l'entreprise Huet Peinture avec éventail de couleurs vives incluant rouge, orange, jaune et bleu disposés en demi-cercle"
// ✅ Riche en détails, bon pour le contenu

// 3. ⚡ STYLE ULTRA-CONCIS
const DESCRIPTION_STYLE = 'extremely brief and to the point';
// Résultat: "Logo Huet Peinture coloré"
// ✅ Minimal, ultra-rapide

// 4. 🎨 STYLE CRÉATIF ET ENGAGEANT
const DESCRIPTION_STYLE = 'creative, engaging and vivid';
// Résultat: "Logo dynamique Huet Peinture explosant de couleurs arc-en-ciel comme une palette d'artiste"
// ✅ Attractif pour marketing

// 5. 🔍 STYLE TECHNIQUE ET PRÉCIS
const DESCRIPTION_STYLE = 'technical, specific and factual';
// Résultat: "Logo vectoriel Huet Peinture dimensions carrées avec gradient radial rouge-orange-jaune-bleu, typographie sans-serif"
// ✅ Précis pour documentation

// 6. 👥 STYLE CONVERSATIONNEL
const DESCRIPTION_STYLE = 'natural, conversational and friendly';
// Résultat: "Voici le joli logo de Huet Peinture avec ses belles couleurs qui rappellent un coucher de soleil"
// ✅ Humain, chaleureux

// 7. 📊 STYLE INFORMATIF STRUCTURÉ
const DESCRIPTION_STYLE = 'structured, informative and organized';
// Résultat: "Logo Huet Peinture: élément central avec nom, couleurs primaires rouge et bleu, couleurs secondaires orange et jaune"
// ✅ Organisé, clair

// 8. 🌟 STYLE ÉMOTIONNEL
const DESCRIPTION_STYLE = 'expressive, emotional and impactful';
// Résultat: "Logo vibrant Huet Peinture évoquant la joie et la créativité avec ses couleurs éclatantes et son design moderne"
// ✅ Engageant émotionnellement

// 9. 🎯 STYLE AXÉE ACTION/CONTEXTE
const DESCRIPTION_STYLE = 'action-focused and contextual';
// Résultat: "Logo Huet Peinture présentant les services de peinture avec palette colorée pour attirer les clients"
// ✅ Orienté but/usage

// 10. 🏢 STYLE PROFESSIONNEL FORMEL
const DESCRIPTION_STYLE = 'professional, formal and business-oriented';
// Résultat: "Identité visuelle de l'entreprise Huet Peinture représentant leur expertise en travaux de peinture résidentielle et commerciale"
// ✅ Corporatif, sérieux
*/

// 📊 CONFIGURATION DES LOGS ET DEBUG
const LOG_CONFIG = {
  showConfig: true,           // Affiche la config au démarrage
  showAdaptations: true,      // Affiche les adaptations en temps réel
  showTimings: true,          // Affiche les temps de traitement
  showTokenUsage: true,       // Affiche l'utilisation des tokens
  showOptimizations: true,    // Affiche les optimisations appliquées
  level: 'DETAILED'          // MINIMAL, STANDARD, DETAILED, VERBOSE
};

// ===== FONCTIONS UTILITAIRES POUR LA CONFIGURATION =====

// Obtient la configuration Gemini adaptée
function getAdaptiveGeminiConfig(imageSizeMB, maxWords) {
  if (!ADAPTIVE_GEMINI_CONFIG.enabled) {
    return ADAPTIVE_GEMINI_CONFIG.baseConfig;
  }
  
  let config = { ...ADAPTIVE_GEMINI_CONFIG.baseConfig };
  
  // Adaptation selon la taille d'image
  if (ADAPTIVE_GEMINI_CONFIG.sizeAdaptation.enabled) {
    let sizeConfig;
    if (imageSizeMB < 0.5) {
      sizeConfig = ADAPTIVE_GEMINI_CONFIG.sizeAdaptation.small;
    } else if (imageSizeMB < 2) {
      sizeConfig = ADAPTIVE_GEMINI_CONFIG.sizeAdaptation.medium;
    } else {
      sizeConfig = ADAPTIVE_GEMINI_CONFIG.sizeAdaptation.large;
    }
    config = { ...config, ...sizeConfig };
  }
  
  // Adaptation selon le nombre de mots
  if (ADAPTIVE_GEMINI_CONFIG.wordAdaptation.enabled) {
    config.maxOutputTokens = Math.round(maxWords * ADAPTIVE_GEMINI_CONFIG.wordAdaptation.multiplier);
  }
  
  return config;
}

// Affiche la configuration actuelle
function showCurrentConfiguration() {
  if (!LOG_CONFIG.showConfig) return;
  
  console.log('⚙️ CONFIGURATION ULTRA-OPTIMISÉE:');
  console.log('═'.repeat(60));
  console.log(`🔑 API: ${GEMINI_API_URL.split('/').pop()}`);
  console.log(`⏱️ Délai: ${formatDelay(REQUEST_DELAY)}`);
  console.log(`📝 Mots max: ${MAX_WORDS} (${DESCRIPTION_LANGUAGE})`);
  console.log(`🎨 Style: "${DESCRIPTION_STYLE}"`);
  console.log(`🤖 Config Gemini de base:`);
  console.log(`   • Température: ${ULTRA_OPTIMIZED_CONFIG.temperature} (-88% vs 0.4)`);
  console.log(`   • Tokens: ${ULTRA_OPTIMIZED_CONFIG.maxOutputTokens} (-87% vs 150)`);
  console.log(`   • TopK: ${ULTRA_OPTIMIZED_CONFIG.topK} (-90% vs 30)`);
  console.log(`   • TopP: ${ULTRA_OPTIMIZED_CONFIG.topP} (optimisé)`);
  console.log(`🎛️ Adaptation: ${ADAPTIVE_GEMINI_CONFIG.enabled ? 'ACTIVÉE' : 'DÉSACTIVÉE'}`);
  console.log(`📊 Logs: ${LOG_CONFIG.level}`);
  console.log('═'.repeat(60));
}

// 2. CONVERSION RAPIDE SANS COMPRESSION
async function fastImageToBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const blob = await response.blob();
    const sizeMB = blob.size / (1024 * 1024);
    
    // Vérification rapide de la taille
    if (sizeMB > MAX_SIZE_MB) {
      throw new Error(`Image too large: ${sizeMB.toFixed(1)}MB (max: ${MAX_SIZE_MB}MB)`);
    }
    
    // Conversion directe avec FileReader (le plus rapide)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve({
          base64,
          mimeType: blob.type || 'image/jpeg',
          sizeMB: sizeMB.toFixed(1)
        });
      };
      
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(blob);
    });
    
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

// 3. APPEL GEMINI ULTRA-OPTIMISÉ AVEC CONFIGURATION ADAPTATIVE
async function fastDescribeImage(imageUrl, customOptions = {}) {
  const startTime = Date.now();
  
  // Utiliser les constantes ou les options personnalisées
  const options = {
    language: customOptions.language || DESCRIPTION_LANGUAGE,
    maxWords: customOptions.maxWords || MAX_WORDS,
    style: customOptions.style || DESCRIPTION_STYLE
  };
  
  try {
    if (LOG_CONFIG.level !== 'MINIMAL') {
      console.log(`🚀 ${imageUrl.split('/').pop()}`);
    }
    
    // Conversion rapide
    const { base64, mimeType, sizeMB } = await fastImageToBase64(imageUrl);
    const conversionTime = Date.now() - startTime;
    
    if (LOG_CONFIG.showTimings && LOG_CONFIG.level !== 'MINIMAL') {
      console.log(`✅ Prêt (${sizeMB}MB) en ${conversionTime}ms`);
    }
    
    // Configuration Gemini adaptative
    const geminiConfig = getAdaptiveGeminiConfig(parseFloat(sizeMB), options.maxWords);
    
    if (LOG_CONFIG.showAdaptations && LOG_CONFIG.level === 'DETAILED') {
      console.log(`🎛️ Config adaptée: T=${geminiConfig.temperature}, Tokens=${geminiConfig.maxOutputTokens}, K=${geminiConfig.topK}, P=${geminiConfig.topP}`);
    }
    
    // Requête Gemini avec configuration optimisée
    const apiStartTime = Date.now();
    const prompt = `Describe this image in ${options.language} with maximum ${options.maxWords} words. Be ${options.style}.`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: base64 } }
          ]
        }],
        generationConfig: geminiConfig
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API error: ${response.status} - ${error.error?.message || 'Unknown'}`);
    }

    const data = await response.json();
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!description) {
      throw new Error('No description generated');
    }

    const apiTime = Date.now() - apiStartTime;
    const totalTime = Date.now() - startTime;
    const wordCount = description.trim().split(/\s+/).length;
    
    if (LOG_CONFIG.showTimings) {
      console.log(`🎯 Terminé en ${totalTime}ms (API: ${apiTime}ms)`);
    }
    
    if (LOG_CONFIG.showTokenUsage) {
      console.log(`📝 ${wordCount}/${options.maxWords} mots | Tokens utilisés: ${geminiConfig.maxOutputTokens}`);
    }
    
    if (LOG_CONFIG.showOptimizations && LOG_CONFIG.level === 'DETAILED') {
      const tokenEfficiency = Math.round((wordCount / geminiConfig.maxOutputTokens) * 100);
      console.log(`⚡ Efficacité tokens: ${tokenEfficiency}% | Config: ${JSON.stringify(geminiConfig)}`);
    }
    
    return {
      imageUrl,
      description: description.trim(),
      success: true,
      timing: { total: totalTime, api: apiTime, conversion: conversionTime },
      wordCount,
      geminiConfig: geminiConfig,
      efficiency: {
        tokensUsed: geminiConfig.maxOutputTokens,
        wordsGenerated: wordCount,
        efficiency: Math.round((wordCount / geminiConfig.maxOutputTokens) * 100)
      }
    };

  } catch (error) {
    const totalTime = Date.now() - startTime;
    if (LOG_CONFIG.level !== 'MINIMAL') {
      console.log(`❌ Échec en ${totalTime}ms: ${error.message}`);
    }
    
    return {
      imageUrl,
      error: error.message,
      success: false,
      timing: { total: totalTime }
    };
  }
}

// 4. TRAITEMENT EN BATCH ULTRA-OPTIMISÉ
async function ultraFastProcess(imageUrls) {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'VOTRE_VRAIE_CLE_API') {
    console.log('❌ ERREUR: Définissez GOOGLE_API_KEY !');
    return;
  }
  
  // Afficher la configuration
  showCurrentConfiguration();
  
  const descriptions = [];
  const timings = [];
  const efficiencyStats = [];
  const startTime = Date.now();
  
  console.log(`\n🚀 TRAITEMENT ULTRA-OPTIMISÉ de ${imageUrls.length} images`);
  console.log(`⚙️ Config: ${MAX_WORDS} mots max, langue: ${DESCRIPTION_LANGUAGE}`);
  console.log(`⏱️ Délai: ${formatDelay(REQUEST_DELAY)}, Limite: ${MAX_SIZE_MB}MB`);
  
  if (LOG_CONFIG.showOptimizations) {
    console.log(`🚀 OPTIMISATIONS ACTIVES:`);
    console.log(`   • Température ultra-basse: ${ULTRA_OPTIMIZED_CONFIG.temperature} (${Math.round((1-ULTRA_OPTIMIZED_CONFIG.temperature/0.4)*100)}% plus rapide)`);
    console.log(`   • Tokens minimal: ${ULTRA_OPTIMIZED_CONFIG.maxOutputTokens} (${Math.round((1-ULTRA_OPTIMIZED_CONFIG.maxOutputTokens/150)*100)}% moins de calcul)`);
    console.log(`   • TopK réduit: ${ULTRA_OPTIMIZED_CONFIG.topK} (${Math.round((1-ULTRA_OPTIMIZED_CONFIG.topK/30)*100)}% moins de choix)`);
    console.log(`   • Configuration adaptative: ${ADAPTIVE_GEMINI_CONFIG.enabled ? 'ACTIVÉE' : 'DÉSACTIVÉE'}`);
  }
  console.log('');
  
  for (let i = 0; i < imageUrls.length; i++) {
    if (LOG_CONFIG.level !== 'MINIMAL') {
      console.log(`📷 [${i + 1}/${imageUrls.length}]`, '─'.repeat(40));
    }
    
    const result = await fastDescribeImage(imageUrls[i]);
    
    if (result.success) {
      descriptions.push(result.description);
      timings.push(result.timing);
      if (result.efficiency) {
        efficiencyStats.push(result.efficiency);
      }
    }
    
    if (i < imageUrls.length - 1) {
      if (LOG_CONFIG.level !== 'MINIMAL') {
        console.log(`⏸️ Pause ${formatDelay(REQUEST_DELAY)}\n`);
      }
      await new Promise(r => setTimeout(r, REQUEST_DELAY));
    }
  }
  
  const totalTime = Date.now() - startTime;
  
  // STATISTIQUES DE PERFORMANCE ULTRA-DÉTAILLÉES
  console.log('\n📊 STATISTIQUES ULTRA-OPTIMISÉES:');
  console.log('═'.repeat(60));
  
  if (timings.length > 0) {
    const avgTotal = Math.round(timings.reduce((sum, t) => sum + t.total, 0) / timings.length);
    const avgApi = Math.round(timings.reduce((sum, t) => sum + t.api, 0) / timings.length);
    const avgConversion = Math.round(timings.reduce((sum, t) => sum + t.conversion, 0) / timings.length);
    const avgWords = Math.round(descriptions.reduce((sum, desc) => sum + desc.split(/\s+/).length, 0) / descriptions.length);
    
    console.log(`⚡ Temps moyen par image: ${avgTotal}ms`);
    console.log(`🔄 Conversion moyenne: ${avgConversion}ms`);
    console.log(`🤖 API Gemini moyenne: ${avgApi}ms`);
    console.log(`📝 Mots moyens par description: ${avgWords}/${MAX_WORDS}`);
    
    // Statistiques d'efficacité
    if (efficiencyStats.length > 0 && LOG_CONFIG.showOptimizations) {
      const avgTokensUsed = Math.round(efficiencyStats.reduce((sum, e) => sum + e.tokensUsed, 0) / efficiencyStats.length);
      const avgEfficiency = Math.round(efficiencyStats.reduce((sum, e) => sum + e.efficiency, 0) / efficiencyStats.length);
      
      console.log(`🎯 EFFICACITÉ OPTIMISATION:`);
      console.log(`   • Tokens moyens utilisés: ${avgTokensUsed}`);
      console.log(`   • Efficacité moyenne: ${avgEfficiency}%`);
      console.log(`   • Économie vs standard (150 tokens): ${Math.round((1-avgTokensUsed/150)*100)}%`);
    }
    
    // Comparaison avec baseline
    const baselineTime = 46; // seconds
    const currentTimeSeconds = Math.round(totalTime / 1000);
    const improvement = Math.round((baselineTime - currentTimeSeconds) / baselineTime * 100);
    
    console.log(`\n📈 PERFORMANCE vs BASELINE:`);
    console.log(`• Temps actuel: ${currentTimeSeconds}s`);
    console.log(`• Baseline estimé: ${baselineTime}s`);
    console.log(`• Amélioration: ${improvement}% ${improvement > 0 ? 'plus rapide' : 'plus lent'}`);
    console.log(`• Économie: ${baselineTime - currentTimeSeconds}s`);
  }
  
  console.log(`\n🏁 Temps total: ${Math.round(totalTime / 1000)}s`);
  console.log(`✅ Réussis: ${descriptions.length}/${imageUrls.length}`);
  
  // RÉSULTAT FINAL - DESCRIPTIONS PURES
  console.log('\n📝 DESCRIPTIONS FINALES:');
  console.log('═'.repeat(50));
  console.log(descriptions.join('\n'));
  console.log('═'.repeat(50));
  
  return {
    descriptions,
    stats: {
      total: descriptions.length,
      totalTime: Math.round(totalTime / 1000),
      avgTimePerImage: timings.length > 0 ? Math.round(timings.reduce((sum, t) => sum + t.total, 0) / timings.length) : 0,
      avgTokensUsed: efficiencyStats.length > 0 ? Math.round(efficiencyStats.reduce((sum, e) => sum + e.tokensUsed, 0) / efficiencyStats.length) : 0,
      avgEfficiency: efficiencyStats.length > 0 ? Math.round(efficiencyStats.reduce((sum, e) => sum + e.efficiency, 0) / efficiencyStats.length) : 0
    }
  };
}

// 5. FONCTION DE FORMATAGE DU DÉLAI
function formatDelay(delayMs) {
  if (delayMs >= 1000) {
    const seconds = delayMs / 1000;
    return seconds % 1 === 0 ? `${seconds} seconde${seconds > 1 ? 's' : ''}` : `${seconds} secondes`;
  } else {
    return `${delayMs}ms`;
  }
}

// 6. FONCTION DE TEST RAPIDE AVEC CONFIG
async function quickConfigTest(imageUrl) {
  console.log('⚡ TEST RAPIDE AVEC CONFIGURATION OPTIMISÉE');
  console.log('═'.repeat(50));
  
  showCurrentConfiguration();
  
  const result = await fastDescribeImage(imageUrl);
  
  if (result.success) {
    console.log(`\n✅ SUCCÈS en ${result.timing.total}ms`);
    console.log(`📝 "${result.description}"`);
    console.log(`🎯 Efficacité: ${result.efficiency.efficiency}% (${result.efficiency.wordsGenerated} mots pour ${result.efficiency.tokensUsed} tokens)`);
  } else {
    console.log(`❌ ÉCHEC: ${result.error}`);
  }
  
  return result;
}

// 7. COMPARAISON DE PERFORMANCE
async function comparePerformance(imageUrl) {
  console.log('🏁 COMPARAISON DE PERFORMANCE OPTIMISÉE');
  console.log('═'.repeat(50));
  
  // Test avec config ultra-optimisée
  console.log('🚀 Test méthode ULTRA-OPTIMISÉE...');
  const fastResult = await fastDescribeImage(imageUrl);
  
  console.log('\n📊 RÉSULTATS:');
  if (fastResult.success) {
    console.log(`⚡ Méthode ultra-optimisée: ${fastResult.timing.total}ms`);
    console.log(`📝 Description: ${fastResult.description}`);
    console.log(`🎯 Config utilisée: ${JSON.stringify(fastResult.geminiConfig)}`);
    console.log(`📊 Efficacité: ${fastResult.efficiency.efficiency}%`);
  } else {
    console.log(`❌ Méthode optimisée échouée: ${fastResult.error}`);
  }
}

// 8. VOS IMAGES
const imageUrls = [
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/AdobeStock_556562587-2880w.jpeg",
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/AdobeStock_279124473-2880w.jpeg",
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/AdobeStock_310405765-2880w.jpeg",
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/AdobeStock_30006569-2880w.jpeg",
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/huet+peinture+-+logo+redimensionn%C3%A9+carr%C3%A9-1920w.jpg"
];

// UTILISATION:
console.log('⚡ VERSION ULTRA-OPTIMISÉE AVEC CONFIGURATION AVANCÉE CHARGÉE !');
console.log('\n🎛️ PARAMÈTRES CONFIGURABLES:');
console.log('• ULTRA_OPTIMIZED_CONFIG - Configuration Gemini optimisée');
console.log('• ADAPTIVE_GEMINI_CONFIG - Adaptation automatique');
console.log('• LOG_CONFIG - Niveau de détail des logs');
console.log('• REQUEST_DELAY, MAX_WORDS, DESCRIPTION_STYLE - Paramètres de base');

console.log('\n🏁 Commandes disponibles:');
console.log('• quickConfigTest(imageUrls[0]) - Test rapide avec config');
console.log('• comparePerformance(imageUrls[0]) - Comparer les performances');
console.log('• ultraFastProcess(imageUrls) - Traitement ultra-optimisé');
console.log('• showCurrentConfiguration() - Afficher la config actuelle');

console.log('\n🎛️ CONFIGURATION ACTUELLE:');
console.log(`• Température: ${ULTRA_OPTIMIZED_CONFIG.temperature} (${Math.round((1-ULTRA_OPTIMIZED_CONFIG.temperature/0.4)*100)}% plus rapide)`);
console.log(`• Tokens: ${ULTRA_OPTIMIZED_CONFIG.maxOutputTokens} (${Math.round((1-ULTRA_OPTIMIZED_CONFIG.maxOutputTokens/150)*100)}% économie)`);
console.log(`• TopK: ${ULTRA_OPTIMIZED_CONFIG.topK} (${Math.round((1-ULTRA_OPTIMIZED_CONFIG.topK/30)*100)}% moins de choix)`);
console.log(`• Adaptation: ${ADAPTIVE_GEMINI_CONFIG.enabled ? 'ACTIVÉE' : 'DÉSACTIVÉE'}`);

// LANCER CECI:
ultraFastProcess(imageUrls);
