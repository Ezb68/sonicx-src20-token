pragma solidity >=0.4.23;

import "./Roles.sol";

contract MinterRole is Roles {

    event MinterAdded(address indexed account);
    event MinterRemoved(address indexed account);

    constructor () internal {
        add(msg.sender);
    }

    function isMinter(address account) public view returns (bool) {
        return has(account);
    }

    function addMinter(address account) public {
        require(has(msg.sender));

        add(account);
        emit MinterAdded(account);
    }

    function renounceMinter() public {
        remove(msg.sender);
        emit MinterRemoved(msg.sender);
    }
}
