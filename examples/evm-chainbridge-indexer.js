const {Indexer, ChainBridgeChainId} = require('../dist/index.js')

async function main() {
  const indexer = new Indexer.EvmChainBridgeIndexer(
    '0xA29D4E0F035cb50C0d78c8CeBb56Ca292616Ab20',
    'kovan'
  )
  // ChainBridge: Query all sending history by sender
  console.log(
    `\n============ All sending history =============\n${JSON.stringify(
      await indexer.sendingHistory(),
      null,
      2
    )}`
  )
  // ChainBridge: Query limitted sending history by sender
  console.log(
    `\n============ Latest 3 sending history =============\n${JSON.stringify(
      await indexer.limittedSendingHistory(3),
      null,
      2
    )}`
  )
  // ChainBridge: Query all receving history by recipient
  console.log(
    `\n============ All receiving history =============\n${JSON.stringify(
      await indexer.recevingHistory(),
      null,
      2
    )}`
  )
  // ChainBridge: Query limitted recving history by recipient
  console.log(
    `\n============ Latest 3 receiving history =============\n${JSON.stringify(
      await indexer.limittedRecevingHistory(3),
      null,
      2
    )}`
  )
  // ChainBridge: Query receiving confirmation of a specific incoming transaction
  console.log(
    `\n============ Confirmation of transaction{originChain: thala, destChain: kovan, depositNonce: 9} =============\n${JSON.stringify(
      await indexer.receiveConfirmData('thala', ChainBridgeChainId.kovan, 9),
      null,
      2
    )}`
  )
  // ChainBridge: Query sender sending count
  console.log(
    `\n============ Sending count =============\n${JSON.stringify(
      await indexer.sendingCount(),
      null,
      2
    )}`
  )
  // ChainBridge: Query receiving count
  console.log(
    `\n============ Receiving count =============\n${JSON.stringify(
      await indexer.recevingCount(),
      null,
      2
    )}`
  )
  // ChainBridge: Range query sending history
  console.log(
    `\n============ Range sending history [2, 4] =============\n${JSON.stringify(
      await indexer.rangeSendingHistory(2, 4),
      null,
      2
    )}`
  )
  // ChainBridge: Range query receving history
  console.log(
    `\n============ Range receving history [0, 100] =============\n${JSON.stringify(
      await indexer.rangeRecevingHistory(0, 100),
      null,
      2
    )}`
  )
}

main()
  .catch(console.error)
  .finally(() => process.exit())
