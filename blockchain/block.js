const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.noce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  // Function used for debugging
  toString() {
    return `Block -
      Timestap:   ${this.timestamp}
      Las hash:   ${this.lastHash.substring(0, 10)}
      Hash:       ${this.hash.substring(0, 10)}
      Data:       ${this.data}
      Nonce:      ${this.nonce}
      Difficulty: ${this.difficulty}
      `
  }

  static genesis() {
    return new this("Genesis time", "---------", "f1r57-h54h", [], 0, DIFFICULTY);
  }

  // Here is where we are creating new instances
  static mineBlock(lastBlock, data) {
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 0;

    // Here we are making a PoW to mine the block
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }

  static blockHash(block) {
    const { timestamp, lastHash, data, nonce,difficulty} = block;
    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;

  }
}

module.exports = Block;