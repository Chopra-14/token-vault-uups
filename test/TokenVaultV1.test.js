const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenVaultV1", function () {
  let token, vault, admin, user;

  beforeEach(async function () {
    [admin, user] = await ethers.getSigners();

    // MockERC20 has NO constructor args
    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy();
    await token.deployed();

    const V1 = await ethers.getContractFactory(
      "contracts/TokenVaultV1.sol:TokenVaultV1"
    );

    vault = await upgrades.deployProxy(V1, [
      token.address,
      admin.address,
      100,
    ]);

    await vault.deployed();
  });

  it("initializes correctly", async function () {
    expect(await vault.token()).to.equal(token.address);
    expect(await vault.owner()).to.equal(admin.address);
  });

  it("reverts deposit with zero amount", async function () {
    let failed = false;
    try {
      await vault.connect(user).deposit(0);
    } catch (e) {
      failed = true;
    }
    expect(failed).to.equal(true);
  });

  it("allows user to deposit tokens", async function () {
    await token.mint(user.address, 1000);
    await token.connect(user).approve(vault.address, 1000);

    await vault.connect(user).deposit(500);

    expect(
      (await vault.balances(user.address)).toString()
    ).to.equal("500");
  });
});
