import {gql, GraphQLClient} from 'graphql-request'
import {ChainId as ChainBridgeChainId} from '../chainbridge'
import {GraphEndpoint} from '../graph.default'

import {Indexer} from './indexer'
import {ChainbridgeConfirmData, SendingHistory, RecevingHistory} from './types'

export class EvmChainBridgeIndexer extends Indexer {
  public client: GraphQLClient

  constructor(account: string, network: string) {
    super(account, network)

    this.client = new GraphQLClient(GraphEndpoint[this.network], {
      timeout: 300000,
    })
  }

  chainId(): number {
    if (
      !Object.prototype.hasOwnProperty.call(ChainBridgeChainId, this.network)
    ) {
      throw new Error('Network does not exist.')
    }
    return ChainBridgeChainId[this.network]
  }

  receiveConfirmData(
    destNetwork: string,
    originChainId: number,
    depositNonce: number
  ): Promise<ChainbridgeConfirmData> {
    return new Promise<ChainbridgeConfirmData>((resolve, reject) => {
      // TODO: verify destNetwork
      const destClient = new GraphQLClient(
        GraphEndpoint[destNetwork.toLowerCase()],
        {
          timeout: 300000,
        }
      )
      destClient
        .request(
          gql`
                {
                    ctxReceiveds (orderBy: createdAt, orderDirection: desc, where: {originChainId: ${originChainId}, depositNonce: \"${depositNonce}\"}) {
                        id
                        createdAt
                        originChainId
                        depositNonce
                        status
                        executeTx {
                            hash
                        }
                    }
                }
                `
        )
        .then((data) => {
          resolve(data.ctxReceiveds)
        })
        .catch((e) => {
          reject(
            Error(
              'Error getting ctxReceiveds from blockchain: ' + JSON.stringify(e)
            )
          )
        })
    })
  }

  verifyAccount(): boolean {
    // TODO
    return true
  }

  verifyNetwork(): boolean {
    // TODO
    return true
  }

  sendingCount(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.client
        .request(
          gql`
            {
                sendingCounts (where: {id: \"${this.account.toLowerCase()}\"}) {
                    id
                    count
                }
            }
            `
        )
        .then((data) => {
          resolve(data.sendingCounts)
        })
        .catch((e) => {
          reject(
            new Error(
              'Error getting ctxSents from blockchain: ' + JSON.stringify(e)
            )
          )
        })
    })
  }

  sendingHistory(): Promise<SendingHistory> {
    return new Promise<SendingHistory>((resolve, reject) => {
      this.client
        .request(
          gql`
                {
                    ctxSents (orderBy: createdAt, orderDirection: desc, where: {sender: \"${this.account.toLowerCase()}\"}) {
                        id
                        createdAt
                        destChainId
                        depositNonce
                        resourceId
                        amount
                        recipient
                        sendTx {
                            hash
                        }
                        sender,
                        index
                    }
                }
                `
        )
        .then((data) => {
          resolve(data.ctxSents)
        })
        .catch((e) => {
          reject(
            new Error(
              'Error getting ctxSents from blockchain: ' + JSON.stringify(e)
            )
          )
        })
    })
  }

  limittedSendingHistory(limit: number): Promise<SendingHistory> {
    return new Promise<SendingHistory>((resolve, reject) => {
      this.client
        .request(
          gql`
                {
                    ctxSents (first: ${limit}, orderBy: createdAt, orderDirection: desc, where: {sender: \"${this.account.toLowerCase()}\"}) {
                        id
                        createdAt
                        destChainId
                        depositNonce
                        resourceId
                        amount
                        recipient
                        sendTx {
                            hash
                        }
                        sender,
                        index
                    }
                }
                `
        )
        .then((data) => {
          resolve(data.ctxSents)
        })
        .catch((e) => {
          reject(
            new Error(
              'Error getting ctxSents from blockchain: ' + JSON.stringify(e)
            )
          )
        })
    })
  }

  rangeSendingHistory(from: number, to: number): Promise<SendingHistory> {
    return new Promise<SendingHistory>((resolve, reject) => {
      this.client
        .request(
          gql`
                {
                    ctxSents (orderBy: createdAt, orderDirection: desc, where: {sender: \"${this.account.toLowerCase()}\", index_gte: ${Number(
            from
          )}, index_lte: ${Number(to)}}) {
                        id
                        createdAt
                        destChainId
                        depositNonce
                        resourceId
                        amount
                        recipient
                        sendTx {
                            hash
                        }
                        sender,
                        index
                    }
                }
                `
        )
        .then((data) => {
          resolve(data.ctxSents)
        })
        .catch((e) => {
          reject(
            new Error(
              'Error getting ctxSents from blockchain: ' + JSON.stringify(e)
            )
          )
        })
    })
  }

  recevingCount(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.client
        .request(
          gql`
                {
                    recevingCounts (where: {id: \"${this.account.toLowerCase()}\"}) {
                        id
                        count
                    }
                }
                `
        )
        .then((data) => {
          resolve(data.recevingCounts)
        })
        .catch((e) => {
          reject(
            new Error(
              'Error getting ctxSents from blockchain: ' + JSON.stringify(e)
            )
          )
        })
    })
  }

  recevingHistory(): Promise<RecevingHistory> {
    return new Promise<RecevingHistory>((resolve, reject) => {
      // Retrieve ERC20Deposited records according to recipient
      this.client
        .request(
          gql`
                {
                    erc20Depositeds (orderBy: createdAt, orderDirection: desc, where: {recipient: \"${this.account.toLowerCase()}\"}) {
                        createdAt
                        token
                        recipient
                        amount
                        tx {
                            hash
                        },
                        index
                    }
                }
                `
        )
        .then((data) => {
          resolve(data.erc20Depositeds)
        })
        .catch((e) => {
          reject(
            new Error(
              'Error getting ctxSents from blockchain: ' + JSON.stringify(e)
            )
          )
        })
    })
  }

  limittedRecevingHistory(limit: number): Promise<RecevingHistory> {
    return new Promise<RecevingHistory>((resolve, reject) => {
      // Retrieve ERC20Deposited records according to recipient
      this.client
        .request(
          gql`
                {
                    erc20Depositeds (first: ${limit}, orderBy: createdAt, orderDirection: desc, where: {recipient: \"${this.account.toLowerCase()}\"}) {
                        createdAt
                        token
                        recipient
                        amount
                        tx {
                            hash
                        },
                        index
                    }
                }
                `
        )
        .then((data) => {
          resolve(data.erc20Depositeds)
        })
        .catch((e) => {
          reject(
            new Error(
              'Error getting ctxSents from blockchain: ' + JSON.stringify(e)
            )
          )
        })
    })
  }

  rangeRecevingHistory(from: number, to: number): Promise<RecevingHistory> {
    return new Promise<RecevingHistory>((resolve, reject) => {
      // Retrieve ERC20Deposited records according to recipient
      this.client
        .request(
          gql`
                {
                    erc20Depositeds (orderBy: createdAt, orderDirection: desc, where: {recipient: \"${this.account.toLowerCase()}\",  index_gte: ${Number(
            from
          )}, index_lte: ${Number(to)}}) {
                        createdAt
                        token
                        recipient
                        amount
                        tx {
                            hash
                        },
                        index
                    }
                }
                `
        )
        .then((data) => {
          resolve(data.erc20Depositeds)
        })
        .catch((e) => {
          reject(
            new Error(
              'Error getting ctxSents from blockchain: ' + JSON.stringify(e)
            )
          )
        })
    })
  }
}
