import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import "@nomiclabs/hardhat-ethers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    console.log('BuyMeACoffee Deployment starts')
    const { deployments, getNamedAccounts, ethers } = hre;
    const { deploy, log } = deployments;

    const { deployer } = await getNamedAccounts();

    const deployResult = await deploy('BuyMeACoffee', {
        from: deployer,
        log: true,
    });

    if (deployResult.newlyDeployed) {

        log(`
            ----------------------------------------------------------------------------------
            |    Deployment Status  :                                                               
            |       Contract owner  :         ${deployer}      
            |
            |  ------------------------------------------------------------------------------
            |    Contract deployed  :         
            |    BuyMeACoffee       :         ${deployResult.address}   
            ----------------------------------------------------------------------------------
        `);
    }


};

export default func;
func.tags = ['BuyMeACoffee'];