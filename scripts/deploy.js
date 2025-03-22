const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const FairTradeCertificate = await hre.ethers.getContractFactory("FairTradeCertificate");
  const certifier = process.env.CERTIFIER_ADDRESS || deployer.address;
  const fairTradeCertificate = await FairTradeCertificate.deploy(certifier);

  await fairTradeCertificate.deployed();

  console.log("FairTradeCertificate deployed to:", fairTradeCertificate.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });