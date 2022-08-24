import {SendingHistory, RecevingHistory} from './types'

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
        index: raw.index,
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

export function chainbridgeFilterBatchChainbridgeRecevingData(
  records: any
): RecevingHistory[] {
  return records.map((raw: any) => {
    return {
      createdAt: raw.createdAt,
      isXcm: false,
      xcmRecevingData: null,
      isChainbridge: true,
      chainbridgeRecevingData: {
        id: raw.id,
        token: raw.token,
        amount: raw.amount,
        recipient: raw.recipient,
        index: raw.index,
        executeTx: raw.tx,
      },
      // Tx confirmed because we got records from ERC20Deposited event
      status: 'Confirmed',
    }
  })
}

export function paraFilterSingleXCMRecevingData(raw: any): RecevingHistory {
  let recipient: string
  if (raw.isLocal) {
    recipient = raw.account
  } else {
    recipient = raw.location
  }
  return {
    createdAt: raw.createdAt,
    isXcm: true,
    xcmRecevingData: {
      id: raw.id,
      asset: raw.asset,
      recipient: recipient,
      amount: raw.amount,
      index: raw.index,
    },
    isChainbridge: false,
    chainbridgeRecevingData: undefined,
    // By default we treat XCM transfer as Confirmed
    status: 'Confirmed',
  }
}

export function paraFilterSingleChainbridgeRecevingData(
  raw: any
): RecevingHistory {
  let recipient: string
  if (raw.isLocal) {
    recipient = raw.account
  } else {
    recipient = raw.location
  }
  return {
    createdAt: raw.createdAt,
    isXcm: false,
    xcmRecevingData: undefined,
    isChainbridge: true,
    chainbridgeRecevingData: {
      id: raw.id,
      amount: raw.amount,
      recipient: recipient,
      index: raw.index,
      status: 'Confirmed',
      token: '',
      executeTx: {
        hash: '',
        sender: '',
      },
    },
    status: raw.chainbridge.status,
  }
}
