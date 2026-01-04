const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenVaultV2 Extra Coverage", function () {
  let token, vault;

  beforeEach(async () => {
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy();

    const TokenVaultV1 = await ethers.getContractFactory("TokenVaultV1");
    const proxy = await upgrades.deployProxy(
      TokenVaultV1,
      [token.address, 100],
      { initializer: "initialize" }
    );

    const TokenVaultV2 = await ethers.getContractFactory("TokenVaultV2");
    vault = await upgrades.upgradeProxy(proxy.address, TokenVaultV2);

    await vault.initializeV2(50);
  });

  it("prevents reinitializing V2", async () => {
    await expect(vault.initializeV2(10)).to.be.reverted;
  });
});
