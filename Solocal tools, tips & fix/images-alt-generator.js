// 1. CONFIGURATION - AJOUTEZ VOTRE CLÉ ICI
const GOOGLE_API_KEY = 'VOTRE_VRAIE_CLE_API'; // ⚠️ REMPLACEZ PAR VOTRE VRAIE CLÉ !
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Paramètres de compression
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB max pour être sûr
const MAX_DIMENSION = 750; // Largeur/hauteur max en pixels
const COMPRESSION_QUALITY = 0.5; // Qualité JPEG (0.1 à 1.0)
const REQUEST_DELAY = 100; // Délai entre requêtes en millisecondes (4000ms = 4 secondes)

// 2. FONCTION DE COMPRESSION D'IMAGE
async function compressImage(imageUrl) {
  try {
    console.log('📥 Téléchargement de l\'image...');
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    const originalSize = blob.size;
    
    console.log(`📏 Taille originale: ${Math.round(originalSize / 1024)} KB`);
    
    // Si l'image est déjà petite, pas besoin de compression
    if (originalSize <= MAX_FILE_SIZE && blob.type.includes('image/')) {
      console.log('✅ Image déjà optimale, pas de compression nécessaire');
      return await blobToBase64(blob);
    }
    
    // Créer un canvas pour la compression
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = function() {
        console.log(`🖼️ Dimensions originales: ${img.width}x${img.height}`);
        
        // Calculer les nouvelles dimensions
        let { width, height } = calculateNewDimensions(img.width, img.height);
        
        console.log(`🔧 Nouvelles dimensions: ${width}x${height}`);
        
        // Redimensionner le canvas
        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir en blob avec compression
        canvas.toBlob((compressedBlob) => {
          if (!compressedBlob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          const compressedSize = compressedBlob.size;
          const reduction = Math.round((1 - compressedSize / originalSize) * 100);
          
          console.log(`✅ Compression réussie: ${Math.round(compressedSize / 1024)} KB (-${reduction}%)`);
          
          // Convertir en base64
          blobToBase64(compressedBlob)
            .then(resolve)
            .catch(reject);
            
        }, 'image/jpeg', COMPRESSION_QUALITY);
      };
      
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      
      // Créer une URL temporaire pour l'image
      const imageObjectURL = URL.createObjectURL(blob);
      img.src = imageObjectURL;
    });
    
  } catch (error) {
    console.error('❌ Erreur compression:', error.message);
    throw new Error(`Compression failed: ${error.message}`);
  }
}

// 3. FONCTION POUR CALCULER LES NOUVELLES DIMENSIONS
function calculateNewDimensions(originalWidth, originalHeight) {
  let width = originalWidth;
  let height = originalHeight;
  
  // Redimensionner si trop grand
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }
  
  return { width, height };
}

// 3.5. FONCTION POUR FORMATER LE DÉLAI
function formatDelay(delayMs) {
  if (delayMs >= 1000) {
    const seconds = delayMs / 1000;
    return seconds % 1 === 0 ? `${seconds} seconde${seconds > 1 ? 's' : ''}` : `${seconds} secondes`;
  } else {
    return `${delayMs}ms`;
  }
}

// 4. FONCTION POUR CONVERTIR BLOB EN BASE64
async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function() {
      const base64 = reader.result.split(',')[1]; // Enlever le préfixe data:
      resolve({
        base64,
        mimeType: blob.type || 'image/jpeg',
        size: blob.size
      });
    };
    
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(blob);
  });
}

// 5. FONCTION GEMINI AVEC COMPRESSION AUTOMATIQUE
async function describeImageWithCompression(imageUrl, language = 'French', maxWords = 30) {
  try {
    console.log(`🚀 Traitement: ${imageUrl.split('/').pop()}`);
    
    // Compresser l'image
    const { base64, mimeType, size } = await compressImage(imageUrl);
    
    console.log(`📤 Envoi à Gemini (${Math.round(size / 1024)} KB)...`);
    
    const requestBody = {
      contents: [{
        parts: [
          {
            text: `Describe this image in ${language} with a maximum of ${maxWords} words. Be precise and descriptive.`
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 150
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!description) {
      throw new Error('No description generated by Gemini');
    }

    console.log('✅ Description générée avec succès');
    
    return {
      imageUrl,
      description: description.trim(),
      success: true
    };

  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    return {
      imageUrl,
      error: error.message,
      success: false
    };
  }
}

// 6. FONCTION PRINCIPALE AVEC COMPRESSION
async function processImagesWithCompression(imageUrls) {
  // Vérification de la clé API
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'VOTRE_VRAIE_CLE_API') {
    console.log('❌ ERREUR: Vous devez définir GOOGLE_API_KEY avec votre vraie clé !');
    return;
  }
  
  // Vérification des paramètres
  if (!imageUrls || !Array.isArray(imageUrls)) {
    console.log('❌ ERREUR: imageUrls doit être un tableau !');
    return;
  }
  
  const descriptions = [];
  
  console.log(`🚀 Traitement de ${imageUrls.length} images avec compression automatique...`);
  console.log(`⚙️ Paramètres: Max ${MAX_DIMENSION}px, Qualité ${COMPRESSION_QUALITY}, Max ${Math.round(MAX_FILE_SIZE/1024)}KB`);
  console.log(`⏱️ Délai entre requêtes: ${formatDelay(REQUEST_DELAY)}`);
  
  for (let i = 0; i < imageUrls.length; i++) {
    console.log(`\n📷 === IMAGE ${i + 1}/${imageUrls.length} ===`);
    
    const result = await describeImageWithCompression(imageUrls[i], 'French', 30);
    
    if (result.success) {
      descriptions.push(result.description);
      console.log(`✅ Succès !`);
    } else {
      console.log(`❌ Échec: ${result.error}`);
    }
    
    if (i < imageUrls.length - 1) {
      console.log(`⏸️ Pause de ${formatDelay(REQUEST_DELAY)}...`);
      await new Promise(r => setTimeout(r, REQUEST_DELAY));
    }
  }
  
  // Résultat final - DESCRIPTIONS PURES
  console.log('\n📝 === DESCRIPTIONS FINALES ===');
  console.log('='.repeat(50));
  console.log(descriptions.join('\n'));
  console.log('='.repeat(50));
  console.log(`\n📊 ${descriptions.length}/${imageUrls.length} réussies`);
  
  return descriptions;
}

// 7. VOS IMAGES
const imageUrls = [
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/AdobeStock_556562587-2880w.jpeg",
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/AdobeStock_279124473-2880w.jpeg",
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/AdobeStock_310405765-2880w.jpeg",
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/AdobeStock_30006569-2880w.jpeg",
    "https://le-de.cdn-website.com/b15100be4e4e48cfaba3f9824bd98498/dms3rep/multi/opt/huet+peinture+-+logo+redimensionn%C3%A9+carr%C3%A9-1920w.jpg"
];

// UTILISATION CORRECTE:
console.log('🗜️ VERSION AVEC COMPRESSION CHARGÉE !');
console.log(`⏱️ Délai configuré: ${formatDelay(REQUEST_DELAY)}`);
console.log('✅ Pour lancer le traitement, tapez:');
console.log('processImagesWithCompression(imageUrls);');

// ✅ LIGNE CORRECTE - Décommentez pour lancer:
processImagesWithCompression(imageUrls);
