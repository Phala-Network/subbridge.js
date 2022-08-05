import {Indexer} from '../src/index.js'

async function main() {
  // Thala: Query sending count by sender
  console.log(
    `\n============ Sending count =============\n${JSON.stringify(
      await Indexer.paraSendCount(
        'thala',
        '0x4807162219f219fecf11d2739bb1b30d507527893b427889c94c92d3518e767f'
      ),
      null,
      2
    )}`
  )
  // Para: Query all sending history by sender
  console.log(
    `\n============ All sending history =============\n${JSON.stringify(
      await Indexer.paraSendHistory(
        'thala',
        '0x4807162219f219fecf11d2739bb1b30d507527893b427889c94c92d3518e767f'
      ),
      null,
      2
    )}`
  )
  // Para: Query limitted sending history by sender
  console.log(
    `\n============ Latest 3 sending history =============\n${JSON.stringify(
      await Indexer.paraLimittedSendHistory(
        'thala',
        '0x4807162219f219fecf11d2739bb1b30d507527893b427889c94c92d3518e767f',
        3
      ),
      null,
      2
    )}`
  )
  // Para: Query range sending history
  console.log(
    `\n============ Range sending history [2, 4] =============\n${JSON.stringify(
      await Indexer.paraRangeSendHistory(
        'thala',
        '0x4807162219f219fecf11d2739bb1b30d507527893b427889c94c92d3518e767f',
        2,
        4
      ),
      null,
      2
    )}`
  )
  // Para: Query receiving count
  console.log(
    `\n============ Receiving count =============\n${JSON.stringify(
      await Indexer.paraReceiveCount(
        'thala',
        '0x7804e66ec9eea3d8daf6273ffbe0a8af25a8879cf43f14d0ebbb30941f578242'
      ),
      null,
      2
    )}`
  )
  // Para: Query all receving history by recipient
  console.log(
    `\n============ All receiving history =============\n${JSON.stringify(
      await Indexer.paraReceiveHistory(
        'thala',
        '0x7804e66ec9eea3d8daf6273ffbe0a8af25a8879cf43f14d0ebbb30941f578242'
      ),
      null,
      2
    )}`
  )
  // Para: Query limitted recving history by recipient
  console.log(
    `\n============ Latest 3 receiving history =============\n${JSON.stringify(
      await Indexer.paraLimittedReceiveHistory(
        'thala',
        '0x7804e66ec9eea3d8daf6273ffbe0a8af25a8879cf43f14d0ebbb30941f578242',
        3
      ),
      null,
      2
    )}`
  )
  // Para: Range query receving history
  console.log(
    `\n============ Range receving history [0, 100] =============\n${JSON.stringify(
      await Indexer.paraRangeReceiveHistory(
        'thala',
        '0x7804e66ec9eea3d8daf6273ffbe0a8af25a8879cf43f14d0ebbb30941f578242',
        0,
        100
      ),
      null,
      2
    )}`
  )
  // Para: Query receiving confirmation of a specific incoming transaction
  console.log(
    `\n============ Confirmation of transaction{originChain: thala, destChain: thala, depositNonce: 9} =============\n${JSON.stringify(
      await Indexer.paraChainbridgeReceiveConfirm(
        'thala',
        Indexer.chainbridgeChainid('thala'),
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
