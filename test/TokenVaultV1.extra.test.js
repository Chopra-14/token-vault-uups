const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenVaultV1 Extra Coverage", function () {
  let token, vault, owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy();
    await token.mint(owner.address, ethers.utils.parseEther("100"));

    const TokenVaultV1 = await ethers.getContractFactory("TokenVaultV1");
    vault = await upgrades.deployProxy(
      TokenVaultV1,
      [token.address, 100],
      { initializer: "initialize" }
    );
  });

  it("reverts deposit with zero amount", async () => {
    await expect(vault.deposit(0)).to.be.revertedWith("Amount must be > 0");
  });
});
