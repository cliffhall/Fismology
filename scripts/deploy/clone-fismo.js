// Workaday imports
const hre = require("hardhat");
const ethers = hre.ethers;
const network = hre.network.name;
const eip55 = require('eip55');
const {getEvent} = require("../util/tx-utils");

// Environment config
const environments = require('../../environments');
const gasLimit = environments.gasLimit;
const chain = environments.network[network].chain;
const myDeployments = environments.network[network].deployments;

// Get the Fismo ABI from the SDK
const FismoABI = require('fismo/sdk/fismo-abi.json');

// Get the official deployments
const {Deployments:OfficialDeployments} = require("fismo/sdk/node/");

/**
 * Clone Fismo from the official deployment for the given chain
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
async function main() {

    // Get accounts
    const accounts = await ethers.getSigners();
    const owner = accounts[0];

    // Report header
    const divider = "-".repeat(80);
    console.log(`${divider}\nš„ Clone Fismo\n${divider}`);
    console.log(`ā Network: ${network} (${chain.name})\nš ${new Date()}`);
    console.log("š± Owner account: ", owner ? owner.address : "not found" && process.exit() );
    console.log(divider);

    // Bail now if deploying locally
    if (chain.name === 'hardhat') {
        console.log(`ā  Cannot clone locally`);
        process.exit();
    } else if (!OfficialDeployments || !eip55.verify(OfficialDeployments[chain.name]?.Fismo)) {
        console.log(`ā  No official deployments for chain ${chain.name}`);
        process.exit();
    }

    // Check if you already have a Fismo deployment and just report its address if present
    if(eip55.verify(myDeployments?.Fismo)) {
        console.log(`ā You already have a Fismo clone at: ${myDeployments?.Fismo}`);
        process.exit();
    }

    // Get the official Fismo deployment address for this chain
    const fismoAddress = OfficialDeployments[chain.name]?.Fismo;
    const fismo = await hre.ethers.getContractAt(FismoABI.IFismoClone, fismoAddress);

    // Clone Fismo
    const tx = await fismo.connect(owner).cloneFismo({gasLimit});
    const txReceipt = await tx.wait();
    const event = getEvent(txReceipt, fismo, "FismoCloned");
    console.log(`š§Ŗ Your new Fismo clone: ${event.instance}`);
    console.log(`ā Be sure to update environments.js`);
    console.log(`ā”ļø Set network.${network}.deployments.Fismo to "${event.instance}"`);
    console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });