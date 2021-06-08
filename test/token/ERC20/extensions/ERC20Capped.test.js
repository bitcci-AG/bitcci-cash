const { BN, ether, expectRevert } = require('@openzeppelin/test-helpers');
const { shouldBehaveLikeERC20Capped } = require('./ERC20Capped.behavior');

const bitcciCash = artifacts.require('bitcciCash');

contract('bitcciCash', function (accounts) {
  const [ minter, ...otherAccounts ] = accounts;

  const cap = new BN('100000000');
  const decimals = new BN(2);

  const name = 'My Token';
  const symbol = 'MTKN';

  it('requires a non-zero cap', async function () {
    await expectRevert(
      bitcciCash.new(name, symbol,decimals, new BN(0), { from: minter }), 'ERC20Capped: cap is 0');
  });

  context('once deployed', async function () {
    beforeEach(async function () {
      this.token = await bitcciCash.new(name, symbol,decimals, cap, { from: minter });
    });

    shouldBehaveLikeERC20Capped(minter, otherAccounts, cap);
  });
});