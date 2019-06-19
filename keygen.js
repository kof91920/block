const EC  = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const public = key.getPublic('hex');
const private = key.getPrivate('hex');

console.log();
console.log("private key: ", private);
console.log();
console.log("public key: ", public);