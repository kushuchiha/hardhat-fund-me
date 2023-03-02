const { task } = require("hardhat/config")

task("block-number", "Print current block number").setAction(
    async (taskArgs, hre) => {
        const BlockNumber = await hre.ethers.provider.getBlockNumber()
        console.log(`Current block number is ${BlockNumber}`)
    }
)
