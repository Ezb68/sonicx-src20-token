pragma solidity >=0.4.23 <0.6.0;

interface IMint {

    function mint(address to, uint256 value) external returns (bool);
    function burn(uint256 value) external returns (bool);
    function burnFrom(address from, uint256 value) external returns (bool);

}
