const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenVaultV3 Extra Coverage", function () {
  let token, vaultV1, vaultV2, vaultV3;
  let admin, user, attacker;

  beforeEach(async function () {
    [admin, user, attacker] = await ethers.getSigners();

    // Mock ERC20 (NO constructor args)
    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy();
    await token.deployed();

    await token.mint(user.address, 1000);

    // V1
    const V1 = await ethers.getContractFactory(
      "contracts/TokenVaultV1.sol:TokenVaultV1"
    );

    vaultV1 = await upgrades.deployProxy(V1, [
      token.address,
      admin.address,
      100,
    ]);

    await token.connect(user).approve(vaultV1.address, 1000);
    await vaultV1.connect(user).deposit(400);

    // V2
    const V2 = await ethers.getContractFactory(
      "contracts/TokenVaultV2.sol:TokenVaultV2"
    );

    vaultV2 = await upgrades.upgradeProxy(vaultV1.address, V2, {
      call: { fn: "initializeV2", args: [] },
    });

    // V3
    const V3 = await ethers.getContractFactory(
      "contracts/TokenVaultV3.sol:TokenVaultV3"
    );

    vaultV3 = await upgrades.upgradeProxy(vaultV2.address, V3, {
      call: { fn: "initializeV3", args: [] },
    });
  });

  it("prevents reinitializing V3", async function () {
    let failed = false;

    try {
      await vaultV3.initializeV3();
    } catch (err) {
      failed = true;
    }

    expect(failed).to.equal(true);
  });

  it("prevents unauthorized upgrade attempts", async function () {
    const V3 = await ethers.getContractFactory(
      "contracts/TokenVaultV3.sol:TokenVaultV3"
    );

    let failed = false;

    try {
      await upgrades.upgradeProxy(vaultV3.address, V3.connect(attacker));
    } catch (err) {
      failed = true;
    }

    expect(failed).to.equal(true);
  });
});
