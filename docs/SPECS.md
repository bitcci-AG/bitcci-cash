## bitcci Cash Smart Contract Specifications and overview.

The Solidity Smart contracts for bitcci Cash have used the renowned and highly secure openzeppelin-contracts library for its implementation.

Solidity Version used for Development/Deployment: 0.8.0
openzeppelin/contracts library version: 4.1.0

bitcci Cash is 

1. Capped : The Maximum total supply of bitcci Cash is Capped to 100 billion. No more tokens can be minted beyond this.

2. Mintable: The entire supply is not pre-mined rather, the tokens are minted(while keeping the total supply below the CAP) from time to time.

3. Burnable: The tokens are burnable implying that unused tokens can be burned by the holder thus decreasing the total supply of bitcci Cash.

4. Pausable: The Contract is Pausable, so in case of an unforseen disaster/hack all token transfers can be blocked temporarily which can minimise the spread of disaster in token holder's interest.

5. Blacklistable: Keeping in mind the increased number of attacks/hacks on exchanges and phishing attacks on holders, a suspicious address can be blacklisted thus preventing further token transfer and preventing liquidation of victim's tokens.


Implementation of PAUSER, MINTER Role:

bitcci Cash uses openzeppelin's Access Control module that allows children to implement role-based access control mechanisms.
A user needs PAUSER_ROLE in order to pause the contract. 
Similarly MINTER_ROLE is required in order to mint the tokens.
Account deploying the bitcci Cash contract will be granted the minter and pauser roles, as well as the default admin role.
Default Admin Role is its own admin too which means it has permission to grant and revoke this role.


Implementation of Blacklisting:

Access Control Module is used to blacklist an address as well.
Any account which has been assigned BLACKLISTED_ROLE can not transfer the tokens unless it is unblacklisted.
To achieve this, the internal function _beforeTokenTransfer has been overriden and requires msg.sender to not have the BLACKLISTED_ROLE.

``` 
 function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC20, ERC20Pausable) {
         require(!(hasRole(BLACKLISTED_ROLE, msg.sender)), "bitcciCash: account is Blacklisted");
        super._beforeTokenTransfer(from, to, amount); 
        ```

A BLACKLISTED_ROLE address can not renounce the role, it can only be revoked by admin.
 
 ``` function renounceRole(bytes32 role, address account)
        public
        virtual
        override
    {
        require(role != BLACKLISTED_ROLE, "bitcciCash: cannot renounce blacklisted role");

        super.renounceRole(role, account);
    }
```
