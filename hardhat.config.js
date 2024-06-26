const environments = require('./environments');
require("@nomicfoundation/hardhat-verify");
require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0
    },
    "eth-main": {
      gas: "auto",
      url: environments.network['eth-main'].txNode,
      accounts: {
        mnemonic: environments.network['eth-main'].mnemonic
      }
    },
    "eth-test": {
      gas: "auto",
      url: environments.network['eth-test'].txNode,
      accounts: {
        mnemonic: environments.network['eth-test'].mnemonic
      }
    },
    "poly-main": {
      gas: "auto",
      url: environments.network['poly-main'].txNode,
      accounts: {
        mnemonic: environments.network['poly-main'].mnemonic
      }
    },
    "poly-test": {
      gas: "auto",
      url: environments.network['poly-test'].txNode,
      accounts: {
        mnemonic: environments.network['poly-test'].mnemonic
      }
    }
  },
  etherscan: {
    apiKey: {
      "poly-test": environments.apiKey['block_explorer']["poly-test"]
    },
    customChains: [
      {
        network: "poly-test",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        }
      }
    ]
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: false,
        runs: 200
      }
    }
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: true,
    runOnCompile: false,
    strict: false,
  },
  gasReporter: {
    currency: 'USD',
    enabled: true,
    gasPrice: 170,
    coinmarketcap: environments.apiKey.coinmarketcap,
    showTimeSpent: true,
    showMethodSig: false
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};