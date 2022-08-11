const {Indexer, ChainBridgeChainId} = require('../dist/index.js')

async function main() {
  const paraIndexer = new Indexer.ParaIndexer(
    '0x7804e66ec9eea3d8daf6273ffbe0a8af25a8879cf43f14d0ebbb30941f578242',
    'thala'
  )

  // Thala: Query sending count by sender
  console.log(
    `\n============ Sending count =============\n${JSON.stringify(
      await paraIndexer.sendingCount(),
      null,
      2
    )}`
  )
  // Para: Query all sending history by sender
  console.log(
    `\n============ All sending history =============\n${JSON.stringify(
      await paraIndexer.sendingHistory(),
      null,
      2
    )}`
  )
  // Para: Query limitted sending history by sender
  console.log(
    `\n============ Latest 3 sending history =============\n${JSON.stringify(
      await paraIndexer.limittedSendingHistory(3),
      null,
      2
    )}`
  )
  // Para: Query range sending history
  console.log(
    `\n============ Range sending history [2, 4] =============\n${JSON.stringify(
      await paraIndexer.rangeSendingHistory(2, 4),
      null,
      2
    )}`
  )
  // Para: Query receiving count
  console.log(
    `\n============ Receiving count =============\n${JSON.stringify(
      await paraIndexer.recevingCount(),
      null,
      2
    )}`
  )
  // Para: Query all receving history by recipient
  console.log(
    `\n============ All receiving history =============\n${JSON.stringify(
      await paraIndexer.recevingHistory(),
      null,
      2
    )}`
  )
  // Para: Query limitted recving history by recipient
  console.log(
    `\n============ Latest 3 receiving history =============\n${JSON.stringify(
      await paraIndexer.limittedRecevingHistory(3),
      null,
      2
    )}`
  )
  // Para: Range query receving history
  console.log(
    `\n============ Range receving history [0, 100] =============\n${JSON.stringify(
      await paraIndexer.rangeRecevingHistory(0, 100),
      null,
      2
    )}`
  )

  // Para: Query receiving confirmation of a specific incoming transaction
  console.log(
    `\n============ Confirmation of transaction{originChain: thala, destChain: kovan, depositNonce: 9} =============\n${JSON.stringify(
      await paraIndexer.chainbridgeConfirmData(
        'kovan',
        ChainBridgeChainId.thala,
        9
      ),
      null,
      2
    )}`
  )
}

main()
  .catch(console.error)
  .finally(() => process.exit())
