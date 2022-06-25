/**
 * Experiment descriptors.
 *
 * You can add your own Machines to this file and deploy them with the same apparatus.
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */

const { NightClubMachine, StopWatchMachine, LockableDoorMachine } = require('./machines');
const { LockableDoorMetadata } = require('./metadata');

//--------------------------------------------------------------------------------------------------------------------
// Export Experiment Descriptors
//
// Plain objects that have the following properties:
//
// machine     - a valid Machine entity description                       (required, defined above)
// metadata    - the metadata for this machine                            (optional)
// operator    - a deployable operator contract name                      (optional, or Operator clone will be used)
// guards      - an array of plain objects with the following properties: (required)
//               states       - an array of guarded state names           (required)
//               contractName - the associated guard contract name        (required)
// initializer - a plain object with the following properties:            (optional)
//               contractName - the name of the contract to initialize    (required)
//               signature    - the signature of the initializer method   (required)
// tokens      - an array of token contract names to install              (optional)
//--------------------------------------------------------------------------------------------------------------------

// NIGHTCLUB EXPERIMENT
// FSM Models: A map with states representing locations and transitions as their interconnections
// Experiment: Crawler with Transition-specific messages as narration and State-specific guard contracts
exports.NightClubExperiment = {
    machine: NightClubMachine,
    operator: "NightClubOperator",
    guards: [
      {states: ["Bar"], contractName: "BarGuards"},
      {states: ["Cab"], contractName: "CabGuards"},
      {states: ["Dancefloor"], contractName: "DancefloorGuards"},
      {states: ["Foyer"], contractName: "FoyerGuards"},
      {states: ["Restroom"], contractName: "RestroomGuards"},
      {states: ["Street"], contractName: "StreetGuards"},
      {states: ["VIP_Lounge"], contractName: "VIPLoungeGuards"},
    ],
};

// STOPWATCH EXPERIMENT
// FSM Models: A stateful electronic device
// Experiment: Machine-specific storage using the Diamond Storage pattern
//             See https://dev.to/mudgen/how-diamond-storage-works-90e
exports.StopWatchExperiment = {
  machine: StopWatchMachine,
  guards: [
    {
      states: ["Ready", "Running", "Paused"],
      contractName: "StopWatchGuards"
    },
  ]
};

// LOCKABLE DOOR EXPERIMENT
// FSM Models: A stateful physical system
// Experiment: Token-gated state transitions, custom initializer, Machine-specific storage
exports.LockableDoorExperiment = {
  machine: LockableDoorMachine,
  metadata: LockableDoorMetadata,
  tokens:  ["Fismo20"],
  initializer: {
    contractName: "LockableDoorGuards",
    signature: "initialize(address)"
  },
  guards: [
    {
      states: ["Locked"],
      contractName: "LockableDoorGuards"
    },
  ]
};