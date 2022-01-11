const fs = require('fs')

const dpack = require('dpack')
const { task } = require('hardhat/config')

task('deploy-mock-weth9')
.setAction(async (args, hre) => {
  const [ signer ]  = hre.ethers.getSigners();

  const pack = require('../packs/weth9_ethereum.dpack.json')  // reference deployment for mocks
  const artifact = require('../link/weth-ethereum-artifact.json')
  const weth9_type = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer)
  const weth9 = await weth9_type.deploy()

  const mockpack = dpack.copy(pack);
  mockpack.network = hre.network.name
  mockpack.objects.weth9.address = weth9.address;
  const mockpath = `./pack/weth_${hre.network.name}.dpack.json`
  const mockjson = JSON.stringify(mockpack, null, 2)

  fs.writeFileSync(mockpath, mockjson);
  return mockpack;
})
