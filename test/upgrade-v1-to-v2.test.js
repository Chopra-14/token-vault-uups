const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Upgrade V1 → V2", function () {
  let token, vault, user;

  beforeEach(async function () {
    [, user] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy();
    await token.mint(
      user.address,
      ethers.utils.parseEther("1000")
    );

    const TokenVaultV1 = await ethers.getContractFactory("TokenVaultV1");
    vault = await upgrades.deployProxy(
      TokenVaultV1,
      [token.address, 500],
      { kind: "uups" }
    );

    await token.connect(user).approve(
      vault.address,
      ethers.utils.parseEther("100")
    );

    await vault.connect(user).deposit(
      ethers.utils.parseEther("100")
    );
  });

  it("should preserve user balances after upgrade", async function () {
    const TokenVaultV2 = await ethers.getContractFactory("TokenVaultV2");
    vault = await upgrades.upgradeProxy(vault.address, TokenVaultV2);

    await vault.initializeV2(300);

    expect(await vault.withdrawFee()).to.equal(300);
    expect(await vault.balances(user.address)).to.equal(
      ethers.utils.parseEther("95")
    );
  });
});
