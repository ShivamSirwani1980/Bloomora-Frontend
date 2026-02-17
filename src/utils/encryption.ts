import CryptoJS from "crypto-js";

// Base64-encoded AES-256 key from .env (44 chars → 32 bytes)
const KEY_BASE64 = import.meta.env.VITE_ENCRYPTION_KEY as string;

// Convert Base64 → WordArray (binary key)
const KEY = CryptoJS.enc.Base64.parse(KEY_BASE64);

/**
 * Encrypt a single value using AES-CBC + PKCS7
 */
const encryptValue = (value: string, ivBase64: string): string => {
  const iv = CryptoJS.enc.Base64.parse(ivBase64);

  return CryptoJS.AES.encrypt(value, KEY, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(); // Base64 ciphertext
};

/**
 * Encrypt all auth payload fields (login/signup)
 */
export const encryptAuthPayload = (
  payload: Record<string, string>,
  ivBase64: string
): Record<string, string> => {
  const encryptedPayload: Record<string, string> = {};

  Object.entries(payload).forEach(([key, value]) => {
    encryptedPayload[key] = encryptValue(value, ivBase64);
  });

  return encryptedPayload;
};
