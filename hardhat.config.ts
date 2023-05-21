import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'

dotenvConfig({ path: resolve(__dirname, './.env') })

import { HardhatUserConfig } from 'hardhat/config'
import { NetworkUserConfig } from 'hardhat/types'
import 'solidity-coverage'
import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'
import '@openzeppelin/hardhat-defender'
import 'hardhat-contract-sizer'
import './scripts/tasks/deploy/deploy-full'
import { Network } from './networkConfig'

const mnemonic: string | undefined = process.env.MNEMONIC
if (!mnemonic) {
  throw new Error('Please set your MNEMONIC in a .env file')
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY
if (!infuraApiKey) {
  throw new Error('Please set your INFURA_API_KEY in a .env file')
}

function getChainConfig(chain: Network): NetworkUserConfig {
  let jsonRpcUrl: string
  switch (chain) {
    case Network.SCROLL:
      jsonRpcUrl = 'https://alpha-rpc.scroll.io/l2'
      break
    case Network.GOERLI:
      jsonRpcUrl = 'https://ethereum-goerli.publicnode.com'
      break
    default:
      jsonRpcUrl = 'https://mainnet.infura.io/v3/' + infuraApiKey
  }

  return {
    accounts: {
      count: 10,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chain,
    url: jsonRpcUrl,
    gasPrice: 300000000000,
    gasMultiplier: 2,
  }
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || '',
      xdai: process.env.GNOSIS_API_KEY || '',
      avalanche: process.env.SNOWTRACE_API_KEY || '',
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || '',
      polygon: process.env.POLYGONSCAN_API_KEY || '',
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || '',
    },
  },
  gasReporter: {
    currency: 'USD',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    enabled: !!process.env.REPORT_GAS,
    showTimeSpent: true,
    excludeContracts: [],
    src: './contracts',
    token: 'MATIC',
    gasPriceApi: 'https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice',
    // noColors: true,
    // outputFile: "./reports/LoadTest",
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    only: ['ZkpayID'],
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
        count: 100,
      },
      chainId: Network.LOCAL,
    },
    goerli: getChainConfig(Network.GOERLI),
    scroll: getChainConfig(Network.SCROLL),
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test/batch',
  },
  solidity: {
    compilers: [
      {
        version: '0.8.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 1000000,
  },
  defender: {
    apiKey: process.env.DEFENDER_API_KEY || '',
    apiSecret: process.env.DEFENDER_API_SECRET || '',
  },
}

export default config
