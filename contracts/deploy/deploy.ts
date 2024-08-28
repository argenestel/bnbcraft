import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

async function main() {
  console.log("Deploying ZeekCraft contract...");

  // Get the ContractFactory and Signer
  const ZeekCraft: ContractFactory = await ethers.getContractFactory("ZeekCraft");
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  // Deploy the contract
  const zeekCraft: Contract = await ZeekCraft.deploy();

  // Wait for the contract to be deployed
  await zeekCraft.deployed();

  console.log("ZeekCraft deployed to:", zeekCraft.address);

  // Verify the contract on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contract on Etherscan...");
    await run("verify:verify", {
      address: zeekCraft.address,
      constructorArguments: [],
    });
    console.log("Contract verified on Etherscan");
  } else {
    console.log("Skipping Etherscan verification");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });