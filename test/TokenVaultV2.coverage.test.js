const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenVaultV2 Coverage", function () {
  let token, vault, user;

  beforeEach(async function () {
    [, user] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy();
    await token.mint(user.address, ethers.utils.parseEther("100"));

    const TokenVaultV1 = await ethers.getContractFactory("TokenVaultV1");
    const proxy = await upgrades.deployProxy(
      TokenVaultV1,
      [token.address, 100],
      { initializer: "initialize" }
    );

    const TokenVaultV2 = await ethers.getContractFactory("TokenVaultV2");
    vault = await upgrades.upgradeProxy(proxy.address, TokenVaultV2);
    await vault.initializeV2(50);

    await token.connect(user).approve(
      vault.address,
      ethers.utils.parseEther("100")
    );

    await vault.connect(user).deposit(
      ethers.utils.parseEther("10")
    );
  });

  it("withdraw works", async function () {
    await vault.connect(user).withdraw(
      ethers.utils.parseEther("5")
    );
  });

  it("withdraw zero reverts", async function () {
    await expect(
      vault.connect(user).withdraw(0)
    ).to.be.reverted;
  });
});
