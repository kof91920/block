const SHA256 = require('crypto-js/sha256')

class transaction{
    constructor(from, to, amount){
        this.from = from;
        this.to = to;
        this.amount = amount;
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
        return SHA256(this.index + this.preHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficult){
        while(this.hash.substring(0, difficult) !== Array(difficult+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(this.hash);
    }
}

class blockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficult = 2;
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
        let newblock = new block(Date.now(), this.pendingTransactions);
        newblock.mineBlock(this.difficult);
        console.log('got the block');
        this.chain.push(newblock);

        this.pendingTransactions = [new transaction(null, miningRewardAddress, this.miningReward)];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for (const block of this.chain){
            console.log(block);
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

let jyCoin = new blockChain();

jyCoin.createTransaction(new transaction('address1','address2',100));
jyCoin.createTransaction(new transaction('address2','address1',50));
jyCoin.mingPending('123');
console.log(jyCoin.getBalanceOfAddress('123'));
jyCoin.mingPending('123');
console.log(jyCoin.getBalanceOfAddress('123'));
jyCoin.mingPending('123');
console.log(jyCoin.getBalanceOfAddress('123'));