module.exports = {

    // block_explorer
    // - API key for verifying contracts with hardhat-etherscan
    //   uncomment the one you will be using and comment the other
    //
    // coinmarketcap
    // - api key for CoinMarketCap used with hardhat-gas-reporter
    //
    // nft.storage
    // - api key for NFT.Storage Filecoin/IPFS gateway
    "apiKey": {
        "block_explorer": "YOUR_POLYGONSCAN_API_KEY", // POLYGONSCAN
//        "block_explorer": "YOUR_ETHERSCAN_API_KEY", // ETHERSCAN
        "coinmarketcap": "YOUR_COINMARKETCAP_API_KEY",
        "nft_storage":  "YOUR_NFT_STORAGE_API_KEY"
    },

    "network": {

        "hardhat": {  // hardhat local network
            "gasLimit": "5000000",
            "chain": {
                "title": "Hardhat Local",
                "name": "hardhat",
                "chainId": 31337
            }
        },

        "eth-test": {  // Ethereum Rinkeby testnet
            "mnemonic": "your twelve word mnemonic phrase here...",
            "txNode": "https://rinkeby.infura.io/v3/[API_KEY_HERE]",
            "explorer": "https://rinkeby.etherscan.io/",
            "gasLimit": "5000000",
            "chain": {
                "title": "Rinkeby Testnet",
                "name": "rinkeby",
                "chainId": 4
            },
            "deployments": {
                "fismo": "[YOUR_FISMO_OR_CLONE_ADDRESS]",
                "operator": "[YOUR_OPERATOR_OR_CLONE_ADDRESS]",
            }
        },

        "eth-main": {  // Ethereum Homestead mainnet
            "mnemonic": "your twelve word mnemonic phrase here...",
            "txNode": "https://mainnet.infura.io/v3/[API_KEY_HERE]",
            "explorer": "https://etherscan.io/",
            "gasLimit": "5000000",
            "chain": {
                "title": "Ethereum Mainnet",
                "name": "homestead",
                "chainId": 1
            },
            "deployments": {
                "fismo": "[YOUR_FISMO_OR_CLONE_ADDRESS]",
                "operator": "[YOUR_OPERATOR_OR_CLONE_ADDRESS]",
            }
        },

        "poly-test": {   // Polygon Amoy testnet
            "mnemonic": "your twelve word mnemonic phrase here...",
            "txNode": "https://rpc-amoy.polygon.technology/[API_KEY_HERE]",
            "explorer": "https://amoy.polygonscan.com/",
            "gasLimit": "10000000",
            "chain": {
                "title": "Polygon Amoy Testnet",
                "name": "amoy",
                "chainId": 80002
            },
            "deployments": {
                "fismo": "[YOUR_FISMO_OR_CLONE_ADDRESS]",
                "operator": "[YOUR_OPERATOR_OR_CLONE_ADDRESS]",
            }
        },

        "poly-main": {   // Polygon Matic mainnet
            "mnemonic": "your twelve word mnemonic phrase here...",
            "txNode": "https://rpc-mainnet.maticvigil.com/v1/[API_KEY_HERE]",
            "explorer": "https://polygonscan.com/",
            "gasLimit": "10000000",
            "chain": {
                "title": "Polygon Matic Mainnet",
                "name": "matic",
                "chainId": 137
            },
            "deployments": {
                "fismo": "[YOUR_FISMO_OR_CLONE_ADDRESS]",
                "operator": "[YOUR_OPERATOR_OR_CLONE_ADDRESS]",
            }
        }
    },

};