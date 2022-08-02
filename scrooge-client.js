"use strict";

const Client = require("spartan-gold/client");
const BigInteger = require('jsbn').BigInteger;
const Pow_Leading_Zeroes = require("spartan-gold/blockchain");
const SHARE_DIFF = 3;
const SHARE_REWARD = 400;

module.exports = class ScroogeClient extends Client {
  receiveBlock(block) {
    let blockNum = this.lastBlock.chainLength;
    let b = super.receiveBlock(block);
    
    // If the block is null, it is invalid, so we return early.
    if (!b) return;
    
    // If the chainLength has not changed, then this block
    // is not the longest chain that the client knows about.
    if (blockNum === this.lastBlock.chainLength) return;

    b.transactions.forEach((tx, txID) => {
      console.log(`******Block has transaction ${txID}`);
      //
      // ***TODO**
      // Need to check for transactions where:
      // 1) there is a tx.data field.
      // 2) tx.data.nearMissID has sufficient leading zeroes (and is not undefined)
      // 3) tx.data.nearMissBlock is a valid block.
      //
      // We can ignore #3 for now, but we need to at least note in a comment
      // that we are deliberately ignoring the validity of the block.




      if(tx.data !== undefined && tx.data.nearMissID !== undefined){
        console.log(tx.data);
        console.log('\x1b[31m%s\x1b[0m', "TX DATA NEAR MISS ID: " + tx.data.nearMissID);
        //NOTE: in a real implementation, scrooge client would recieve the entire block and calculate the ID.
        let n = BigInt("0x" + tx.data.nearMissID); 
        // Adjusting the block's proof target to the share target.
        n /= 8n; // giving the big integer 3 more leading zeroes. 
        if(n < BigInt(b.target)){ // we are checking to see that the shifted number is smaller than the block target number.
          this.postTransaction([{address: tx.from, amount: SHARE_REWARD}]); // we pay the miner that found the near miss, 
        }
        else{
          console.log("invalid near miss");
        }
        //verify we have enough leading zeroes, pay the miner if so. the miner that finds a valid near miss gets paid, they get paid by calling postTransaction method.
      }


      




    });
  }
}

