// Pure JavaScript implementation of Base32 decoding and TOTP (RFC 6238 / RFC 4226)
// This enables real Google Authenticator 2FA verification on the client side.

function base32tohex(base32: string): string {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let hex = "";

  // Remove padding and normalize
  const cleanBase32 = base32.replace(/=+$/, "").toUpperCase();

  for (let i = 0; i < cleanBase32.length; i++) {
    const val = base32chars.indexOf(cleanBase32.charAt(i));
    if (val === -1) {
      throw new Error("Invalid base32 character");
    }
    bits += val.toString(2).padStart(5, "0");
  }

  for (let i = 0; i + 4 <= bits.length; i += 4) {
    const chunk = bits.substring(i, i + 4);
    hex += parseInt(chunk, 2).toString(16);
  }
  return hex;
}

function dec2hex(s: number): string {
  return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
}

function hex2dec(s: string): number {
  return parseInt(s, 16);
}

function leftpad(str: string, len: number, pad: string): string {
  if (len + 1 >= str.length) {
    str = Array(len + 1 - str.length).join(pad) + str;
  }
  return str;
}

// Simple SHA-1 implementation in JS
function sha1(data: Uint8Array): Uint8Array {
  const words = new Uint32Array(80);
  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const len = data.length;
  const paddedLen = ((len + 8) >> 6) + 1 << 6;
  const padded = new Uint8Array(paddedLen);
  padded.set(data);
  padded[len] = 0x80;
  
  const view = new DataView(padded.buffer);
  const bitLength = len * 8;
  view.setUint32(paddedLen - 4, bitLength);

  for (let i = 0; i < paddedLen; i += 64) {
    for (let j = 0; j < 16; j++) {
      words[j] = view.getUint32(i + j * 4);
    }
    for (let j = 16; j < 80; j++) {
      const val = words[j - 3] ^ words[j - 8] ^ words[j - 14] ^ words[j - 16];
      words[j] = (val << 1) | (val >>> 31);
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let j = 0; j < 80; j++) {
      let f, k;
      if (j < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }

      const temp = (((a << 5) | (a >>> 27)) + f + e + k + words[j]) | 0;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = temp;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
  }

  const result = new Uint8Array(20);
  const resView = new DataView(result.buffer);
  resView.setUint32(0, h0);
  resView.setUint32(4, h1);
  resView.setUint32(8, h2);
  resView.setUint32(12, h3);
  resView.setUint32(16, h4);
  return result;
}

// Simple HMAC-SHA1 implementation
function hmacSha1(key: Uint8Array, message: Uint8Array): Uint8Array {
  let activeKey = key;
  if (key.length > 64) {
    activeKey = sha1(key);
  }
  if (activeKey.length < 64) {
    const tmp = new Uint8Array(64);
    tmp.set(activeKey);
    activeKey = tmp;
  }

  const ipad = new Uint8Array(64);
  const opad = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    ipad[i] = activeKey[i] ^ 0x36;
    opad[i] = activeKey[i] ^ 0x5c;
  }

  const ipadMsg = new Uint8Array(64 + message.length);
  ipadMsg.set(ipad);
  ipadMsg.set(message, 64);
  const innerHash = sha1(ipadMsg);

  const opadMsg = new Uint8Array(64 + innerHash.length);
  opadMsg.set(opad);
  opadMsg.set(innerHash, 64);
  return sha1(opadMsg);
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let c = 0; c < hex.length; c += 2) {
    bytes[c / 2] = parseInt(hex.substring(c, c + 2), 16);
  }
  return bytes;
}

/**
 * Verifies a TOTP 6-digit code against a secret key
 * @param secret The Base32 secret key (e.g. "CRUNQI2FASECRETKEY")
 * @param code The 6-digit code to verify (e.g. "123456")
 * @param windowAllowance Number of steps (30s each) to allow before/after current time
 */
export function verifyTOTP(secret: string, code: string, windowAllowance: number = 1): boolean {
  try {
    const cleanSecret = secret.replace(/\s+/g, "");
    const keyBytes = hexToBytes(base32tohex(cleanSecret));
    const epoch = Math.round(new Date().getTime() / 1000.0);
    const currentStep = Math.floor(epoch / 30);

    for (let i = -windowAllowance; i <= windowAllowance; i++) {
      const step = currentStep + i;
      const timeHex = leftpad(dec2hex(step), 16, "0");
      const msgBytes = hexToBytes(timeHex);
      const hmacResult = hmacSha1(keyBytes, msgBytes);
      
      const offset = hmacResult[hmacResult.length - 1] & 0xf;
      const otpBytes = hmacResult.subarray(offset, offset + 4);
      
      let binary = ((otpBytes[0] & 0x7f) << 24) |
                   ((otpBytes[1] & 0xff) << 16) |
                   ((otpBytes[2] & 0xff) << 8) |
                   (otpBytes[3] & 0xff);

      const otp = (binary % 1000000).toString().padStart(6, "0");
      if (otp === code.trim()) {
        return true;
      }
    }
  } catch (err) {
    console.error("Error verifying TOTP", err);
  }
  return false;
}
