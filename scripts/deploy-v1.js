const { ethers, upgrades } = require("hardhat");

async function main() {
  const [admin] = await ethers.getSigners();
  console.log("Deploying with admin:", admin.address);

  // 1. Deploy MockERC20 (NO constructor args)
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const token = await MockERC20.deploy();
  await token.deployed();
  console.log("MockERC20 deployed to:", token.address);

  // 2. Deploy TokenVaultV1 Proxy
  const TokenVaultV1 = await ethers.getContractFactory("TokenVaultV1");

  const proxy = await upgrades.deployProxy(
    TokenVaultV1,
    [token.address, admin.address, 500], // initializer args
    {
      initializer: "initialize",
      kind: "uups",
      unsafeAllow: ["constructor"],
    }
  );

  await proxy.deployed();
  console.log("TokenVaultV1 proxy deployed to:", proxy.address);

  // 3. Grant UPGRADER_ROLE to admin
  const UPGRADER_ROLE = await proxy.UPGRADER_ROLE();
  await proxy.grantRole(UPGRADER_ROLE, admin.address);
  console.log("UPGRADER_ROLE granted to admin");

  console.log("READY FOR UPGRADES");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
