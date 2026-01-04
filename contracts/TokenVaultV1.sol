// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract TokenVaultV1 is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    IERC20Upgradeable public token;
    uint256 public depositFee;
    mapping(address => uint256) public balances;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _token, uint256 _depositFee)
        public
        initializer
    {
        __Ownable_init();
        __UUPSUpgradeable_init();

        token = IERC20Upgradeable(_token);
        depositFee = _depositFee;
    }

    /// 🔑 MUST be virtual
    function deposit(uint256 amount) public virtual {
        require(amount > 0, "Amount must be > 0");

        uint256 fee = (amount * depositFee) / 10_000;
        uint256 net = amount - fee;

        balances[msg.sender] += net;
        token.safeTransferFrom(msg.sender, address(this), amount);
    }

    function getDepositFee() external view returns (uint256) {
        return depositFee;
    }

    function _authorizeUpgrade(address)
        internal
        override
        onlyOwner
    {}
}
