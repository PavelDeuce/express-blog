import sha256 from 'crypto-js/sha256.js';
import hmacSHA512 from 'crypto-js/hmac-sha512.js';
import Base64 from 'crypto-js/enc-base64.js';

export default (text) => {
  const hashDigest = sha256(`${text}secret`);
  return Base64.stringify(hmacSHA512(hashDigest, 'secret'));
};
