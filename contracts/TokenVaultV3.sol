// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenVaultV2.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract TokenVaultV3 is TokenVaultV2 {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    function initializeV3() public reinitializer(3) {}

    function withdrawAll() external {
        uint256 bal = balances[msg.sender];
        require(bal > 0, "No balance");

        balances[msg.sender] = 0;
        token.safeTransfer(msg.sender, bal);
    }

    function getVersion()
        public
        pure
        override
        returns (string memory)
    {
        return "V3";
    }
}
