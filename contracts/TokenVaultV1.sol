// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

contract TokenVaultV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    IERC20Upgradeable public token;
    mapping(address => uint256) public balances;
    uint256 public depositFee;

    function initialize(
        address _token,
        address _admin,
        uint256 _depositFee
    ) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();

        _transferOwnership(_admin);

        token = IERC20Upgradeable(_token);
        depositFee = _depositFee;
    }

    function deposit(uint256 amount) public virtual {
        require(amount > 0, "Amount must be > 0");
        token.transferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
    }

    function getVersion() public pure virtual returns (string memory) {
        return "V1";
    }

    function _authorizeUpgrade(address)
        internal
        override
        onlyOwner
    {}
}
