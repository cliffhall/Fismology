const hre = require("hardhat");
const ethers = hre.ethers;

/**
 * Deploy Tokens
 *
 * ERC20, ERC721, and ERC1155 example tokens
 *
 * @param gasLimit - gasLimit for transactions
 *
 * @returns {Promise<(*|*|*)[]>}
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
async function deployTokens(tokens, gasLimit) {

    const deployedTokens = [];

    // Deploy all the tokens
    while (tokens.length) {
        let token = tokens.shift();
        let TokenContractFactory = await ethers.getContractFactory(token);
        const tokenContract = await TokenContractFactory.deploy({gasLimit});
        await tokenContract.deployed();
        deployedTokens.push(tokenContract.address);
    }

    // Return the deployed token contract addresses
    return deployedTokens;

}

exports.deployTokens = deployTokens;