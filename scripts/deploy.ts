import { Signer } from "ethers";
import { ethers } from "hardhat";

import {
  INCHUSDT_PRICE_ADDRESS,
  INCH_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
  INCH_OWNER_ADDRESS,
  USDT_OWNER_ADDRESS,
  USDT_LIQUIDTY_ADDRESS,
} from "../config/index";

async function swapperContract() {
  const INCH_USD: string = "0x443C5116CdF663Eb387e72C688D276e702135C87";
  const inch_contract_address: string =
    "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f";
  const usdt_contract_address: string =
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
  const InchHolderAddress: string =
    "0x90f1cb932dbf94385434c40d53df3727f00e50b1";
  const usdtHolderAddress: string =
    "0x563bd69ab6579cc542f9b72d66d343b65e8fb232";
  const usdtLiquidtyProvider: string =
    "0x59153f27eefe07e5ece4f9304ebba1da6f53ca88";

  //create signers for each token holder
  const InchSigner: Signer = await ethers.getSigner(InchHolderAddress);
  const usdtSigner: Signer = await ethers.getSigner(usdtHolderAddress);
  const usdtLiquidtySigner: Signer = await ethers.getSigner(
    usdtLiquidtyProvider
  );

  //interacting with INCH and usdt contract address
  const enjContract = await ethers.getContractAt(
    "IERC20",
    inch_contract_address,
    InchSigner
  );
  const usdtContract = await ethers.getContractAt(
    "IERC20",
    usdt_contract_address,
    usdtSigner
  );

  //get the price feed for the usdt/eth
  const fetchPrice = await ethers.getContractFactory("PriceConsumerV3");
  let deploySwap = await fetchPrice.deploy(INCH_USD);

  await deploySwap.getLatestPrice(); //get the current price of enj/usdt
  console.log(
    `Inch balance before swapping: ${await enjContract.balanceOf(
      InchHolderAddress
    )}`
  );
  console.log(
    `usdt balance before swapping:${await usdtContract.balanceOf(
      usdtHolderAddress
    )}`
  );

  /*******************************INCH ACCOUNT IMPERSONATION and LIQUIDITY PROVIDER*******************************************/
  //@ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [InchHolderAddress],
  });

  //set enj balance
  //@ts-ignore
  await network.provider.send("hardhat_setBalance", [
    InchHolderAddress,
    "0x10000000000000000000000000000000000000000000000000",
  ]);

  //provides allowance to the contract to transfer
  await enjContract
    .connect(InchSigner)
    .approve(deploySwap.address, "100000000000000000");

  /*******************************USDT ACCOUNT IMPERSONATION and LIQUIDITY PROVIDER*******************************************/

  //set usdtliqudy provider balance
  //@ts-ignore
  await network.provider.send("hardhat_setBalance", [
    usdtLiquidtyProvider,
    "0x1000000000000000000000000000000000",
  ]);

  //@ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [usdtLiquidtyProvider],
  });

  console.log(
    `usdt balance before providing liquidity:${await usdtContract.balanceOf(
      deploySwap.address
    )}`
  );
  await usdtContract
    .connect(usdtLiquidtySigner)
    .approve(deploySwap.address, "100000000000000000");
  await usdtContract
    .connect(usdtLiquidtySigner)
    .transfer(deploySwap.address, "10000000000");

  await deploySwap.swapInchToUsdt(InchHolderAddress, usdtHolderAddress, "100");
  console.log(await deploySwap.getOrder());
  console.log(
    `Inch balance after swapping:${await enjContract.balanceOf(
      InchHolderAddress
    )}`
  );
  console.log(
    `usdt balance after swapping:${await usdtContract.balanceOf(
      usdtHolderAddress
    )}`
  );
  console.log(
    `usdt balance after providing liquidity:${await usdtContract.balanceOf(
      deploySwap.address
    )}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
swapperContract().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
