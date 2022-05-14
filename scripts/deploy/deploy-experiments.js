//--------------------------------------------------------------------------------------------------------------------
// Deploy one or more experiment
// Uses exported Experiment Descriptors from scripts/lab/experiments.js
//
// 👇 Configure the experiments to deploy and whether to verify on block explorer 👇
//--------------------------------------------------------------------------------------------------------------------
const {LockableDoor} = require("../lab/experiments");
const experiments = [LockableDoor];
const verify = false;
//const experiments = []; // remove me
//--------------------------------------------------------------------------------------------------------------------

// Workaday imports
const hre = require("hardhat");
const ethers = hre.ethers;
const network = hre.network.name;
const eip55 = require('eip55');
const {installExperiment} = require("../util/install-experiment");
const {delay, deploymentComplete, verifyOnEtherscan} = require("../util/report-verify");

// Environment config
const environments = require('../../environments');
const gasLimit = environments.gasLimit;
const chain = environments.network[network].chain;
const myDeployments = environments.network[network].deployments;

// Log contracts deployed by this script
let contract, contracts = [];

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
    console.log(`${divider}\n💥 Deploy Experiments\n${divider}`);
    console.log(`⛓  Network: ${network} (${chain.name})\n📅 ${new Date()}`);
    console.log("🔱 Owner account: ", owner ? owner.address : "not found" && process.exit() );
    console.log(divider);

    // Bail now if no experiments configured above
    if (experiments.length === 0) {
        console.log(`❌  Configure experiments to install at the top of this script`);
        process.exit();
    }
    // or if deploying locally
    else if (chain.name === 'hardhat') {
        console.log(`❌  Cannot clone locally`);
        process.exit();
    }
    // or if you have no Fismo deployments
    else if (!Deployments) {
        console.log(`❌  You have no Fismo/Operator deployments configured for chain ${chain.name}`);
        process.exit();
    }
    // or if there is no operator to clone and a custom one is not specified
    else if (!eip55.verify(myDeployments?.Operator) && !eip55.verify(Deployments?.Operator)) {
        console.log(`❌  You have no deployed operator and there is no official Operator to clone for chain ${chain.name}`);
        process.exit();
    }
    // or if you have no Fismo instance
    else if (!eip55.verify(myDeployments?.Fismo)) {
        console.log(`❌  You must first clone or deploy Fismo to chain ${chain.name}`);
        process.exit();
    }

    // Compile everything to be sure any custom operator and guards are ready to deploy
    await hre.run('compile');

    // Deploy experiments
    for (const experiment of experiments) {
        console.log(`\n📦 EXPERIMENT: ${experiment.machine.name}`);
        try {
            [operator, operatorArgs, guards, machine, tokens] = await installExperiment(owner.address, myDeployments, experiment, gasLimit);
            console.log(`✅  ${machine.name} machine added to Fismo contract.`);
            const usedExisting = (operator && operator.address === myDeployments?.Operator);

            // Report operator status
            if (!usedExisting) {
                deploymentComplete(experiment.operator, operator.address, operatorArgs, contracts);
            } else {
                console.log(`👉 Your existing Operator used: ${operator.address}`);
            }

            // Report guard deployment status
            guards.forEach(guard => deploymentComplete(guard.contractName, guard.contract.address, [], contracts));

            // Report token deployment status
            tokens.forEach(token => deploymentComplete(token.contractName, token.contract.address, [], contracts));

        } catch (e) {
            console.log(`❌  ${e}`);
        }
    }

    // Bail if not configured to verify on block explorer
    if (!verify) process.exit();

    // Wait a minute after deployment completes and then verify contracts on etherscan/polgyonscan
    console.log('⏲ Pause one minute, allowing deployments to propagate to Etherscan backend...');
    await delay(60000).then(
        async () => {
            console.log('🔍 Verifying contracts on Etherscan...');
            while(contracts.length) {
                contract = contracts.shift()
                await verifyOnEtherscan(contract);
            }
        }
    );

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });