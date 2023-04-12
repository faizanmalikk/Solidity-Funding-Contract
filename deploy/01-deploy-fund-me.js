const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        ethUsdPriceFeedAddress = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdPriceFeedAddress.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: !developmentChains.includes(network.name) && 6
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_PRIVATE_KEY) {

        await verify(fundMe.address, args)

    }

    log('---------------------')

}

module.exports.tags = ["all", "fundme"]