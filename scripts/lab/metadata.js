/**
 * Machine metadata definitions
 *
 * You can add your own to this file and deploy them with the same apparatus.
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */

const { nameToId } = require('fismo/sdk/node');

//--------------------------------------------------------------------------------------------------------------------
// Machine metadata definitions
//
// Plain JSON object with the following properties:
//
// name            - machine name as installed in Fismo.                                                  (required)
// id              - machine id                                                                           (required)
// title           - short text title of the machine or project                                           (optional)
// description     - long text description of the machine or project                                      (optional)
// external_url    - link to page about the machine or project                                            (optional)
// image           - link to an image representing the machine or project                                 (optional)
// states          - array of objects with the following properties corresponding to the machine's states (optional)
//                   name            - state name as installed in Fismo                                   (required)
//                   id              - state id                                                           (required)
//                   title           - short text title of the state                                      (optional)
//                   description     - longer text description of the state                               (optional)
//                   image           - link to an image representing the machine or project               (optional)
//--------------------------------------------------------------------------------------------------------------------

// LOCKABLE DOOR METADATA - See /contracts/lab/LockableDoor
exports.LockableDoorMetadata = {
  "name": "LockableDoor",
  "id": nameToId("LockableDoor"),
  "title": "Lockable Door - A Fismo Experiment",
  "description": "Representing a physical system with Fismo. Uses an ERC20 to represent a key for unlocking the door.",
  "external_url": "https://lab.fismo.xyz/experiment/lockable-door.html",
  "image": "https://lab.fismo.xyz/experiment/images/machine.png",
  "states": [
    {
      "name": "Closed",
      "id": nameToId("Closed"),
      "title": "A Closed Door",
      "description": "The door is currently closed. It can be locked or opened.",
      "image": "https://lab.fismo.xyz/experiment/images/LockableDoor/Closed.png",
    },
    {
      "name": "Locked",
      "id": nameToId("Locked"),
      "title": "A Locked Door",
      "description": "The door is currently locked. You must have a key to open.",
      "image": "https://lab.fismo.xyz/experiment/images/LockableDoor/Locked.png",
    },
    {
      "name": "Opened",
      "id": nameToId("Opened"),
      "title": "An Opened Door",
      "description": "The door is currently opened. Outside, a field of flowers can be seen.",
      "image": "https://lab.fismo.xyz/experiment/images/LockableDoor/Opened.png",
    }
  ]
};