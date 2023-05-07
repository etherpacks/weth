const fs = require('fs')
const path = require('path')

const dpack = require('@etherpacks/dpack')
const { task } = require('hardhat/config')
const GASLIMIT = '1000000000000'

task('deploy-mock-weth', 'deploy mock weth')
.setAction(async (args, hre) => {
  const netname = args.netname ? args.netname : hre.network.name.replace('_fork', '')
  const pack = require(`../pack/weth_${netname}.dpack.json`)
  const [ signer ]  = await hre.ethers.getSigners()
  const dapp = await dpack.load(pack, hre.ethers, signer)
  const weth = await dapp._types.WETH9.deploy({gasLimit: GASLIMIT})
  const mockpack = JSON.parse(JSON.stringify(pack))
  mockpack.network = netname
  mockpack.objects.weth.address = weth.address;
  mockpack.objects.weth9.address = weth.address;
  const mockpath = path.join(__dirname, `../pack/weth_${netname}.dpack.json`)
  const mockjson = JSON.stringify(mockpack, null, 2)
  fs.writeFileSync(mockpath, mockjson);
  return mockpack;
})
