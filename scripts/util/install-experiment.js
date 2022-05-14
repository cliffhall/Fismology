const hre = require("hardhat");
const ethers = hre.ethers;
const eip55 = require("eip55");

const { Machine } = require("fismo/sdk/node");
const { deployTokens } = require('./deploy-tokens');
const { deployTransitionGuards } = require('./deploy-guards');

// Get the official deployments
const {Deployments} = require("fismo/sdk/node/");

// Get the Fismo ABI from the SDK
const FismoABI = require('fismo/sdk/fismo-abi.json');
const {getEvent} = require("./tx-utils");

/**
 * Install an experiment
 *
 * @param owner - the owner address
 * @param fismoAddress - the fismo contract address
 * @param experiment - the experiment descriptor. See experiments.js for format.
 * @param gasLimit - gasLimit for transactions
 *
 * @returns {Promise<(*|*|*)[]>}
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
async function installExperiment(owner, myDeployments, experiment, gasLimit) {

    // Get owner's Fismo instance
    const fismo = await ethers.getContractAt(FismoABI.IFismoUpdate, myDeployments?.Fismo);

    // Create and validate the machine
    const machine = Machine.fromObject(experiment.machine);

    // Deploy operator, guards, and add machine to Fismo
    if (machine.isValid()) {

        const operatorArgs = [deployments?.Fismo];
        let operator, operatorAddress;

        // Deploy explicitly defined experiment operators
        if (experiment.operator) {

            // Deploy experiment operator
            const Operator = await ethers.getContractFactory(experiment.operator);
            operator = await Operator.deploy(...operatorArgs, {gasLimit});
            await operator.deployed();

            // Update machine with operator address
            machine.operator = operator.address;

        // Or use owner's existing Operator instance if configured
        } else if (eip55.verify(myDeployments?.Operator)) {

            // Get owner's already cloned operator
            operatorAddress = myDeployments.Operator;
            operator = await ethers.getContractAt(FismoABI.Operator, operatorAddress);

        // Otherwise, clone official Operator
        } else {

            // Get the official Operator deployment address for this chain
            operatorAddress = Deployments[chain.name]?.Operator;
            operator = await ethers.getContractAt(FismoABI.Operator, operatorAddress);

            // Clone Operator
            const tx = await operator.connect(owner).cloneOperator(fismoAddress);
            const txReceipt = await tx.wait();
            const event = getEvent(txReceipt, operator, "OperatorCloned");
            //console.log(`🧪 Your Operator Clone: ${event.clone}`);

            // Now point to clone as operator
            const operatorAddress = event.clone;
            operator = await ethers.getContractAt(FismoABI.Operator, operatorAddress);

            // Update machine with operator address
            machine.operator = operator.address;
        }

        // Deploy transition guards
        const guards = await deployTransitionGuards(experiment, gasLimit);

        // Add guard addresses to their associated states
        for (const guard of guards) {
            guard.states.forEach(stateName => {
                let state = machine.getState(stateName);
                state.guardLogic = guard.contract.address
            })
        }

        // If there is an initializer defined, deploy
        let tokens = [];
        if (experiment.initializer) {

            if (experiment.tokens) {
                // Deploy the requested tokens; experiment initializers will need one or more of them
                tokens = await deployTokens(experiment.tokens, gasLimit);
            }
            // Get experiment-specific initialization args (initializer contract and calldata)
            const initArgs = prepareInitializerArgs(experiment, guards, tokens);

            // Install and initialize the machine
            await fismo.installAndInitializeMachine(machine.toObject(), ...initArgs);

        } else {

            // Just install the machine
            await fismo.installExperiment(machine.toObject());

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

    switch (experiment.machine.name) {

        case "LockableDoor":

            // Get the initializer contract
            initializer = guards[0].contract.address;

            // Prepare the calldata
            initFunction = "initialize(address payable)";
            initInterface = new ethers.utils.Interface([`function ${initFunction}`]);
            initCallData = initInterface.encodeFunctionData("initialize", tokens);
            break;

        default:
            break;
    }

    return [initializer, initCallData];

}

exports.deployExperiment = installExperiment;
exports.prepareInitializerArgs = prepareInitializerArgs;