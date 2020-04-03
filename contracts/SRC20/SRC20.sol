pragma solidity >=0.4.23 <0.6.0;

import "./ISRC20.sol";
import "../utils/SafeMath.sol";
import "../roles/MinterRole.sol";


contract SRC20 is ISRC20, MinterRole {
    using SafeMath for uint256;

    /* Public variables of the token */
    string public version = 'H1.0';       //human 0.1 standard. Just an arbitrary versioning scheme.

    /* Private variables of the token */
    string internal _name;                  // name of the token.
    string internal _symbol;                // symbol of the token
    uint8 internal _decimals;               // decimals of the token
    uint256 internal _totalSupply;
    mapping (address => uint256) internal _balances;
    mapping (address => mapping (address => uint256)) internal _allowed;

    function name() public view returns (string) {
        return _name;
    }
    function symbol() public view returns (string) {
        return _symbol;
    }
    function decimals() public view returns (uint8) {
        return _decimals;
    }
    function totalSupply() public view returns (uint256 supply) {
        return _totalSupply;
    }

    function balanceOf(address owner) public view returns (uint256 balance) {
        return _balances[owner];
    }

    function allowance(address owner, address spender) public view returns (uint256 remaining) {
      return _allowed[owner][spender];
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool success) {
        require(spender != address(0));

        _allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        _allowed[from][msg.sender] = _allowed[from][msg.sender].sub(value);
        _transfer(from, to, value);
        return true;
    }

    /**
     * @dev Increase the amount of tokens that an owner allowed to a spender.
     * approve should be called when allowed_[_spender] == 0. To increment
     * allowed value is better to use this function to avoid 2 calls (and wait until
     * the first transaction is mined)
     * From MonolithDAO Token.sol
     * @param spender The address which will spend the funds.
     * @param addedValue The amount of tokens to increase the allowance by.
     */
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        require(spender != address(0));

        _allowed[msg.sender][spender] = _allowed[msg.sender][spender].add(addedValue);
        emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
        return true;
    }

    /**
     * @dev Decrease the amount of tokens that an owner allowed to a spender.
     * approve should be called when allowed_[_spender] == 0. To decrement
     * allowed value is better to use this function to avoid 2 calls (and wait until
     * the first transaction is mined)
     * From MonolithDAO Token.sol
     * @param spender The address which will spend the funds.
     * @param subtractedValue The amount of tokens to decrease the allowance by.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        require(spender != address(0));

        _allowed[msg.sender][spender] = _allowed[msg.sender][spender].sub(subtractedValue);
        emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
        return true;
    }

    /**
     * @dev Function to mint tokens
     * @param to The address that will receive the minted tokens.
     * @param value The amount of tokens to mint.
     * @return A boolean that indicates if the operation was successful.
     */
    function mint(address to, uint256 value) public returns (bool) {
        require(isMinter(msg.sender));
        require(to != address(0));

        _totalSupply = _totalSupply.add(value);
        _balances[to] = _balances[to].add(value);
        emit Transfer(address(0), to, value);
        return true;
    }

    /**
     * @dev Burns a specific amount of tokens.
     * @param value The amount of token to be burned.
     */
    function burn(uint256 value) public returns (bool) {
        require(isMinter(msg.sender));

        _burn(msg.sender, value);
        return true;
    }

    /**
     * @dev Burns a specific amount of tokens from the target address and decrements allowance
     * @param from address The address which you want to send tokens from
     * @param value uint256 The amount of token to be burned
     */
    function burnFrom(address from, uint256 value) public returns (bool) {
        require(isMinter(msg.sender));
        require(from != address(0));

        _allowed[from][msg.sender] = _allowed[from][msg.sender].sub(value);
        _burn(from, value);
        return true;
    }

    /**
     * @dev Transfer token for a specified addresses
     * @param from The address to transfer from.
     * @param to The address to transfer to.
     * @param value The amount to be transferred.
     */
    function _transfer(address from, address to, uint256 value) internal {
        require(to != address(0));

        _balances[from] = _balances[from].sub(value);
        _balances[to] = _balances[to].add(value);
        emit Transfer(from, to, value);
    }

    /**
     * @dev Internal function that burns an amount of the token of a given
     * account.
     * @param account The account whose tokens will be burnt.
     * @param value The amount that will be burnt.
     */
    function _burn(address account, uint256 value) internal {
        require(account != address(0));

        _totalSupply = _totalSupply.sub(value);
        _balances[account] = _balances[account].sub(value);
        emit Transfer(account, address(0), value);
    }

    /**
     * make sure this function name matches the contract name above. So if you're token is called TutorialToken, make sure the 
     * contract name above is also TutorialToken instead of SRC20Token
     */
    constructor(string name_, string symbol_, uint8 decimals_, uint256 supply_) public {
        uint256 precision = decimals_;
        supply_ = supply_ * (10 ** precision);

        _name = name_;                                 // Set the name for display purposes
        _decimals = decimals_;                         // Amount of decimals for display purposes
        _symbol = symbol_;                             // Set the symbol for display purposes
        _totalSupply = supply_;                        // Update total supply (100000 for example)
        _balances[msg.sender] = supply_;               // Give the creator all initial tokens (100000 for example)
    }
}
