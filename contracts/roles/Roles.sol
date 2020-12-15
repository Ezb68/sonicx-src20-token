pragma solidity >=0.4.23;

contract Roles {

    mapping (address => bool) private bearer;

    /**
     * @dev give an account access to this role
     */
    function add(address account) internal {
        require(account != address(0));

        bearer[account] = true;
    }

    /**
     * @dev remove an account's access to this role
     */
    function remove(address account) internal {
        require(account != address(0));

        bearer[account] = false;
    }

    /**
     * @dev check if an account has this role
     * @return bool
     */
    function has(address account) internal view returns (bool) {
        require(account != address(0));
        
        return bearer[account];
    }
}
