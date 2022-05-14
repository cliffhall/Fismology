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
const {Deployments} = require("fismo/sdk/node/");

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
    console.log(`${divider}\n💥 Clone Fismo\n${divider}`);
    console.log(`⛓ Network: ${network} (${chain.name})\n📅 ${new Date()}`);
    console.log("🔱 Owner account: ", owner ? owner.address : "not found" && process.exit() );
    console.log(divider);

    // Bail now if deploying locally
    if (chain.name === 'hardhat') {
        console.log(`❌  Cannot clone locally`);
        process.exit();
    } else if (!Deployments || !eip55.verify(Deployments[chain.name]?.Fismo)) {
        console.log(`❌  No official deployments for chain ${chain.name}`);
        process.exit();
    }

    // Check if you already have a Fismo deployment and just report its address if present
    if(eip55.verify(myDeployments?.Fismo)) {
        console.log(`✋  You already have a Fismo clone at: ${myDeployments?.Fismo}`);
        process.exit();
    }

    // Get the official Fismo deployment address for this chain
    const fismoAddress = Deployments[chain.name]?.Fismo;
    const fismo = await hre.ethers.getContractAt(FismoABI.IFismoClone, fismoAddress);

    // Clone Fismo
    const tx = await fismo.connect(owner).cloneFismo();
    const txReceipt = await tx.wait();
    const event = getEvent(txReceipt, fismo, "FismoCloned");
    console.log(`🧪 Your Fismo Clone: ${event.instance}`);
    console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });