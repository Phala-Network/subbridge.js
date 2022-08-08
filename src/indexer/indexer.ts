import {SendingHistory, RecevingHistory} from './types'

export abstract class Indexer {
  /**
   * Account value should be either a 32 bytes substrate-compitable public key * or a 20 bytes Ethereum-like account address.
   */
  public account: string

  abstract sendingCount(): Promise<number>
  abstract sendingHistory(): Promise<SendingHistory>
  abstract limittedSendingHistory(limit: number): Promise<SendingHistory>
  abstract rangeSendingHistory(from: number, to: number): Promise<SendingHistory>

  abstract recevingCount(): Promise<number>
  abstract RecevingHistory(): Promise<RecevingHistory>
  abstract limittedRecevingHistory(limit: number): Promise<RecevingHistory>
  abstract rangeRecevingHistory(from: number, to: number): Promise<RecevingHistory>
}
