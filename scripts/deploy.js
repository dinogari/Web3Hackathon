// Add the missing ethers import
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Fair Trade Certificate contract...");
  
  // Get the Contract Factory
  const FairTradeCertificate = await ethers.getContractFactory("FairTradeCertificate");
  
  // Deploy the contract
  const fairTradeCertificate = await FairTradeCertificate.deploy();
  
  // Wait for deployment to finish
  await fairTradeCertificate.deployed();
  
  console.log("Contract deployed to:", fairTradeCertificate.address);
  console.log("Set this address as your CONTRACT_ADDRESS in your .env file");
  
  // Wait for a few block confirmations to make sure Etherscan can find the contract
  console.log("Waiting for block confirmations...");
  await fairTradeCertificate.deployTransaction.wait(5);
  
  console.log("Deployment confirmed!");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });