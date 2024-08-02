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
  return {
    iv: btoa(String.fromCharCode.apply(null, iv)),
    ciphertext: hex,
    salt: btoa(String.fromCharCode.apply(null, salt))
  };
}


async function aes256_decrypt(ciphertextHex, password, ivBase64, saltBase64) {
  try {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Convert the base64 and hex values back to Uint8Array
    const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
    const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));
    const ciphertext = new Uint8Array(ciphertextHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

    // Derive the key using PBKDF2
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
      ['decrypt']
    );

    // Decrypt the ciphertext
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      derivedKey,
      ciphertext
    );

    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Decryption failed');
  }
}


const message = 'exemple';
const password = 'motdepasse';

// Encryption part
const encryptedResult = await aes256(message, password);
console.log('Encrypted:', encryptedResult);

// Decryption part
try {
  const decryptedMessage = await aes256_decrypt(
    encryptedResult.ciphertext,
    password,
    encryptedResult.iv,
    encryptedResult.salt
  );
  console.log('Decrypted:', decryptedMessage);
} catch (error) {
  console.error('Error during decryption:', error);
}
