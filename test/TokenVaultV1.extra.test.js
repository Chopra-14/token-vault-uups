const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenVaultV1 Extra Coverage", function () {
  let token, vault, admin, user;

  beforeEach(async function () {
    [admin, user] = await ethers.getSigners();

    // Deploy MockERC20 (NO constructor args)
    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy();
    await token.deployed();

    // Deploy Vault V1 via proxy
    const Vault = await ethers.getContractFactory(
      "contracts/TokenVaultV1.sol:TokenVaultV1"
    );

    vault = await upgrades.deployProxy(Vault, [
      token.address,
      admin.address,
      100,
    ]);

    // Mint + approve
    await token.mint(user.address, 1000);
    await token.connect(user).approve(vault.address, 1000);
  });

  it("reverts deposit with zero amount", async function () {
    let failed = false;

    try {
      await vault.connect(user).deposit(0);
    } catch (err) {
      failed = true;
    }

    expect(failed).to.equal(true);
  });

  it("updates user balance correctly after deposit", async function () {
    await vault.connect(user).deposit(400);

    const balance = await vault.balances(user.address);
    expect(balance.toString()).to.equal("400");
  });

  it("allows multiple deposits from same user", async function () {
    await vault.connect(user).deposit(200);
    await vault.connect(user).deposit(300);

    const balance = await vault.balances(user.address);
    expect(balance.toString()).to.equal("500");
  });
});
