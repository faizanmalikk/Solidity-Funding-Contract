const { assert, expect } = require("chai")
const { getNamedAccounts, ethers, deployments, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")


developmentChains.includes(network.name)
    ?
    describe.skip
    :
    describe("FundMe", () => {

        let fundMe
        let deployer
        const sendValue = 11 * 1e18

        beforeEach(async () => {

            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContract("FundMe", deployer);
        })

    })