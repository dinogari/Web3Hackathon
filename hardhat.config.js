// hardhat.config.js
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY_HERE",
      accounts: ["0x3ae85f5bbccfe65a4fc415ee933ca451b57c0397d0e30127ff92fddde64ac274"]
    }
  },
  etherscan: {
    apiKey: "Q3YZB5HPD18RCBYU7KFZXRE7TQ9GJD4WW1"
  }
};