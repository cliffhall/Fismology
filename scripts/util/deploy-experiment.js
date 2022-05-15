const hre = require("hardhat");
const ethers = hre.ethers;
const network = hre.network.name;
const eip55 = require("eip55");

const { Machine } = require("fismo/sdk/node");
const { deployTokens } = require('./deploy-tokens');
const { deployTransitionGuards } = require('./deploy-guards');

// Get the chain and personal deployments
const environments = require("../../environments");
const chain = environments.network[network].chain;
const myDeployments = environments.network[network].deployments;

// Get the official deployments
const {Deployments:OfficialDeployments} = require("fismo/sdk/node/");

// Get the Fismo ABI from the SDK
const FismoABI = require('fismo/sdk/fismo-abi.json');
const {getEvent} = require("./tx-utils");

/**
 * Deploy an experiment
 *
 * This script:
 * - Expects you to have a Fismo instance configured for the target network
 *   - You can clone an official Fismo deployment on supported networks with clone-fismo.js
 *   - Then add the address of cloned Fismo instance to the appropriate location in environments.js
 *
 * - Will compile and deploy an explicitly defined experiment operator if the experiment has one
 *   - Otherwise, will use your existing, configured Operator clone if found in environments.js
 *   - Finally, if no existing Operator clone is found, it will clone the official Operator
 *     - Then add the address of cloned Operator instance to the appropriate location in environments.js
 *
 * - Will compile and deploy all associated guard contracts.
 *   - You can put all the code for a given machine in one contract if you like
 *   - You can also have a separate contract for every guarded state of a machine
 *   - Only one of those contracts can contain the initializer for the machine if you have one.
 *
 * - Installs the experiment's machine into your Fismo instance
 *   - configured with the chosen operator and deployed guard addresses
 *
 * - If an initializer is defined for the experiment, it is called with custom argument data
 *   - if the experiment lists one or more token contracts to deploy, it will deploy them first
 *   - experiments that require token contracts expect the address(s) in their initializer args
 *   - custom initializer calldata is created in the prepareInitializerArgs method below
 *   - initializers allow you to set up and populate one or more custom storage slots for your machine
 *   - machines can share custom storage slots so that data created in one machine is available to another
 *
 * @param owner - the signer instance for the owner
 * @param experiment - the experiment descriptor. See experiments.js for format.
 * @param gasLimit - gasLimit for transactions
 *
 * @returns {Promise<(*|*|*)[]>}
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
async function deployExperiment(owner, fismo, experiment, gasLimit) {

    // Create and validate the machine
    const machine = Machine.fromObject(experiment.machine);

    // Deploy operator, guards, and add machine to Fismo
    if (machine.isValid()) {

        const operatorArgs = [myDeployments?.Fismo];
        let operator, operatorAddress;

        // Deploy explicitly defined experiment operators
        if (experiment.operator) {

            // Deploy experiment operator
            const Operator = await ethers.getContractFactory(experiment.operator);
            operator = await Operator.deploy(...operatorArgs, {gasLimit});
            await operator.deployed();

        // Or use owner's existing Operator instance if configured
        } else if (eip55.verify(myDeployments?.Operator)) {

            // Get owner's already cloned operator
            operatorAddress = myDeployments.Operator;
            operator = await ethers.getContractAt(FismoABI.Operator, operatorAddress);

        // Otherwise, clone official Operator
        } else {

            // Get the official Operator deployment address for this chain
            operatorAddress = OfficialDeployments[chain.name]?.Operator;
            operator = await ethers.getContractAt(FismoABI.Operator, operatorAddress);

            // Clone Operator
            const tx = await operator.connect(owner).cloneOperator(fismo.address, {gasLimit});
            const txReceipt = await tx.wait();
            const event = getEvent(txReceipt, operator, "OperatorCloned");

            // Now point to clone as operator
            operatorAddress = event.clone;
            operator = await ethers.getContractAt(FismoABI.Operator, operatorAddress);
        }

        // Update machine with operator address
        machine.operator = operator.address;

        // Deploy transition guards
        const guards = await deployTransitionGuards(experiment, gasLimit);

        // Add guard addresses to their associated states
        for (const guard of guards) {
            guard.states.forEach(stateName => {
                let state = machine.getState(stateName);
                state.guardLogic = guard.contract.address
            })
        }

        // If there is an initializer defined
        let tokens = [];
        if (experiment.initializer) {

            if (experiment.tokens) {
                // Deploy the requested tokens; experiment initializers will need one or more of them
                tokens = await deployTokens(experiment.tokens, gasLimit);
            }
            // Get experiment-specific initialization args (initializer contract and calldata)
            const initArgs = prepareInitializerArgs(experiment, guards, tokens);

            // Install and initialize the machine
            await fismo.installAndInitializeMachine(machine.toObject(), ...initArgs, {gasLimit});

        } else {

            // Just install the machine
            await fismo.installMachine(machine.toObject(), {gasLimit});

        }

        // Return the operator, the guards, the guarded machine entity, and any deployed token addresses
        return [operator, operatorArgs, guards, machine.clone(), tokens];

    } else {

        throw("Invalid machine definition.");

    }

}

/**
 * Prepare initializer arguments
 *
 * Only used by installExperiment when an experiment
 * has an initializer.
 *
 * Initializers vary by experiment, depending upon the
 * arguments they need, so custom code is required to
 * prepare the initializer arguments (address and calldata).
 *
 * By convention, the initialize functions are expected to
 * be on the first of a machine's guard contracts rather
 * than a separate contract, for simplicity in deployment
 * configuration.
 *
 * @param experiment
 * @param guards
 * @param tokens
 * @returns {*[]}
 */
function prepareInitializerArgs(experiment, guards, tokens) {

    let initFunction, initInterface, initCallData, initializer;
    let tokenAddresses = tokens && tokens.length ? tokens.map(token => token.contract.address) : [];

    switch (experiment.machine.name) {

        case "LockableDoor":

            // Get the initializer contract
            initializer = guards[0].contract.address;

            // Prepare the calldata
            initFunction = "initialize(address payable)";
            initInterface = new ethers.utils.Interface([`function ${initFunction}`]);
            initCallData = initInterface.encodeFunctionData("initialize", tokenAddresses);
            break;

        default:
            break;
    }

    return [initializer, initCallData];

}

exports.deployExperiment = deployExperiment;
exports.prepareInitializerArgs = prepareInitializerArgs;