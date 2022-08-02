
//const Miner = require("spartan-gold/miner");
const {Miner, utils, Blockchain} = require('spartan-gold');

const BigInteger = require('jsbn').BigInteger;



NEAR_MISS_FOUND = "NEAR MISS FOUND"

// Shares require 3 less leading zeroes than proofs.
const SHARE_DIFF = 3;

module.exports = class SWMiner extends Miner{
constructor(...args){
    super(...args);
}

 findProof(oneAndDone=false) {
    let pausePoint = this.currentBlock.proof + this.miningRounds;
    while (this.currentBlock.proof < pausePoint) {
      if (this.currentBlock.hasValidProof()) {
        this.log(`found proof for block ${this.currentBlock.chainLength}: ${this.currentBlock.proof}`);
        this.announceProof();
        // Note: calling receiveBlock triggers a new search.
        this.receiveBlock(this.currentBlock);
        break;
      }
      else if(this.hasValidNearMiss(this.currentBlock)){
          this.log(`found near miss for block ${this.currentBlock.chainLength}: ${this.currentBlock.nearMiss}`)
          this.postNearmissTransaction(this.currentBlock.id);
          //this.receiveBlock(this.currentBlock);
         // break;
      }
      this.currentBlock.proof++;
    }
    // If we are testing, don't continue the search.
    if (!oneAndDone) {
      // Check if anyone has found a block, and then return to mining.
      setTimeout(() => this.emit(Blockchain.START_MINING), 0);
    }
  }

  postNearmissTransaction(blockID) {
    // We calculate the total value of gold needed.
    console.log( "this is the current block id" + this.currentBlock.id);
    // Create and broadcast the transaction.
    let tx =  this.postGenericTransaction({
      fee: 0,
      data: {nearMissID: this.currentBlock.id}, // we're passing the id, but we need to pass the entire block because with just the ID we can lie about the leading zeroes.
    });
    return tx;
  }








  hasValidNearMiss(block) {
   let h = utils.hash(block.serialize());
   let n = new BigInteger(h,16);
   n = n.shiftRight(SHARE_DIFF);
   return n.compareTo(block.target) < 0;
  }














}
