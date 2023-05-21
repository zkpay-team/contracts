import { formatEther } from 'ethers/lib/utils'
import { task } from 'hardhat/config'
import { setDeploymentProperty, DeploymentProperty } from '../../../.deployment/deploymentManager'
import { verifyAddress } from './utils'

/**
 * @usage npx hardhat deploy-full --verify --network scroll
 */
task('deploy-full', 'Deploy all the contracts on their first version')
  .addFlag('verify', 'verify contracts on etherscan')
  .setAction(async (args, { ethers, run, network }) => {
    try {
      const { verify } = args
      const [deployer] = await ethers.getSigners()

      console.log('Network')
      console.log(network.name)
      console.log('Task Args')
      console.log(args)

      console.log('Signer')
      console.log('  at', deployer.address)
      console.log('  ETH', formatEther(await deployer.getBalance()))

      await run('compile')

      // Deploy ID contract
      const ZkpayID = await ethers.getContractFactory('ZkpayID')
      // @ts-ignore: upgrades is imported in hardhat.config.ts - HardhatUpgrades
      const zkpayID = await (upgrades as HardhatUpgrades).deployProxy(ZkpayID, [], {
        timeout: 0,
        pollingInterval: 20000,
      })
      if (verify) {
        await verifyAddress(zkpayID.address)
      }
      const zkpayIDImplementationAddress =
        await // @ts-ignore: upgrades is imported in hardhat.config.ts - HardhatUpgrades
        (upgrades as HardhatUpgrades).erc1967.getImplementationAddress(zkpayID.address)
      console.log('zkpayID addresses:', {
        proxy: zkpayID.address,
        implementation: zkpayIDImplementationAddress,
      })

      setDeploymentProperty(network.name, DeploymentProperty.ZkpayID, zkpayID.address)
    } catch (e) {
      console.log('------------------------')
      console.log('FAILED')
      console.error(e)
      console.log('------------------------')
      return 'FAILED'
    }
  })
