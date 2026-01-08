// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

pragma solidity ^0.8.20;

import "./TokenVaultV1.sol";

contract TokenVaultV2 is TokenVaultV1 {
    function initializeV2() public reinitializer(2) {}
    using SafeERC20 for IERC20Upgradeable;

    function getVersion() public pure virtual override returns (string memory) {
    return "V2";
}

}
