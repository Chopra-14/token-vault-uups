const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenVaultV3 Extra Coverage", function () {
  let token, vault;

  beforeEach(async () => {
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy();

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
  });

  it("prevents reinitializing V3", async () => {
    await expect(vault.initializeV3()).to.be.reverted;
  });
});
