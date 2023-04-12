const { getNamedAccounts, ethers } = require("hardhat");


async function main() {

  const { deployer } = getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer);

  console.log('withdrawing contract...')

  const transactionResponse = await fundMe.withdraw()
  await transactionResponse.wait(1)
  console.log('cool you have withdrawed it!!')

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
