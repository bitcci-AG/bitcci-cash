# Development 

Steps for running the project locally for development

##Prerequisites:
Truffle CLI v5.3.1
openzeppelin/contracts library version: 4.1.0
Ganache
solc v0.8.0
solhint


## Setup
Open Ganache and make sure it is running on port 7545
Clone the repository using ` git clone https://github.com/bitcci-AG/bitcci-cash.git `
install the dependencies using `npm install`
To compile the contracts use `truffle compile`


## Run Tests 
To automatically deploy contract on local and run tests use ` truffle test`



## Setting up surya
 Surya Static analysis tool setup can be triggered by command ` npm run setup:surya `

 Summary of Contracts can be obtained by ` surya describe contracts/**/*.sol `
 Contracts can be flattened by ` surya flatten contracts/bitcciCash.sol `

 Control Flow Graph can be generated for flattened contract using 
` surya graph contracts/**/Flattened.sol | dot -Tpng > SuryaControlFlowGraph.png `

 Here Flattened.sol is flattened contract file


 ## Deploying the contract:
 Finally to deploy contract on local:
 `truffle migrate`



