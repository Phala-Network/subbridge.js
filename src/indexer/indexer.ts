import {Count, SendingHistory, RecevingHistory} from './types'

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
  abstract sendingCount(): Promise<Count>
  abstract sendingHistory(): Promise<SendingHistory>
  abstract limittedSendingHistory(limit: number): Promise<SendingHistory>
  abstract rangeSendingHistory(
    from: number,
    to: number
  ): Promise<SendingHistory>

  abstract recevingCount(): Promise<Count>
  abstract recevingHistory(): Promise<RecevingHistory>
  abstract limittedRecevingHistory(limit: number): Promise<RecevingHistory>
  abstract rangeRecevingHistory(
    from: number,
    to: number
  ): Promise<RecevingHistory>
}
