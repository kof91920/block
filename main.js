const EC  = require('elliptic').ec;
const ec = new EC('secp256k1');
const {blockChain, transaction} = require('./blockchain.js');

const mykey = ec.keyFromPrivate('8861380df9b862cd67db7b1e1190ac0eca06a7405a749e5ba11941b1c9afe0c3');
const mywallet = mykey.getPublic('hex');

let jyCoin = new blockChain();

xw