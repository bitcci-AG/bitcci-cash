const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

const bitcciCash = artifacts.require('bitcciCash');

contract('bitcciCash', function (accounts) {
  const [ deployer,blacklisted,newMinter, other, other2 ] = accounts;

  const name = 'bitcci Cash';
  const symbol = 'bitcci';
  const cap = new BN('100000000');
  const decimals = new BN(2);

  const amount = new BN('5000');

  const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const MINTER_ROLE = web3.utils.soliditySha3('MINTER_ROLE');
  const PAUSER_ROLE = web3.utils.soliditySha3('PAUSER_ROLE');
  const BLACKLISTED_ROLE = web3.utils.soliditySha3('BLACKLISTED_ROLE');

  beforeEach(async function () {

    this.token = await bitcciCash.new(name, symbol,decimals, cap, { from: deployer });
    await this.token.mint(deployer, amount, { from: deployer  });
    await this.token.mint(blacklisted, amount, { from: deployer  });
   
  }); 

  it('deployer has the default admin role', async function () {
    expect(await this.token.getRoleMemberCount(DEFAULT_ADMIN_ROLE)).to.be.bignumber.equal('1');
    expect(await this.token.getRoleMember(DEFAULT_ADMIN_ROLE, 0)).to.equal(deployer);
  });

  it('deployer has the minter role', async function () {
    expect(await this.token.getRoleMemberCount(MINTER_ROLE)).to.be.bignumber.equal('1');
    expect(await this.token.getRoleMember(MINTER_ROLE, 0)).to.equal(deployer);
  });

  it('deployer has the pauser role', async function () {
    expect(await this.token.getRoleMemberCount(PAUSER_ROLE)).to.be.bignumber.equal('1');
    expect(await this.token.getRoleMember(PAUSER_ROLE, 0)).to.equal(deployer);
  });

  it('minter and pauser role admin is the default admin', async function () {
    expect(await this.token.getRoleAdmin(MINTER_ROLE)).to.equal(DEFAULT_ADMIN_ROLE);
    expect(await this.token.getRoleAdmin(PAUSER_ROLE)).to.equal(DEFAULT_ADMIN_ROLE);
  });

  describe('minting', function () {
    it('deployer can mint tokens', async function () {
      const receipt = await this.token.mint(other, amount, { from: deployer });
      expectEvent(receipt, 'Transfer', { from: ZERO_ADDRESS, to: other, value: amount });

      expect(await this.token.balanceOf(other)).to.be.bignumber.equal(amount);
    });

    it('other accounts cannot mint tokens', async function () {
      await expectRevert(
        this.token.mint(other, amount, { from: other }),
        'bitcciCash: must have minter role to mint',
      );
    });
  });

  describe('pausing', function () {
    it('deployer can pause', async function () {
      const receipt = await this.token.pause({ from: deployer });
      expectEvent(receipt, 'Paused', { account: deployer });

      expect(await this.token.paused()).to.equal(true);
    });

    it('deployer can unpause', async function () {
      await this.token.pause({ from: deployer });

      const receipt = await this.token.unpause({ from: deployer });
      expectEvent(receipt, 'Unpaused', { account: deployer });

      expect(await this.token.paused()).to.equal(false);
    });

    it('cannot mint while paused', async function () {
      await this.token.pause({ from: deployer });

      await expectRevert(
        this.token.mint(other, amount, { from: deployer }),
        'ERC20Pausable: token transfer while paused',
      );
    });

    it('other accounts cannot pause', async function () {
      await expectRevert(
        this.token.pause({ from: other }),
        'bitcciCash: must have pauser role to pause',
      );
    });

    it('other accounts cannot unpause', async function () {
      await this.token.pause({ from: deployer });

      await expectRevert(
        this.token.unpause({ from: other }),
        'bitcciCash: must have pauser role to unpause',
      );
    });
  });
  describe('blacklisting', function () {
  it('reverts when trying to transfer from blacklisted address', async function () {
    await this.token.addBlackListed(blacklisted, {from: deployer});

    await expectRevert(this.token.transfer(
        other2, amount, { from: blacklisted }), 'bitcciCash: sender is Blacklisted',
    );
  });

  it('reverts when trying to transfer to blacklisted address', async function () {
    await this.token.addBlackListed(blacklisted, {from: deployer});

    await expectRevert(this.token.transfer(
      blacklisted, amount, { from: deployer }), 'bitcciCash: receiver is Blacklisted',
    );
  });
  it('blacklisted Address can not renounce its role', async function () {
    await expectRevert(this.token.renounceRole(
        BLACKLISTED_ROLE, blacklisted, { from: blacklisted }),'bitcciCash: cannot renounce blacklisted role.') ;
    
  });

  it('Unblacklisted address can transfer tokens', async function () {
    await this.token.removeBlackListed(blacklisted, {from: deployer});
    await this.token.transfer(other2, amount, { from: blacklisted });

    expect(await this.token.balanceOf(blacklisted)).to.be.bignumber.equal('0');
    expect(await this.token.balanceOf(other2)).to.be.bignumber.equal(amount);
   
  });
  
});

describe('granting', function () {
  beforeEach(async function () {
    await this.token.grantRole(MINTER_ROLE, newMinter, { from: deployer });
  });

  it('minter role should have been granted successfuly', async function () {
   
    expect(await this.token.getRoleMemberCount(MINTER_ROLE)).to.be.bignumber.equal('2');
    expect(await this.token.getRoleMember(MINTER_ROLE, 1)).to.equal(newMinter);
    
  });

  it('roles other than blacklisted role can be renounced', async function () {
    const receipt = await this.token.renounceRole(MINTER_ROLE, newMinter, { from: newMinter });
    expectEvent(receipt, 'RoleRevoked', { account: newMinter, role: MINTER_ROLE, sender: newMinter });

    expect(await this.token.hasRole(MINTER_ROLE, newMinter)).to.equal(false);
  });
});


  describe('burning', function () {
    it('holders can burn their tokens', async function () {
      await this.token.mint(other, amount, { from: deployer });

      const receipt = await this.token.burn(amount.subn(1), { from: other });
      expectEvent(receipt, 'Transfer', { from: other, to: ZERO_ADDRESS, value: amount.subn(1) });

      expect(await this.token.balanceOf(other)).to.be.bignumber.equal('1');
    });
  });
});
