const hre = require("hardhat");

async function main() {
  // Get the contract factory and signers
  const FairTradeCertificate = await hre.ethers.getContractFactory("FairTradeCertificate");
  const [issuer] = await ethers.getSigners();
  
  // Get the deployed contract address from your .env file or deployment
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Contract address not found. Please set CONTRACT_ADDRESS in .env");
  }
  
  // Connect to the deployed contract
  const certificate = await FairTradeCertificate.attach(contractAddress);
  
  // Example company data
  const companyAddress = process.env.COMPANY_ADDRESS; // The recipient's address
  const companyName = "Organic Coffee Co.";
  const registrationNumber = "ORG12345";
  const validityPeriod = 365; // 1 year in days
  const tokenURI = "ipfs://QmExample"; // Replace with your actual IPFS metadata URI
  
  console.log(`Issuing certificate to ${companyName} at address ${companyAddress}`);
  
  // Issue the certificate
  const tx = await certificate.issueCertificate(
    companyAddress,
    companyName,
    registrationNumber,
    validityPeriod,
    tokenURI
  );
  
  // Wait for the transaction to be mined
  await tx.wait();
  
  console.log("Certificate issued successfully!");
  console.log("Transaction hash:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });