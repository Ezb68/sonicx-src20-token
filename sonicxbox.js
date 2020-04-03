module.exports = {
  networks: {
    mainnet: {
      // Don't put your private key here:
      privateKey: process.env.PRIVATE_KEY_MAINNET,
      /*
Create a .env file (it must be gitignored) containing something like

  export PRIVATE_KEY_MAINNET=D8B708BFFFA424473D83349CF4C6A2395E4436E065B60F0BF31E582281256D1C

Then, run the migration with:

  source .env && sonicxbox migrate --network mainnet --reset

*/
      userFeePercentage: 100,
      feeLimit: 1e9,
      originEnergyLimit: 1e7,
      fullNode: "https://fullnode.sonicxhub.com",
      solidityNode: "https://solnode.sonicxhub.com",
      eventServer: "https://event.sonicxhub.com",
      fullHost: "https://fullnode.sonicxhub.com",
      // fullNode: 'http://10.70.1.192:8190',
      // solidityNode: 'http://10.70.1.192:8191',
      // eventServer: 'http://10.70.1.192:8080',
      // fullHost: 'http://10.70.1.192:8190',
      network_id: "1"
    },
    useZeroFourCompiler: true
  }
}