const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Security Tests", function () {
  it("should prevent direct initialization of implementation contracts", async function () {
    const TokenVaultV1 = await ethers.getContractFactory("TokenVaultV1");
    const impl = await TokenVaultV1.deploy();

    await expect(
      impl.initialize(
        ethers.constants.AddressZero,
        100
      )
    ).to.be.reverted;
  });
});
