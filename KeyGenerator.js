const fs = require("fs");
const { generateKeyPair, publicEncrypt, privateDecrypt } = require("crypto");
//generate the key pair
generateKeyPair(
  "rsa",
  {
    modulusLength: 2048, // It holds a number. It is the key size in bits and is applicable for RSA, and DSA algorithm only.
    publicKeyEncoding: {
      type: "pkcs1", //Note the type is pkcs1 not spki
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1", //Note again the type is set to pkcs1
      format: "pem",
      //cipher: "aes-256-cbc", //Optional
      //passphrase: "", //Optional
    },
  },
  (err, publicKey, privateKey) => {
    // Handle errors and use the generated key pair.
    if (err) console.log("Error!", err);
    console.log({
      publicKey,
      privateKey,
    }); //Print the keys to the console or save them to a file.

    fs.writeFileSync(
      "publicKey.pem",
      Buffer.from(publicKey).toString("base64")
    );
    fs.writeFileSync(
      "privateKey.pem",
      Buffer.from(privateKey).toString("base64")
    );
    /*
     * At this point you will have two pem files,
     * the public key which will start with
     * '-----BEGIN RSA PUBLIC KEY-----\n' +
     * and the private key which will start with
     * '-----BEGIN RSA PRIVATE KEY-----\n' +
     */
    //Verify it works by encrypting and decrypting data

    const data = "My secret data";

    const encryptedData = publicEncrypt(
      {
        key: publicKey,
        oaepHash: "sha256",
      },
      Buffer.from(data)
    );
    // The encrypted data is in the form of bytes, so we print it in base64 format
    // so that it's displayed in a more readable form
    console.log("encypted data: ", encryptedData.toString("base64"));

    const decryptedData = privateDecrypt(
      {
        key: privateKey,
        oaepHash: "sha256",
      },
      encryptedData
    );

    // The decrypted data is of the Buffer type, which we can convert to a
    // string to reveal the original data
    console.log("decrypted data: ", decryptedData.toString());
  }
);
