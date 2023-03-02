// function deployFunc() {
//     console.log("hi")
// }
// module.exports.default = deployFunc

const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

// module.exports = async (hre) => {
//     const {getNamedAccounts,deployments} = hre //same as hre.getNamedAccounts and hre.deployments
// }

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //  const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        const ethUSDAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUSDAggregator.address
    } else {
        // ethUsdPriceFeedAddress = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
        // console.log(chainId)
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]
    console.log("Deploying Fund me and waiting for Confirmations....")
    const FundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    console.log(`Fund me deployed at ${FundMe.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(FundMe.address, args)
    }

    log("------------------------------------------------------------")
}
module.exports.tags = ["all", "fundme"]
