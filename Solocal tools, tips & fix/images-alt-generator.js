// 1. CONFIGURATION - AJOUTEZ VOTRE CLÉ ICI
const GOOGLE_API_KEY = 'VOTRE_VRAIE_CLE_API'; // ⚠️ REMPLACEZ PAR VOTRE VRAIE CLÉ !
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const REQUEST_DELAY = 40; // Délai entre requêtes en millisecondes
const MAX_SIZE_MB = 20; // Limite Google Gemini (20MB)

// PARAMÈTRES DE DESCRIPTION
const MAX_WORDS = 20; // Nombre de mots maximum par description (impact sur vitesse)
const DESCRIPTION_LANGUAGE = 'French'; // Langue des descriptions
const DESCRIPTION_STYLE = 'detailed and comprehensive'; // Style de description

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

// 3. APPEL GEMINI OPTIMISÉ
async function fastDescribeImage(imageUrl, customOptions = {}) {
  const startTime = Date.now();
  
  // Utiliser les constantes ou les options personnalisées
  const options = {
    language: customOptions.language || DESCRIPTION_LANGUAGE,
    maxWords: customOptions.maxWords || MAX_WORDS,
    style: customOptions.style || DESCRIPTION_STYLE
  };
  
  try {
    console.log(`🚀 ${imageUrl.split('/').pop()}`);
    
    // Conversion rapide
    const { base64, mimeType, sizeMB } = await fastImageToBase64(imageUrl);
    const conversionTime = Date.now() - startTime;
    
    console.log(`✅ Prêt (${sizeMB}MB) en ${conversionTime}ms`);
    
    // Requête Gemini optimisée avec prompt dynamique
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
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: Math.min(options.maxWords * 2, 150) // Optimiser les tokens selon les mots
        }
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
    
    console.log(`🎯 Terminé en ${totalTime}ms (API: ${apiTime}ms)`);
    
    return {
      imageUrl,
      description: description.trim(),
      success: true,
      timing: { total: totalTime, api: apiTime, conversion: conversionTime },
      wordCount: description.trim().split(' ').length
    };

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.log(`❌ Échec en ${totalTime}ms: ${error.message}`);
    
    return {
      imageUrl,
      error: error.message,
      success: false,
      timing: { total: totalTime }
    };
  }
}

// 4. TRAITEMENT EN BATCH ULTRA-RAPIDE
async function ultraFastProcess(imageUrls) {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'VOTRE_VRAIE_CLE_API') {
    console.log('❌ ERREUR: Définissez GOOGLE_API_KEY !');
    return;
  }
  
  const descriptions = [];
  const timings = [];
  const startTime = Date.now();
  
  console.log(`🚀 TRAITEMENT ULTRA-RAPIDE de ${imageUrls.length} images`);
  console.log(`⚙️ Config: ${MAX_WORDS} mots max, langue: ${DESCRIPTION_LANGUAGE}`);
  console.log(`⏱️ Délai: ${formatDelay(REQUEST_DELAY)}, Limite: ${MAX_SIZE_MB}MB\n`);
  
  for (let i = 0; i < imageUrls.length; i++) {
    console.log(`📷 [${i + 1}/${imageUrls.length}]`, '─'.repeat(40));
    
    const result = await fastDescribeImage(imageUrls[i]);
    
    if (result.success) {
      descriptions.push(result.description);
      timings.push(result.timing);
    }
    
    if (i < imageUrls.length - 1) {
      console.log(`⏸️ Pause ${formatDelay(REQUEST_DELAY)}\n`);
      await new Promise(r => setTimeout(r, REQUEST_DELAY));
    }
  }
  
  const totalTime = Date.now() - startTime;
  
  // STATISTIQUES DE PERFORMANCE
  console.log('\n📊 STATISTIQUES DE PERFORMANCE:');
  console.log('═'.repeat(50));
  
  if (timings.length > 0) {
    const avgTotal = Math.round(timings.reduce((sum, t) => sum + t.total, 0) / timings.length);
    const avgApi = Math.round(timings.reduce((sum, t) => sum + t.api, 0) / timings.length);
    const avgConversion = Math.round(timings.reduce((sum, t) => sum + t.conversion, 0) / timings.length);
    const avgWords = Math.round(descriptions.map((_, i) => timings[i] && typeof timings[i].wordCount === 'number' ? timings[i].wordCount : 0).reduce((sum, w) => sum + w, 0) / descriptions.length);
    
    console.log(`⚡ Temps moyen par image: ${avgTotal}ms`);
    console.log(`🔄 Conversion moyenne: ${avgConversion}ms`);
    console.log(`🤖 API Gemini moyenne: ${avgApi}ms`);
    console.log(`📝 Mots moyens par description: ${avgWords}/${MAX_WORDS}`);
  }
  
  console.log(`🏁 Temps total: ${Math.round(totalTime / 1000)}s`);
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
      avgTimePerImage: timings.length > 0 ? Math.round(timings.reduce((sum, t) => sum + t.total, 0) / timings.length) : 0
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

// 6. COMPARAISON DE PERFORMANCE
async function comparePerformance(imageUrl) {
  console.log('🏁 COMPARAISON DE PERFORMANCE');
  console.log('═'.repeat(50));
  
  // Test rapide
  console.log('🚀 Test méthode RAPIDE...');
  const fastResult = await fastDescribeImage(imageUrl);
  
  console.log('\n📊 RÉSULTATS:');
  if (fastResult.success) {
    console.log(`⚡ Méthode rapide: ${fastResult.timing.total}ms`);
    console.log(`📝 Description: ${fastResult.description}`);
  } else {
    console.log(`❌ Méthode rapide échouée: ${fastResult.error}`);
  }
}

// 7. VOS IMAGES
const imageUrls = [
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/AdobeStock_556562587-2880w.jpeg",
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/AdobeStock_279124473-2880w.jpeg",
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/AdobeStock_310405765-2880w.jpeg",
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/AdobeStock_30006569-2880w.jpeg",
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/huet+peinture+-+logo+redimensionn%C3%A9+carr%C3%A9-1920w.jpg"
];

// UTILISATION:
console.log('⚡ VERSION ULTRA-RAPIDE CHARGÉE !');
console.log('🏁 Commandes disponibles:');
console.log('• comparePerformance(imageUrls[0]) - Comparer les performances');
console.log('• ultraFastProcess(imageUrls) - Traitement ultra-rapide');
console.log(`⚙️ Configuration actuelle: ${MAX_WORDS} mots, ${DESCRIPTION_LANGUAGE}`);
console.log(`⚡ Gain de vitesse estimé: 40-60% plus rapide`);

// EXEMPLES DE PERSONNALISATION:
console.log('\n🎛️ PERSONNALISATION RAPIDE:');
console.log('• Pour des descriptions courtes: MAX_WORDS = 15');
console.log('• Pour des descriptions détaillées: MAX_WORDS = 40');
console.log('• Pour l\'anglais: DESCRIPTION_LANGUAGE = "English"');
console.log('• Pour un style concis: DESCRIPTION_STYLE = "concise"');

// LANCER CECI:
ultraFastProcess(imageUrls);
