module.exports = {

    "apiKey": {
        "etherscan": "YOUR_POLYGONSCAN_API_KEY", // POLYGONSCAN
//        "etherscan": "YOUR_ETHERSCAN_API_KEY",   // ETHERSCAN
        "coinmarketcap": "YOUR_COINMARKETCAP_API_KEY"
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

        "poly-test": {   // Polygon Mumbai testnet
            "mnemonic": "your twelve word mnemonic phrase here...",
            "txNode": "https://rpc-mumbai.maticvigil.com/v1/[API_KEY_HERE]",
            "explorer": "https://mumbai.polygonscan.com/",
            "gasLimit": "10000000",
            "chain": {
                "title": "Polygon Mumbai Testnet",
                "name": "mumbai",
                "chainId": 80001
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