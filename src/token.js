import fs from "fs";
import jwt from "jsonwebtoken";

export default class Token {
  constructor(keyRaw, keyFile, keyFileBase64) {
    if (!!keyRaw) {
      console.log("Using raw private key...");
      this.privateKey = keyRaw;
    } else if (!!keyFile) {
      console.log("Using private key file...");
      this.privateKey = fs.readFileSync(keyFile);
    } else if (!!keyFileBase64) {
      console.log("Starting Base64 private key file decryption...");
      const keyFilename = "authkey.p8";
      const buffer = Buffer.from(keyFileBase64, "base64");
      fs.writeFileSync(keyFilename, buffer);
      this.privateKey = fs.readFileSync(keyFilename);
      console.log("Using decrypted Base64 private key file...");
    } else {
      throw new Error(`You must pass either private-key-raw, 
      or private-key-p8-path, or private-key-p8-base64 in order to generate JWT automatically. 
      Otherwise you should pass json-web-token.`);
    }
  }

  generate(appId, issuerId, keyId, platform) {
    const exp = "5m";
    const alg = "ES256";
    const aud = "appstoreconnect-v1";
    const scope = `GET /v1/apps/${appId}/appStoreVersions?filter[platform]=${platform}`;
    const payload = { iss: issuerId, aud: aud, scope: [scope] };
    const jwtOptions = {
      expiresIn: exp,
      algorithm: alg,
      header: { kid: keyId },
    };
    return jwt.sign(payload, this.privateKey, jwtOptions);
  }
}
