import {ChainbridgeConfirmData, SendingHistory, RecevingHistory} from './types'

export function chainbridgeFilterBatchChainbridgeSendingData(
  records: any
): SendingHistory[] {
  return records.map((raw: any) => {
    return {
      createdAt: raw.createdAt,
      isXcm: false,
      xcmSendingData: null,
      isChainbridge: true,
      chainbridgeSendingData: {
        id: raw.id,
        destChainId: raw.destChainId,
        depositNonce: raw.depositNonce,
        resourceId: raw.resourceId,
        amount: raw.amount,
        recipient: raw.recipient,
        inidex: raw.inidex,
        sendTx: raw.sendTx,
        sender: raw.sender,
      },
      // Simply use ChainBridge status
      status: raw.status,
    }
  })
}

export function paraFilterSingleXCMSendingData(raw: any): SendingHistory {
  return {
    createdAt: raw.createdAt,
    isXcm: true,
    xcmSendingData: {
      id: raw.id,
      asset: raw.xcm.asset,
      recipient: raw.xcm.recipient,
      amount: raw.xcm.amount,
      index: raw.index,
      sendTx: raw.xcm.sendTx,
      sender: raw.xcm.sender,
    },
    isChainbridge: false,
    chainbridgeSendingData: undefined,
    // By default we treat XCM transfer as Confirmed
    status: 'Confirmed',
  }
}

export function paraFilterSingleChainbridgeSendingData(
  raw: any
): SendingHistory {
  return {
    createdAt: raw.createdAt,
    isXcm: false,
    xcmSendingData: undefined,
    isChainbridge: true,
    chainbridgeSendingData: {
      id: raw.id,
      destChainId: raw.chainbridge.destChainId,
      depositNonce: raw.chainbridge.depositNonce,
      resourceId: raw.chainbridge.resourceId,
      amount: raw.chainbridge.amount,
      recipient: raw.chainbridge.recipient,
      index: raw.index,
      sendTx: raw.chainbridge.sendTx,
      sender: raw.chainbridge.sender,
    },
    status: raw.chainbridge.status,
  }
}
