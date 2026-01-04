const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Upgrade V2 → V3", function () {
  let token, vault;

  beforeEach(async function () {
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy();

    const TokenVaultV1 = await ethers.getContractFactory("TokenVaultV1");
    vault = await upgrades.deployProxy(
      TokenVaultV1,
      [token.address, 500],
      { kind: "uups" }
    );

    const TokenVaultV2 = await ethers.getContractFactory("TokenVaultV2");
    vault = await upgrades.upgradeProxy(vault.address, TokenVaultV2);
    await vault.initializeV2(300);
  });

  it("should preserve all V2 state after upgrade", async function () {
    const TokenVaultV3 = await ethers.getContractFactory("TokenVaultV3");
    vault = await upgrades.upgradeProxy(vault.address, TokenVaultV3);
    await vault.initializeV3();

    expect(await vault.withdrawFee()).to.equal(300);
    expect(await vault.paused()).to.equal(false);
  });
});
