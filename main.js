const SHA256 = require('crypto-js/sha256')

class block{
    constructor(index,timestamp,data,preHash=''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.preHash = preHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.preHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class blockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new block(0,'01/01/2019',"Genesis blck", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1]
    }

    addBlock(newBlock){
        newBlock.preHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

let yaoCoin = new blockChain();
yaoCoin.addBlock(new block(1,"6/18/19",{amount:4}));
yaoCoin.addBlock(new block(2,"6/18/19",{amount:10}));

console.log(JSON.stringify(yaoCoin,null,4));