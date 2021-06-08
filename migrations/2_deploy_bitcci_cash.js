const BN = require('bn.js');
const bitcciCash = artifacts.require('bitcciCash');

const CAP = new BN('100000000000');
const DECIMALS = new BN('2');

module.exports = async (deployer) => {
  // Deploys Regulator service
  await deployer.deploy(bitcciCash, "bitcciCash", "bitcciCH",DECIMALS, CAP);
};
