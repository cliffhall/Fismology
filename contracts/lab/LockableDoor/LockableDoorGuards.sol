// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

/**
 * @notice KeyToken is the Fismo ERC-20, which we only check for a balance of
 */
interface KeyToken {
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @notice Lockable Door Guard Logic
 *
 * - Machine: LockableDoor
 * - Init: Validate and store key token address
 * - States guarded: Locked
 * - Transition Guards: Exit
 * - Action Filter: Suppress 'Unlock' action if user doesn't have key
 */
contract LockableDoorGuards {

    event LockableDoorInitialized(address keyToken);

    // -------------------------------------------------------------------------
    // MACHINE STORAGE
    // -------------------------------------------------------------------------

    // Unique storage slot id
    bytes32 internal constant LOCKABLE_DOOR_SLOT = keccak256("LockableDoor.Storage");

    // Storage slot structure
    struct LockableDoorSlot {

        // Address of the key contract
        KeyToken keyToken;

    }

    // Getter for the storage slot
    function lockableDoorSlot() internal pure returns (LockableDoorSlot storage lds) {
        bytes32 position = LOCKABLE_DOOR_SLOT;
        assembly {
            lds.slot := position
        }
    }

    // -------------------------------------------------------------------------
    // MACHINE INITIALIZER
    // -------------------------------------------------------------------------

    /**
     * @notice Machine Initializer
     *
     * @param _keyToken - The token contract where a non-zero balance represents a key
     */
    function initialize(address _keyToken)
    external
    {
        // Initialize key token
        lockableDoorSlot().keyToken = KeyToken(_keyToken);

        // Notify listeners about state change
        emit LockableDoorInitialized(_keyToken);
    }

    // -------------------------------------------------------------------------
    // ACTION FILTER
    // -------------------------------------------------------------------------

    // Filter actions contextually
    function LockableDoor_Locked_Filter(address _user, string calldata _action)
    external
    view
    returns(bool suppress)
    {
        // User must have key to unlock door
        bool hasKey = isKeyHolder(_user);

        // For unlock action only, suppress if user does not have key
        suppress = (
            keccak256(abi.encodePacked(_action)) ==
            keccak256(abi.encodePacked("Unlock"))
        ) ? !(hasKey) : false;
    }

    // -------------------------------------------------------------------------
    // TRANSITION GUARDS
    // -------------------------------------------------------------------------

    // Locked / Exit
    // Valid next states: Closed
    function LockableDoor_Locked_Exit(address _user, string calldata _action, string calldata _nextStateName)
    external
    view
    returns(string memory)
    {
        // User must have key to unlock door
        bool hasKey = isKeyHolder(_user);
        require(hasKey, "A key token is required to open the door.");

        // Success response message
        return "Door unlocked.";

    }

    // -------------------------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------------------------

    /**
     * @notice Determine if user holds the key
     *
     * @param _user - the user to check
     *
     * @return true if the user holds a balance of the key token
     */
    function isKeyHolder(address _user)
    internal
    view
    returns (bool)
    {
        return lockableDoorSlot().keyToken.balanceOf(_user) > 0;
    }

}