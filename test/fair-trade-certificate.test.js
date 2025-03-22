const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FairTradeCertificate", function () {
  let FairTradeCertificate;
  let fairTradeCertificate;
  let owner;
  let company;
  let addr2;

  beforeEach(async function () {
    [owner, company, addr2] = await ethers.getSigners();
    
    FairTradeCertificate = await ethers.getContractFactory("FairTradeCertificate");
    fairTradeCertificate = await FairTradeCertificate.deploy(owner.address);
    await fairTradeCertificate.deployed();
  });

  it("Should issue a certificate correctly", async function () {
    const companyName = "Organic Coffee Co.";
    const regNo = "12345-ABCDE";
    const validityPeriod = 365; // 1 year
    const tokenURI = "ipfs://QmExample";
    
    await fairTradeCertificate.issueCertificate(
      company.address,
      companyName,
      regNo,
      validityPeriod,
      tokenURI
    );
    
    expect(await fairTradeCertificate.balanceOf(company.address)).to.equal(1);
    
    const info = await fairTradeCertificate.getCompanyInfo(0);
    expect(info.companyName).to.equal(companyName);
    expect(info.registrationNumber).to.equal(regNo);
    
    expect(await fairTradeCertificate.isValid(0)).to.equal(true);
  });

  it("Should not allow unauthorized users to issue certificates", async function () {
    const companyName = "Organic Coffee Co.";
    const regNo = "12345-ABCDE";
    const validityPeriod = 365;
    const tokenURI = "ipfs://QmExample";
    
    await expect(
      fairTradeCertificate.connect(addr2).issueCertificate(
        company.address,
        companyName,
        regNo,
        validityPeriod,
        tokenURI
      )
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should allow certificate renewal", async function () {
    const companyName = "Organic Coffee Co.";
    const regNo = "12345-ABCDE";
    const validityPeriod = 365;
    const additionalPeriod = 180;
    const tokenURI = "ipfs://QmExample";
    
    await fairTradeCertificate.issueCertificate(
      company.address,
      companyName,
      regNo,
      validityPeriod,
      tokenURI
    );
    
    const initialInfo = await fairTradeCertificate.getCompanyInfo(0);
    const initialExpiration = initialInfo.expirationDate;
    
    await fairTradeCertificate.renewCertificate(0, additionalPeriod);
    
    const updatedInfo = await fairTradeCertificate.getCompanyInfo(0);
    const newExpiration = updatedInfo.expirationDate;
    
    expect(Number(newExpiration)).to.equal(Number(initialExpiration) + (additionalPeriod * 24 * 60 * 60));
  });

  it("Should revoke a certificate correctly", async function () {
    const companyName = "Organic Coffee Co.";
    const regNo = "12345-ABCDE";
    const validityPeriod = 365;
    const tokenURI = "ipfs://QmExample";
    
    await fairTradeCertificate.issueCertificate(
      company.address,
      companyName,
      regNo,
      validityPeriod,
      tokenURI
    );
    
    expect(await fairTradeCertificate.balanceOf(company.address)).to.equal(1);
    
    await fairTradeCertificate.revokeCertificate(0, "Compliance violation");
    
    expect(await fairTradeCertificate.balanceOf(company.address)).to.equal(0);
    
    await expect(
      fairTradeCertificate.getCompanyInfo(0)
    ).to.be.revertedWith("Certificate does not exist");
  });
});
