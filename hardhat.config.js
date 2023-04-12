require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require('dotenv').config()
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require('hardhat-gas-reporter')


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    sepolia: {
      url: process.env.RPC_UR,
      accounts: [
        process.env.PRIVATE_KEY,
      ],
      chainId: 11155111,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.7"
      },
      {
        version: "0.6.6"
      }
    ]
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_PRIVATE_KEY
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARTKET_API_KEY
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
    user: {
      default: 1
    }
  }
};
