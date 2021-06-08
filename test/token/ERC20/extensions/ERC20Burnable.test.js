const { BN } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeERC20Burnable } = require('./ERC20Burnable.behavior');
const bitcciCash = artifacts.require('bitcciCash');

contract('bitcciCash', function (accounts) {
  const [ owner, ...otherAccounts ] = accounts;

 
  const initialBalance = new BN(10000);
  

  const name = 'My Token';
  const symbol = 'MTKN';

  const cap = new BN('100000000');
  const decimals = new BN(2);

  beforeEach(async function () {
    
    this.token = await bitcciCash.new(name, symbol,decimals, cap, { from: owner });
    await this.token.mint(owner, initialBalance, { from: owner  });
  });

  shouldBehaveLikeERC20Burnable(owner, initialBalance, otherAccounts);
});
