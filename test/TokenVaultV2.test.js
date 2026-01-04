const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenVaultV2 Basic Test", function () {
  it("deploys and upgrades correctly", async function () {
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token = await MockERC20.deploy();

    const TokenVaultV1 = await ethers.getContractFactory("TokenVaultV1");
    const proxy = await upgrades.deployProxy(
      TokenVaultV1,
      [token.address, 100],
      { initializer: "initialize" }
    );

    const TokenVaultV2 = await ethers.getContractFactory("TokenVaultV2");
    const v2 = await upgrades.upgradeProxy(proxy.address, TokenVaultV2);

    expect(await v2.depositFee()).to.equal(100);
  });
});
