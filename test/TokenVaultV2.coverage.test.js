const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenVaultV2 Coverage", function () {
  let token, vaultV1, vaultV2;
  let admin, user;

  beforeEach(async function () {
    [admin, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy();
    await token.deployed();

    await token.mint(user.address, 1000);

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

    const V2 = await ethers.getContractFactory(
      "contracts/TokenVaultV2.sol:TokenVaultV2"
    );

    vaultV2 = await upgrades.upgradeProxy(vaultV1.address, V2, {
      call: { fn: "initializeV2", args: [] },
    });
  });

  it("preserves balance after upgrade", async function () {
    expect((await vaultV2.balances(user.address)).toNumber()).to.equal(400);
  });

  it("returns correct version string", async function () {
    expect(await vaultV2.getVersion()).to.equal("V2");
  });
});
