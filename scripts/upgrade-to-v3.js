const { ethers, upgrades } = require("hardhat");

async function main() {
  const PROXY_ADDRESS = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"; // proxy

  console.log("Upgrading TokenVault to V3...");
  console.log("Proxy address:", PROXY_ADDRESS);

  const TokenVaultV3 = await ethers.getContractFactory("TokenVaultV3");

  const upgraded = await upgrades.upgradeProxy(
    PROXY_ADDRESS,
    TokenVaultV3,
    {
      kind: "uups",
      unsafeAllow: ["constructor"],
    }
  );

  // 🔥 PASS REQUIRED ARGUMENT HERE
  const WITHDRAWAL_DELAY = 3600; // 1 hour (same as tests)
  const tx = await upgraded.initializeV3(WITHDRAWAL_DELAY);
  await tx.wait();

  console.log("Upgrade to V3 complete");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
