const Indexer = require('../src/indexer');

async function main() {
    // ChainBridge: Query all sending history by sender
    console.log(`\n============ All sending history =============\n${JSON.stringify(await Indexer.chainbridgeEvmSendHistory('kovan', '0xF2c420bab910c0e9c547a4789d9a50dd5a846739'), null, 2)}`);
    // ChainBridge: Query limitted sending history by sender
    console.log(`\n============ Latest 3 sending history =============\n${JSON.stringify(await Indexer.chainbridgeEvmLimittedSendHistory('kovan', '0xf2c420bab910c0e9c547a4789d9a50dd5a846739', 3), null, 2)}`);
    // ChainBridge: Query all receving history by recipient
    console.log(`\n============ All receiving history =============\n${JSON.stringify(await Indexer.chainbridgeEvmReceivedHistory('kovan', '0xA29D4E0F035cb50C0d78c8CeBb56Ca292616Ab20'), null, 2)}`);
    // ChainBridge: Query limitted recving history by recipient
    console.log(`\n============ Latest 3 receiving history =============\n${JSON.stringify(await Indexer.chainbridgeEvmLimittedReceivedHistory('kovan', '0xA29D4E0F035cb50C0d78c8CeBb56Ca292616Ab20', 3), null, 2)}`);
    // ChainBridge: Query receiving confirmation of a specific incoming transaction
    console.log(`\n============ Confirmation of transaction{originChain: thala, destChain: kovan, depositNonce: 9} =============\n${JSON.stringify(await Indexer.chainbridgeEvmReceiveConfirm('kovan', Indexer.getChainbridgeChainid('thala'), 9), null, 2)}`);
}

main().catch(console.error).finally(() => process.exit());
