/**
 * Machine definitions and Experiment descriptors.
 *
 * You can add your own Machines to this file and deploy them with the same apparatus.
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */

// Workaday imports
const { nameToId } = require('fismo/sdk/node');

//--------------------------------------------------------------------------------------------------------------------
// Define Machines
//
// Plain object with the following properties:
//
// name            - machine name. begin with letter, no spaces, a-z, A-Z, 0-9, and _   (required)
// initialStateId  - keccak256 hash of initial state name                               (required)
// uri             - off-chain URI of metadata describing the machine                   (optional)
// states          - an array of plain objects representing State entities              (required)
//
// Note: operator property of Machine is omitted, and will be replaced at deployment time with the address
//
// See Machine https://docs.fismo.xyz/domain/Machine.html
//--------------------------------------------------------------------------------------------------------------------

// NIGHTCLUB MACHINE - See /contracts/lab/NightClub
const NightClubMachine = {
  "name": "NightClub",
  "initialStateId": nameToId("Home"),
  "uri": "ipfs://",
  "states": [
    {
      "name": "Bar",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Boogie down",
          "targetStateName": "Dancefloor",
        },
        {
          "action": "Head out",
          "targetStateName": "Foyer",
        },
        {
          "action": "Freshen up",
          "targetStateName": "Restroom",
        },
        {
          "action": "Go chill with the fabulous people",
          "targetStateName": "VIP_Lounge",
        }
      ]
    },
    {
      "name": "Cab",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Pay the driver and go party",
          "targetStateName": "Street",
        },
        {
          "action": "Pay the driver and go get a shower",
          "targetStateName": "Home",
        }
      ]
    },
    {
      "name": "Dancefloor",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Grab a drink",
          "targetStateName": "Bar",
        },
        {
          "action": "Head out",
          "targetStateName": "Foyer",
        },
        {
          "action": "Freshen up",
          "targetStateName": "Restroom",
        },
        {
          "action": "Go chill with the fabulous people",
          "targetStateName": "VIP_Lounge",
        }
      ]
    },
    {
      "name": "Foyer",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Boogie down",
          "targetStateName": "Dancefloor",
        },
        {
          "action": "Hit the road",
          "targetStateName": "Street",
        },
        {
          "action": "Grab a drink",
          "targetStateName": "Bar",
        },
        {
          "action": "Freshen up",
          "targetStateName": "Restroom",
        },
        {
          "action": "Go chill with the fabulous people",
          "targetStateName": "VIP_Lounge",
        }
      ]
    },
    {
      "name": "Home",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Go to the club",
          "targetStateName": "Cab",
        }
      ]
    },
    {
      "name": "Restroom",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Boogie down",
          "targetStateName": "Dancefloor",
        },
        {
          "action": "Hit the road",
          "targetStateName": "Street",
        },
        {
          "action": "Grab a drink",
          "targetStateName": "Bar",
        },
        {
          "action": "Go chill with the fabulous people",
          "targetStateName": "VIP_Lounge",
        }
      ]
    },
    {
          "name": "Street",
          "enterGuarded": true,
          "exitGuarded": true,
          "transitions": [
            {
              "action": "Hail a cab",
              "targetStateName": "Cab",
            },
            {
              "action": "Enter the club",
              "targetStateName": "Foyer",
            }
          ]
        },
    {
      "name": "VIP_Lounge",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Boogie down",
          "targetStateName": "Dancefloor",
        },
        {
          "action": "Hit the road",
          "targetStateName": "Street",
        },
        {
          "action": "Grab a drink",
          "targetStateName": "Bar",
        },
        {
          "action": "Freshen up",
          "targetStateName": "Restroom",
        }
      ]
    }
  ]
};

// STOPWATCH MACHINE - See /contracts/lab/NightClub
const StopWatchMachine = {
  "name": "StopWatch",
  "initialStateId":  nameToId("Ready"),
  "uri": "ipfs://",
  "states": [
    {
      "name": "Ready",
      "enterGuarded": true,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Start",
          "targetStateName": "Running",
        }
      ]
    },
    {
      "name": "Running",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Stop",
          "targetStateName": "Paused",
        },
      ]
    },
    {
      "name": "Paused",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Start",
          "targetStateName": "Running"
        },
        {
          "action": "Reset",
          "targetStateName": "Ready",
        }
      ]
    },
  ]
};

// NIGHTCLUB MACHINE - See /contracts/lab/LockableDoor
const LockableDoorMachine = {
  "name": "LockableDoor",
  "initialStateId":  nameToId("Closed"),
  "uri": "ipfs://",
  "states": [
    {
      "name": "Closed",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Open",
          "targetStateName": "Opened",
        },
        {
          "action": "Lock",
          "targetStateName": "Locked",
        }
      ]
    },
    {
      "name": "Locked",
      "enterGuarded": false,
      "exitGuarded": true,
      "transitions": [
        {
          "action": "Unlock",
          "targetStateName": "Closed",
        },
      ]
    },
    {
      "name": "Opened",
      "enterGuarded": false,
      "exitGuarded": false,
      "transitions": [
        {
          "action": "Close",
          "targetStateName": "Closed"
        }
      ]
    },
  ]
};

//--------------------------------------------------------------------------------------------------------------------
// Export Experiment Descriptors
//
// Plain objects that have the following properties:
//
// machine     - a valid Machine entity description                       (required, defined above)
// operator    - a deployable operator contract name                      (optional, or Operator will be cloned)
// guards      - an array of plain objects with the following properties: (required)
//               states       - an array of guarded state names           (required)
//               contractName - the associated guard contract name        (required)
// initializer - a plain object with the following properties:            (optional)
//               contractName - the name of the contract to initialize    (required)
//               signature    - the signature of the initializer method   (required)
// tokens      - an array of token contract names to install              (optional)
//--------------------------------------------------------------------------------------------------------------------

// NIGHTCLUB MACHINE
// FSM Models: A map with states representing locations and transitions as their interconnections
// Experiment: Crawler with Transition-specific messages as narration and State-specific guard contracts
exports.NightClub = {
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

// STOPWATCH MACHINE
// FSM Models: A stateful electronic device
// Experiment: Machine-specific storage using the Diamond Storage pattern
//             See https://dev.to/mudgen/how-diamond-storage-works-90e
exports.StopWatch = {
  machine: StopWatchMachine,
  guards: [
    {
      states: ["Ready", "Running", "Paused"],
      contractName: "StopWatchGuards"
    },
  ]
};

// LOCKABLE DOOR MACHINE
// FSM Models: A stateful physical system
// Experiment: Token-gated state transitions, custom initializer, Machine-specific storage
exports.LockableDoor = {
  machine: LockableDoorMachine,
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