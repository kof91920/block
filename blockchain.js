const SHA256 = require('crypto-js/sha256');
const EC  = require('elliptic').ec;
const ec = new EC('secp256k1');

class transaction{
    constructor(from, to, amount){
        this.from = from;
        this.to = to;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.from+this.to+this.amount).toString();
    }

    signTransaction(signKey){
        if(signKey.getPublic('hex') !== this.from){
            throw new Error('cannot sign other wallet');
        }

        const hashTx = this.calculateHash();
        const sig = signKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.from === null) {
            return true;
        }
        if(!this.signature || this.signature.length === 0){
            throw new Error('no signature');
        }

        const publicKey = ec.keyFromPublic(this.from,'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}


class block{
    constructor(timestamp,transaction,preHash=''){
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.preHash = preHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.preHash + this.timestamp + JSON.stringify(this.transaction) + this.nonce).toString();
    }

    mineBlock(difficult){
        while(this.hash.substring(0, difficult) !== Array(difficult+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(this.hash);
    }

    hasValidTransaction(){
        for (const tx of this.transaction){
            if(!tx.isValid()) 
                return false;
        }
        return true;
    }
}

class blockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficult = 4;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new block('01/01/2019',"Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1]
    }

    mingPending(miningRewardAddress){
        this.pendingTransactions.push(new transaction(null, miningRewardAddress, this.miningReward))
        
        let newblock = new block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        newblock.mineBlock(this.difficult);

        console.log('got block');
        this.chain.push(newblock);
        this.pendingTransactions = [];
    }

    addTransaction(transaction){
        if(!transaction.from || !transaction.to){
            throw new Error("must have from and to address");
        }
        if (!transaction.isValid()){
            throw new Error("cannot add invalid transaction");
        }
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for (const block of this.chain){
            for(const tran of block.transaction){
                if (tran.from === address){
                    balance -= tran.amount;
                }

                if (tran.to === address){
                    balance += tran.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length;++i){
            const current = this.chain[i];
            const prev = this.chain[i-1];
            
            if(!current.hasValidTransaction())
                return false;

            if(current.hash !== current.calculateHash()){
                return false;
            }

            if(current.preHash !== prev.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports.blockChain = blockChain;
module.exports.transaction = transaction;