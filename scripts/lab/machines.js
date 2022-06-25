/**
 * Machine definitions
 *
 * You can add your own Machines to this file and deploy them with the same apparatus.
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */

const { nameToId } = require('fismo/sdk/node');

//--------------------------------------------------------------------------------------------------------------------
// Machine definitions
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
exports.NightClubMachine = {
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

// STOPWATCH MACHINE - See /contracts/lab/StopWatch
exports.StopWatchMachine = {
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

// LOCKABLE DOOR MACHINE - See /contracts/lab/LockableDoor
exports.LockableDoorMachine = {
  "name": "LockableDoor",
  "initialStateId":  nameToId("Closed"),
  "uri": "ipfs://bafkreidesmqwxqjsrc7i2ef7odriel6ovm5ifriybpfh53tyecfd52ow5y",
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