import {gql, GraphQLClient} from 'graphql-request'
import {ChainId as ChainBridgeChainId} from '../chainbridge'
import GraphEndpoint from '../graph.default'

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

  chainId(network: string): number {
    if (
      !Object.prototype.hasOwnProperty.call(ChainBridgeChainId, this.network)
    ) {
      throw new Error('Network does not exist.')
    }
    return ChainBridgeChainId[this.network]
  }

  receiveConfirmData(
    destNetwork,
    originChainId,
    depositNonce
  ): Promise<ChainbridgeConfirmData> {
    return new Promise<ChainbridgeConfirmData>(async (resolve, reject) => {
      // TODO: verify destNetwork
      const destClient = new GraphQLClient(
        GraphEndpoint[destNetwork.toLowerCase()],
        {
          timeout: 300000,
        }
      )
      let data
      try {
        data = await destClient.request(gql`
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
                `)
      } catch (e) {
        reject(
          Error(
            'Error getting ctxReceiveds from blockchain: ' +
              JSON.stringify(e) +
              JSON.stringify(data)
          )
        )
      }
      resolve(data.ctxReceiveds)
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
    return new Promise<number>(async (resolve, reject) => {
      let data
      try {
        data = await this.client.request(gql`
            {
                sendingCounts (where: {id: \"${this.account.toLowerCase()}\"}) {
                    id
                    count
                }
            }
            `)
      } catch (e) {
        reject(
          new Error(
            'Error getting ctxSents from blockchain: ' +
              JSON.stringify(e) +
              JSON.stringify(data)
          )
        )
      }
      resolve(data.sendingCounts)
    })
  }

  sendingHistory(): Promise<SendingHistory> {
    return new Promise<SendingHistory>(async (resolve, reject) => {
      let data
      try {
        data = await this.client.request(gql`
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
                `)
      } catch (e) {
        reject(
          new Error(
            'Error getting ctxSents from blockchain: ' +
              JSON.stringify(e) +
              JSON.stringify(data)
          )
        )
      }
      resolve(data.ctxSents)
    })
  }

  limittedSendingHistory(limit: number): Promise<SendingHistory> {
    return new Promise<SendingHistory>(async (resolve, reject) => {
      let data
      try {
        data = await this.client.request(gql`
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
                `)
      } catch (e) {
        reject(
          new Error(
            'Error getting ctxSents from blockchain: ' +
              JSON.stringify(e) +
              JSON.stringify(data)
          )
        )
      }
      resolve(data.ctxSents)
    })
  }

  rangeSendingHistory(from: number, to: number): Promise<SendingHistory> {
    return new Promise<SendingHistory>(async (resolve, reject) => {
      let data
      try {
        data = await this.client.request(gql`
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
                `)
      } catch (e) {
        reject(
          new Error(
            'Error getting ctxSents from blockchain: ' +
              JSON.stringify(e) +
              JSON.stringify(data)
          )
        )
      }
      resolve(data.ctxSents)
    })
  }

  recevingCount(): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      let data
      try {
        data = await this.client.request(gql`
                {
                    recevingCounts (where: {id: \"${this.account.toLowerCase()}\"}) {
                        id
                        count
                    }
                }
                `)
      } catch (e) {
        reject(
          new Error(
            'Error getting ctxSents from blockchain: ' +
              JSON.stringify(e) +
              JSON.stringify(data)
          )
        )
      }
      resolve(data.recevingCounts)
    })
  }

  RecevingHistory(): Promise<RecevingHistory> {
    return new Promise<RecevingHistory>(async (resolve, reject) => {
      let data
      // Retrieve ERC20Deposited records according to recipient
      try {
        data = await this.client.request(gql`
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
                `)
      } catch (e) {
        reject(
          new Error(
            'Error getting ctxSents from blockchain: ' +
              JSON.stringify(e) +
              JSON.stringify(data)
          )
        )
      }
      resolve(data.erc20Depositeds)
    })
  }

  limittedRecevingHistory(limit: number): Promise<RecevingHistory> {
    return new Promise<RecevingHistory>(async (resolve, reject) => {
      let data
      // Retrieve ERC20Deposited records according to recipient
      try {
        data = await this.client.request(gql`
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
                `)
      } catch (e) {
        reject(
          new Error(
            'Error getting ctxSents from blockchain: ' +
              JSON.stringify(e) +
              JSON.stringify(data)
          )
        )
      }
      resolve(data.erc20Depositeds)
    })
  }

  rangeRecevingHistory(from: number, to: number): Promise<RecevingHistory> {
    return new Promise<RecevingHistory>(async (resolve, reject) => {
      let data
      // Retrieve ERC20Deposited records according to recipient
      try {
        data = await this.client.request(gql`
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
                `)
      } catch (e) {
        reject(
          new Error(
            'Error getting ctxSents from blockchain: ' +
              JSON.stringify(e) +
              JSON.stringify(data)
          )
        )
      }
      resolve(data.erc20Depositeds)
    })
  }
}
