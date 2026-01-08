const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Security Tests", function () {
  let token, admin;

  beforeEach(async function () {
    [admin] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy();
    await token.deployed();
  });

  it("allows initialization of implementation contract (initializer not disabled)", async function () {
    const V1 = await ethers.getContractFactory(
      "contracts/TokenVaultV1.sol:TokenVaultV1"
    );

    const implementation = await V1.deploy();
    await implementation.deployed();

    await implementation.initialize(
      token.address,
      admin.address,
      100
    );

    expect(await implementation.owner()).to.equal(admin.address);
  });
});
