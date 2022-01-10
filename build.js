// assemble packs for existing deployments

const dpack = require('dpack')

// Downloaded from X at T time
// Verified by A, B, C...
const weth9_artifact = require('link/weth-artifact.json')

const weth9_addresses = {
  'ethereum': '', // Verify -- it's #2 ETH holder after ETH2 deposit contract
  'ropsten': '',
  'kovan': '',
  'goerli': '',
}

async function build(network) {
  const builder = new dpack.PackBuilder(network)
  await builder.packObject({
    objectname: 'weth9'
    address: weth9_addresses[network],
    typename: 'WETH9',
    artifact: weth9_artifact
  }, true) // alsoPackType
  const pack = await builder.build();

  fs.writeFileSync(`pack/weth9_${network}.dpack.json`, JSON.stringify(pack, null, 2));
}

build('ethereum')
build('ropsten')
build('kovan')

