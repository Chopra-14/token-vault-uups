const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenVaultV1", function () {
  let token, vault, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

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
  });

  it("should initialize with correct parameters", async function () {
    expect(await vault.token()).to.equal(token.address);
    expect(await vault.getDepositFee()).to.equal(500);
  });
});
