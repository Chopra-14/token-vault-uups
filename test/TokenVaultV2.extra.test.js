const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenVaultV2 Extra Coverage", function () {
  let token, vaultV1, vaultV2;
  let admin, user;

  beforeEach(async function () {
    [admin, user] = await ethers.getSigners();

    // Deploy mock token (NO constructor args)
    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy();
    await token.deployed();

    // Mint tokens
    await token.mint(user.address, 1000);

    // Deploy V1 via proxy
    const V1 = await ethers.getContractFactory(
      "contracts/TokenVaultV1.sol:TokenVaultV1"
    );

    vaultV1 = await upgrades.deployProxy(V1, [
      token.address,
      admin.address,
      100,
    ]);

    // User deposit
    await token.connect(user).approve(vaultV1.address, 1000);
    await vaultV1.connect(user).deposit(400);

    // Upgrade to V2 WITH reinitializer
    const V2 = await ethers.getContractFactory(
      "contracts/TokenVaultV2.sol:TokenVaultV2"
    );

    vaultV2 = await upgrades.upgradeProxy(vaultV1.address, V2, {
      call: { fn: "initializeV2", args: [] },
    });
  });

  it("preserves user balance after upgrade", async function () {
    const bal = await vaultV2.balances(user.address);
    expect(bal.toString()).to.equal("400");
  });

  it("returns correct version string", async function () {
    expect(await vaultV2.getVersion()).to.equal("V2");
  });

  it("prevents reinitializing V2", async function () {
  let failed = false;

  try {
    await vaultV2.initializeV2();
  } catch (err) {
    failed = true;
  }

  expect(failed).to.equal(true);
});

});
