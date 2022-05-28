//--------------------------------------------------------------------------------------------------------------------
// Deploy one or more experiment
// Uses exported Experiment Descriptors from scripts/lab/experiments.js
//
// 👇 Configure the experiments to deploy and whether to verify on block explorer 👇
//--------------------------------------------------------------------------------------------------------------------
const {LockableDoor} = require("../lab/experiments");
const experiments = [LockableDoor];
const verify = true;
//--------------------------------------------------------------------------------------------------------------------

// Workaday imports
const hre = require("hardhat");
const ethers = hre.ethers;
const network = hre.network.name;
const eip55 = require('eip55');
const {deployExperiment} = require("../util/deploy-experiment");
const {delay, deploymentComplete, verifyOnEtherscan} = require("../util/report-verify");

// Environment config
const environments = require('../../environments');
const gasLimit = environments.network[network].gasLimit;
const chain = environments.network[network].chain;
const myDeployments = environments.network[network].deployments;

// Log contracts deployed by this script
let contract, contracts = [];

// Get the Fismo ABI from the SDK
const FismoABI = require('fismo/sdk/fismo-abi.json');

// Get the official deployments
const {Deployments:OfficialDeployments} = require("fismo/sdk/node/");

/**
 * Deploy one or more experiments to your configured Fismo instance
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

    // Get owner's Fismo instance
    const fismo = await ethers.getContractAt(FismoABI.IFismoUpdate, myDeployments?.Fismo);

    // Bail now if no Fismo
    if (!fismo || !fismo?.address) {
        console.log(`❌ You need to clone or deploy Fismo on ${chain.name} with clone-fismo.js`);
        process.exit();
    }
    // Bail now if no experiments configured above
    else if (experiments.length === 0) {
        console.log(`❌ Configure experiments to install at the top of this script`);
        process.exit();
    }
    // or if deploying locally
    else if (chain.name === 'hardhat') {
        console.log(`❌ Cannot clone locally`);
        process.exit();
    }
    // or if you have no Fismo deployments
    else if (!OfficialDeployments) {
        console.log(`❌ You have no Fismo/Operator deployments configured for chain ${chain.name}`);
        process.exit();
    }
    // or if there is no operator to clone and a custom one is not specified
    else if (!eip55.verify(myDeployments?.Operator) && !eip55.verify(OfficialDeployments[chain.name]?.Operator)) {
        console.log(`❌ You have no deployed operator and there is no official Operator to clone for chain ${chain.name}`);
        process.exit();
    }
    // or if you have no Fismo instance
    else if (!eip55.verify(myDeployments?.Fismo)) {
        console.log(`❌ You must first clone or deploy Fismo to chain ${chain.name} using clone-fismo.js`);
        process.exit();
    }

    // Compile everything to be sure any custom operator and guards are ready to deploy
    await hre.run('compile');

    // Deploy experiments
    for (const experiment of experiments) {
        console.log(`\n📦 INSTALLING MACHINE: ${experiment.machine.name}`);
        try {
            [operator, operatorArgs, guards, machine, tokens] = await deployExperiment(owner, fismo, experiment, gasLimit);
            console.log(`✅ Machine installed on your existing Fismo contract: ${fismo.address}`);
            const usedExisting = (operator && operator.address === myDeployments?.Operator);

            // Report operator status
            if (!usedExisting && experiment.operator) {
                deploymentComplete(experiment.operator, operator.address, operatorArgs, contracts);
            } else if (usedExisting) {
                console.log(`👉 Used existing Operator clone: ${operator.address}`);
            } else {
                console.log(`🧪 Your new Operator clone: ${operator.address}`);
                console.log(`✋ Be sure to update environments.js`);
                console.log(`➡️ Set network.${network}.deployments.Operator to "${operator.address}"`);
            }

            // Report guard deployment status
            guards.forEach(guard => deploymentComplete(guard.contractName, guard.contract.address, [], contracts));

            // Report token deployment status
            tokens.forEach(token => deploymentComplete(token.contractName, token.contract.address, [], contracts));

        } catch (e) {
            console.log(`❌ ${e}`);
        }
    }

    // Bail if not configured to verify on block explorer or no contracts deployed
    if (!verify || !contracts.length) process.exit();

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