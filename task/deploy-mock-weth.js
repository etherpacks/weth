const fs = require('fs')
const path = require('path')

const dpack = require('dpack')
const { task } = require('hardhat/config')

task('deploy-mock-weth', 'deploy mock weth')
.setAction(async (args, hre) => {
  const [ signer ]  = await hre.ethers.getSigners();
  const pack = require('../packs/weth_ethereum.dpack.json')  // reference deployment for mocks
  const dapp = await dpack.Dapp.loadFromPack(pack, signer, hre.ethers)
  const weth = await dapp.types.WETH9.deploy()
  const mockpack = JSON.parse(JSON.stringify(pack))
  mockpack.network = hre.network.name
  mockpack.objects.weth.address = weth.address;
  mockpack.objects.weth9.address = weth.address;
  const mockpath = path.join(__dirname, `../packs/weth_${hre.network.name}.dpack.json`)
  const mockjson = JSON.stringify(mockpack, null, 2)
  fs.writeFileSync(mockpath, mockjson);
  return mockpack;
})
