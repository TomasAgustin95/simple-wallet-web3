const { ethers } = require("hardhat");
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const Wallet = await ethers.getContractFactory("Wallet");
    const wallet = await Wallet.deploy();
  
    console.log("Wallet address:", wallet.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  