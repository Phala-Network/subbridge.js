import {Option, Count, SendingHistory, RecevingHistory} from './types'

export abstract class Indexer {
  /**
   * Account value should be either a 32 bytes substrate-compitable public key * or a 20 bytes Ethereum-like account address.
   */
  public account: string
  public network: string

  constructor(account: string, network: string) {
    if (this.verifyAccount() === false || this.verifyNetwork() === false) {
      throw new Error('Account or network verify failed')
    }
    this.account = account
    this.network = network.toLocaleLowerCase()
  }

  abstract verifyAccount(): boolean
  abstract verifyNetwork(): boolean
  abstract sendingCount(): Promise<Option<Count>>
  abstract sendingHistory(): Promise<Option<SendingHistory[]>>
  abstract limittedSendingHistory(
    limit: number
  ): Promise<Option<SendingHistory[]>>
  abstract rangeSendingHistory(
    from: number,
    to: number
  ): Promise<Option<SendingHistory[]>>

  abstract recevingCount(): Promise<Option<Count>>
  abstract recevingHistory(): Promise<Option<RecevingHistory[]>>
  abstract limittedRecevingHistory(
    limit: number
  ): Promise<Option<RecevingHistory[]>>
  abstract rangeRecevingHistory(
    from: number,
    to: number
  ): Promise<Option<RecevingHistory[]>>
}
