const { ethers, upgrades } = require("hardhat");

const PROXY_ADDRESS = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";

async function main() {
  console.log("Upgrading TokenVault to V2...");
  console.log("Proxy address:", PROXY_ADDRESS);

  const TokenVaultV2 = await ethers.getContractFactory("TokenVaultV2");

  const upgraded = await upgrades.upgradeProxy(
    PROXY_ADDRESS,
    TokenVaultV2,
    {
      unsafeAllow: ["constructor"],
    }
  );

  await upgraded.deployed();
  console.log("Upgrade to V2 complete");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
