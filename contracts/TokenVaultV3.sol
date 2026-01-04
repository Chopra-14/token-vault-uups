// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenVaultV2.sol";

contract TokenVaultV3 is TokenVaultV2 {
    bool public paused;

    function initializeV3() public reinitializer(3) {
        paused = false;
    }

    function pause() external onlyOwner {
        paused = true;
    }

    function unpause() external onlyOwner {
        paused = false;
    }

    function deposit(uint256 amount)
        public
        override
    {
        require(!paused, "Paused");
        super.deposit(amount);
    }

    function withdraw(uint256 amount)
        public
        override
    {
        require(!paused, "Paused");
        super.withdraw(amount);
    }
}
