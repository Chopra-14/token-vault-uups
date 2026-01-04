// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenVaultV1.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract TokenVaultV2 is TokenVaultV1 {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    uint256 private _withdrawFee;

    function initializeV2(uint256 withdrawFee_)
        public
        reinitializer(2)
    {
        _withdrawFee = withdrawFee_;
    }

    function withdraw(uint256 amount) public virtual {
        require(amount > 0, "Amount must be > 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;

        uint256 fee = (amount * _withdrawFee) / 10_000;
        uint256 net = amount - fee;

        token.safeTransfer(msg.sender, net);
    }

    function withdrawFee() external view returns (uint256) {
        return _withdrawFee;
    }
}
