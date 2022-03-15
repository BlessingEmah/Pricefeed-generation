
import { ethers } from "hardhat";

const ATOM_ETH	="0xc751E86208F0F8aF2d5CD0e29716cA7AD98B5eF5"

async function main() {
 
  const tokenPrice = await ethers.getContractFactory("PriceConsumerV3");
  const feedPrice = await tokenPrice.deploy(ATOM_ETH);

  await feedPrice.deployed();

  console.log(await feedPrice.getLatestPrice())
  console.log("Greeter deployed to:", feedPrice.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
