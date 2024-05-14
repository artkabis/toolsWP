async function aes256(message, password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    derivedKey,
    data
  );
  const hash = await crypto.subtle.digest('SHA-256', ciphertext);
  const view = new DataView(hash);
  const bytes = new Uint8Array(hash.byteLength);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = view.getUint8(i);
  }
  const hex = bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  return { iv: btoa(String.fromCharCode.apply(null, iv)), ciphertext: hex, salt: btoa(String.fromCharCode.apply(null, salt)) };
}


const message = 'exemple';
const password = 'motdepasse';
const result = await aes256(message, password);
console.log(result); // affiche un objet contenant le vecteur d'initialisation (IV) et le hachage de la chaîne chiffrée sous forme de chaîne hexadécimale
