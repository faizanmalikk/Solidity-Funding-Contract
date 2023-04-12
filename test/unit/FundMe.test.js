const { assert, expect } = require("chai")
const { getNamedAccounts, ethers, deployments } = require("hardhat")


describe("FundMe", () => {

    let fundMe
    let Mock
    let deployer
    const sendValue = 11 * 1e18

    beforeEach(async () => {

        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(['all'])

        fundMe = await ethers.getContract("FundMe", deployer);
        Mock = await ethers.getContract("MockV3Aggregator", deployer)
    })


    describe("constructor", async () => {
        it("sets the aggregator address correctly", async () => {

            let response = await fundMe.GetPriceFeed()
            assert.equal(response, Mock.address)
        })
    })

    describe("fund", async () => {
        it("Fails if you don't send enough ETH", async () => {
            await expect(fundMe.Fund()).to.be.revertedWith('Your amount should be atleast 10 USD')
        })
        it("updated the amount funded data structure", async () => {
            await fundMe.Fund({ value: sendValue.toString() })
            const response = await fundMe.GetAddressToAmoutFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())

        })
        it("add funders to the array", async () => {
            await fundMe.Fund({ value: sendValue.toString() })
            const response = await fundMe.GetFunders(0)
            assert.equal(response, deployer)
        })
    })

    describe("withdraw", async () => {

        beforeEach(async () => {
            await fundMe.Fund({ value: sendValue.toString() })
        })

        it("withdraws ETH from a single funder", async () => {

            const startWithdrawContractBalance = await fundMe.provider.getBalance(fundMe.address)
            const startWithdrawDeployerBalance = await fundMe.provider.getBalance(deployer)

            let response = await fundMe.withdraw()
            let transactionResponse = await response.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionResponse
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endWithdrawContractBalance = await fundMe.provider.getBalance(fundMe.address)
            const endWithdrawDeployerBalance = await fundMe.provider.getBalance(deployer)

            assert.equal(endWithdrawContractBalance, 0)
            assert.equal((startWithdrawContractBalance.add(startWithdrawDeployerBalance)).toString(), (endWithdrawDeployerBalance.add(gasCost)).toString())

        })
        it("allow withdraw from multiple funders", async () => {

            const accounts = await ethers.getSigners()

            for (let i = 0; i < 6; i++) {
                const contractFunds = await fundMe.connect(accounts[i])
                await contractFunds.Fund({ value: sendValue.toString() })
            }

            const startWithdrawContractBalance = await fundMe.provider.getBalance(fundMe.address)
            const startWithdrawDeployerBalance = await fundMe.provider.getBalance(deployer)

            let response = await fundMe.withdraw()
            let transactionResponse = await response.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionResponse
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endWithdrawContractBalance = await fundMe.provider.getBalance(fundMe.address)
            const endWithdrawDeployerBalance = await fundMe.provider.getBalance(deployer)

            assert.equal(endWithdrawContractBalance, 0)
            assert.equal((startWithdrawContractBalance.add(startWithdrawDeployerBalance)).toString(), (endWithdrawDeployerBalance.add(gasCost)).toString())

            await expect(fundMe.GetFunders(0)).to.be.reverted

            for (let i = 0; i < 6; i++) {
                assert.equal(
                    await fundMe.GetAddressToAmoutFunded(accounts[i].address),
                    0
                )
            }
        })
        it("only allows owner to withdraw", async () => {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnected = await fundMe.connect(attacker)
            await expect(attackerConnected.withdraw()).to.be.reverted
        })
    })

})