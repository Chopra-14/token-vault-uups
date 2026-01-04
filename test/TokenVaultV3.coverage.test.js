const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenVaultV3 Coverage", function () {
  let token, vault, user;

  beforeEach(async function () {
    [, user] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy();
    await token.mint(user.address, ethers.utils.parseEther("100"));

    const TokenVaultV1 = await ethers.getContractFactory("TokenVaultV1");
    let proxy = await upgrades.deployProxy(
      TokenVaultV1,
      [token.address, 100],
      { initializer: "initialize" }
    );

    const TokenVaultV2 = await ethers.getContractFactory("TokenVaultV2");
    proxy = await upgrades.upgradeProxy(proxy.address, TokenVaultV2);
    await proxy.initializeV2(50);

    const TokenVaultV3 = await ethers.getContractFactory("TokenVaultV3");
    vault = await upgrades.upgradeProxy(proxy.address, TokenVaultV3);
    await vault.initializeV3();

    await token.connect(user).approve(
      vault.address,
      ethers.utils.parseEther("100")
    );

    await vault.connect(user).deposit(
      ethers.utils.parseEther("20")
    );
  });

  it("withdraw works in V3", async function () {
    await vault.connect(user).withdraw(
      ethers.utils.parseEther("5")
    );
  });
});




