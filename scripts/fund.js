const { getNamedAccounts, ethers } = require("hardhat");


async function main() {

  const sendValue = 11 * 1e18

  const { deployer } = getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer);

  console.log('funding contract...')

  const transactionResponse = await fundMe.Fund({ value: sendValue.toString() })
  await transactionResponse.wait(1)
  console.log('funded')

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
