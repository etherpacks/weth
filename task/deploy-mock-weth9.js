const dpack = require('dpack')
const { task } = require('hardhat/config')

task('deploy-mock-weth9')
.setAction(async (args, hre) => {
  const provider = hre.ethers.getDefaultProvider();
  const [ signer ]  = hre.ethers.getSigners();

  const pack = JSON.parse(fs.readFileSync(`packs/weth9_ethereum.dpack.json`)) // reference deployment for mocks
  const resolved = await dpack.resolve(pack);
  const dapp = new dpack.Dapp(resolved);

  const weth9 = await dapp.WETH9.deploy();

  const mockpack = dpack.copy(pack);
  mockpack.network = hre.network.name
  mockpack.objects.weth9.address = weth9.address;
  const mockpath = `pack/weth_${hre.network.name}.dpack.json`
  const mockjson = JSON.stringify(mockpack, null, 2)

  fs.writeFileSync(mockpath, mockjson);
  return pack;
})
