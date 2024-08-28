// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZeekCraftToken is ERC20 {
    address public owner;
    address public zeekCraftContract;

    modifier onlyOwnerOrZeekCraft() {
        require(msg.sender == owner || msg.sender == zeekCraftContract, "Not authorized");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() ERC20("ZeekCraft Token", "ZCT") {
        owner = msg.sender;
    }

    function setZeekCraftContract(address _zeekCraftContract) external onlyOwner {
        zeekCraftContract = _zeekCraftContract;
    }

    function mint(address to, uint256 amount) external onlyOwnerOrZeekCraft returns (bool) {
        _mint(to, amount);
        return true;
    }
}
