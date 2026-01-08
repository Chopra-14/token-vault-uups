const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenVaultV3 Coverage", function () {
  let token, vaultV1, vaultV2, vaultV3;
  let admin, user;

  beforeEach(async function () {
    [admin, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy();
    await token.deployed();

    await token.mint(user.address, 1000);

    // ---------- V1 ----------
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

    // ---------- V2 ----------
    const V2 = await ethers.getContractFactory(
      "contracts/TokenVaultV2.sol:TokenVaultV2"
    );

    vaultV2 = await upgrades.upgradeProxy(vaultV1.address, V2, {
      call: { fn: "initializeV2", args: [] },
    });

    // ---------- V3 ----------
    const V3 = await ethers.getContractFactory(
      "contracts/TokenVaultV3.sol:TokenVaultV3"
    );

    vaultV3 = await upgrades.upgradeProxy(vaultV2.address, V3, {
      call: { fn: "initializeV3", args: [] },
    });
  });

  it("preserves balance after V3 upgrade", async function () {
    const bal = await vaultV3.balances(user.address);

    // ✅ STRING comparison (100% reliable)
    expect(bal.toString()).to.equal("400");
  });

  it("withdraw works in V3", async function () {
    await vaultV3.connect(user).withdrawAll();

    const userBalance = await token.balanceOf(user.address);

    // ✅ STRING comparison
    expect(userBalance.toString()).to.equal("1000");
  });

  it("returns correct version string", async function () {
    expect(await vaultV3.getVersion()).to.equal("V3");
  });
});
