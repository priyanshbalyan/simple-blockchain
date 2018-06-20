const SHA256 = require('crypto-js/sha256')

class Transaction {
    constructor(fromAdress, toAdress, amount) {
        this.fromAdress = fromAdress;
        this.toAdress = toAdress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp - timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;

    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined:", this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block('01/01/2018', "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];

    }

    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     //newBlock.hash = newBlock.calculateHash();
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAdress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("block successfully mined");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAdress, this.miningReward)
        ]
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAdress(adress) {
        let balance = 0;
        for (const block of this.chain)
            for (const trans of block.transactions) {
                if (trans.fromAdress === adress)
                    balance -= trans.amount;

                if (trans.toAdress === adress)
                    balance += trans.amount;
            }

        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash())
                return false;

            if (currentBlock.previousHash !== previousBlock.hash)
                return false;
        }

        return true;
    }
}

let coin = new Blockchain();
// coin.addBlock(new Block(1, '10/03/2018', { amount: 4 }));
// coin.addBlock(new Block(2, '10/05/2018', { amount: 10 }));

// console.log("Is blockchain valid:", coin.isChainValid())

// //tampering with block
// coin.chain[1].data = { amount: 15 };
// console.log("Is blockchain valid:", coin.isChainValid())
//     //console.log(JSON.stringify(coin, null, 4));;

coin.createTransaction(new Transaction('adress1', 'adress2', 50));
coin.createTransaction(new Transaction('adress1', 'adress2', 50));

console.log("Starting the miner");
coin.minePendingTransactions('miners-adress');
console.log('Balance of miner is ', coin.getBalanceOfAdress('miners-adress'));

console.log("Starting the miner");
coin.minePendingTransactions('miners-adress');
console.log('Balance of miner is ', coin.getBalanceOfAdress('miners-adress'));

console.log("Starting the miner");
coin.minePendingTransactions('miners-adress');
console.log('Balance of miner is ', coin.getBalanceOfAdress('miners-adress'));