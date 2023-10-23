# Project Documentation: Decentralized Wallet with Token Swapping

## Overview

This project involves a decentralized wallet smart contract named `Wallet`, which allows users to manage their Ether and ERC20 tokens on the Ethereum blockchain. The wallet provides functionalities for receiving and sending Ether, depositing and withdrawing ERC20 tokens, and executing a simplified token swap. Additionally, the project includes a custom ERC20 token contract called `HuziToken`.

This document outlines the project's purpose, key components, and functionality, as well as provides setup instructions and details of the test cases.

## Prerequisites

Before setting up and using the `Wallet` and `HuziToken` contracts, ensure that you have the following prerequisites installed:

### Node.js and npm

If you haven't already installed Node.js and npm, you can download and install them from [the official Node.js website](https://nodejs.org/).

### Hardhat and Dependencies

You need to set up a Node.js project and install the required dependencies. Here are the steps:

1. Initialize a new Node.js project.

```sh
npm init -y
```

2. Install the development dependencies.

```sh
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts chai
```

### Initialize a Hardhat Project

Once you have installed the required dependencies, you can set up a new Hardhat project with the following commands:

1. Create a new Hardhat project.

```sh
npx hardhat
```

This command will guide you through the process of setting up your Hardhat project. When prompted, select "Create an JavaScript Hardhat" to create a basic project structure.

Now you have your project initialized and are ready to proceed with the setup of the `Wallet` and `HuziToken` contracts and running tests.

## Contract Descriptions

Wallet.sol
The Wallet contract manages user balances of Ether and ERC20 tokens. It provides the following key functionalities:

Receive Ether: The contract can receive Ether sent to it. The received Ether is added to the sender's balance.

Send Ether: Users can send a specified amount of Ether to another address, provided they have enough Ether in their balance.

Deposit ERC20 Tokens: Users can deposit ERC20 tokens into the wallet by approving the contract to spend a certain amount. The deposited tokens are added to the user's balance.

Withdraw ERC20 Tokens: Users can withdraw ERC20 tokens from their balance, with proper validation to ensure they have enough tokens.

Token Swap: A simplified representation of token swapping where users can exchange one ERC20 token for another at a 1:1 ratio. In real scenarios, more complex logic and external data (e.g., price feed oracles) would be needed for actual token swaps.

Additional Utility Functions: The contract provides functions to query balances of Ether and ERC20 tokens for any account.

HuziToken.sol
The HuziToken contract is a custom ERC20 token. It allows for the creation of tokens with a specific name, symbol, and initial supply. This contract is used to demonstrate ERC20 token interactions within the Wallet contract.

## Testing

Tests are implemented using the Hardhat testing environment, which integrates with ethers.js, chai, and ethereum-waffle for assertions.

Test Cases
The test cases ensure the functionality of the Wallet contract and demonstrate its capabilities. They are organized into the following categories:

Initialization: Tests whether the deployment of the Wallet and HuziToken contracts is successful and verifies their initial state.

Ether Transactions: Verifies the functionality of sending and receiving Ether in the wallet, ensuring proper balance management for different users.

Token Transactions: Tests the depositing and withdrawing of ERC20 tokens, validating that the balances are updated correctly.

Token Swap: Demonstrates the simplified token swapping functionality, including the transfer of tokens between users.

For each test case, various before-and-after balances are captured and compared to ensure that the contract operations are successful and accurate.

## Conclusion

The Wallet contract provides a foundation for managing Ethereum and ERC20 tokens within a decentralized wallet. While this project serves as an educational tool, it is essential to understand that further development, security measures, testing, and auditing are necessary to deploy it in a production environment. Users are encouraged to build upon this project, implement additional features, and consider real-world scenarios, such as integrating DEXs and price feed oracles, to create a robust and secure decentralized wallet application.