module.exports = {
    solidity: {
      compilers: [
        {
          version: "0.8.19",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        }
      ]
    },
    paths: {
      sources: "./contracts",
      artifacts: "./artifacts",
      cache: "./cache",
      tests: "./test"
    }
  };
