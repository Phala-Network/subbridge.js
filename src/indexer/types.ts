import {Bytes, U256} from '@polkadot/types'
import {XcmV1MultiAsset, XcmV1MultiLocation} from '@polkadot/types/lookup'
import {decodeAddress} from '@polkadot/util-crypto'

export interface Tx {
  readonly sender: string
  readonly hash: string
}

export interface Count {
  readonly account: string
  readonly count: string
}

export enum Status {
  Sent,
  Forwarded,
  Confirmed,
  Failed,
}

export interface SendingHistory {
  readonly createdAt: string
  readonly isXcm: boolean
  readonly xcmSendingData?: XCMSendingData
  readonly isChainbridge: boolean
  readonly chainbridgeSendingData?: ChainbridgeSendingData
  readonly status: string
}

export interface XCMSendingData {
  readonly id: string
  readonly asset: XcmV1MultiAsset
  readonly recipient: string
  readonly amount: string
  readonly index: number
  readonly sendTx: Tx
  readonly sender: string
}

export interface ChainbridgeSendingData {
  readonly id: string
  readonly destChainId: number
  readonly depositNonce: number
  readonly resourceId: string
  readonly amount: string
  readonly recipient: string
  readonly index: number
  readonly sendTx: Tx
  readonly sender: string
}

export interface RecevingHistory {
  readonly createdAt: string
  readonly isXcm: boolean
  readonly xcmSendingData?: XCMRecevingData
  readonly isChainbridge: boolean
  readonly chainbridgeRecevingData?: ChainbridgeRecevingData
}

export interface XCMRecevingData {
  readonly id: string
  readonly asset: XcmV1MultiAsset
  readonly amount: string
  readonly account: string
  readonly index: number
}

export interface ChainbridgeRecevingData {
  readonly id: string
  readonly asset: XcmV1MultiAsset
  readonly amount: string
  readonly account: string
  readonly index: number
  readonly originChainId: number
  readonly depositNonce: number
  readonly resourceId: string
  readonly status: string
  readonly executeTx: Tx
}

export interface ChainbridgeConfirmData {
    readonly id: string
    readonly originChainId: number
    readonly depositNonce: number
    readonly status: string
    readonly executeTx: Tx
}
