import {gql, GraphQLClient} from 'graphql-request'
import {ChainId as ChainBridgeChainId} from '../chainbridge'
import GraphEndpoint from '../graph.default'

import {Indexer} from './indexer'

export class EvmChainBridgeIndexer extends Indexer {
  constructor(account: string) {
    // TODO: verify account
    this.account = account
  }

  chainId(network: string): number {
    if (
      !Object.prototype.hasOwnProperty.call(
        ChainBridgeChainId,
        network.toLowerCase()
      )
    ) {
      throw new Error('Network does not exist.')
    }
    return ChainBridgeChainId[network.toLowerCase()]
  }

  receiveConfirmData(
    network,
    originChainId,
    depositNonce
  ): Promise<ChainbridgeConfirmData> {
    const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
      timeout: 300000,
    })
    let data
    try {
      data = await client.request(gql`
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
      reject(Error(
        'Error getting ctxReceiveds from blockchain: ' +
          JSON.stringify(e) +
          JSON.stringify(data)
      ))
    }
    resolve(data.ctxReceiveds)
  }

  sendingCount(): Promise<number> {
      return new Promise<number>(async (resolve, reject) => {
        const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
            timeout: 300000,
          })
        let data
        try {
        data = await client.request(gql`
            {
                sendingCounts (where: {id: \"${this.account.toLowerCase()}\"}) {
                    id
                    count
                }
            }
            `)
        } catch (e) {
            reject(new Error(
                'Error getting ctxSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            ))
        }
        resolve(data.sendingCounts)
      })
  }

  sendingHistory(): Promise<SendingHistory> {
      return new Promise<SendingHistory>(async (resolve, reject) => {
        const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
            timeout: 300000,
          })
          let data
          try {
            data = await client.request(gql`
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
            reject(new Error(
              'Error getting ctxSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            ))
          }
          resolve(data.ctxSents)
      })
  }

  limittedSendingHistory(limit: number): Promise<SendingHistory> {
    return new Promise<SendingHistory>(async (resolve, reject) => {
        const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
            timeout: 300000,
          })
          let data
          try {
            data = await client.request(gql`
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
            reject(new Error(
              'Error getting ctxSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            ))
          }
          resolve(data.ctxSents)
    })
  }

  rangeSendingHistory(from: number, to: number): Promise<SendingHistory> {
      return new Promise<SendingHistory>(async (resolve, reject) => {
        const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
            timeout: 300000,
          })
          let data
          try {
            data = await client.request(gql`
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
            reject(new Error(
              'Error getting ctxSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            ))
          }
          resolve(data.ctxSents)
      })
  }

  recevingCount(): Promise<number> {
      return new Promise<number>(async (resolve, reject) => {
        const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
            timeout: 300000,
          })
          let data
          try {
            data = await client.request(gql`
                {
                    recevingCounts (where: {id: \"${this.account.toLowerCase()}\"}) {
                        id
                        count
                    }
                }
                `)
          } catch (e) {
            reject(new Error(
              'Error getting ctxSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            ))
          }
          resolve(data.recevingCounts)
      })
  }

  RecevingHistory(): Promise<RecevingHistory> {
      return new Promise<RecevingHistory>(async (resolve, reject) => {
        const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
            timeout: 300000,
          })
          let data
          // Retrieve ERC20Deposited records according to recipient
          try {
            data = await client.request(gql`
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
            reject(new Error(
              'Error getting ctxSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            ))
          }
          resolve(data.erc20Depositeds)
      })
  }

  limittedRecevingHistory(limit: number): Promise<RecevingHistory> {
      return new Promise<RecevingHistory>(async (resolve, reject) => {
        const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
            timeout: 300000,
          })
          let data
          // Retrieve ERC20Deposited records according to recipient
          try {
            data = await client.request(gql`
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
            reject(new Error(
              'Error getting ctxSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            ))
          }
          resolve(data.erc20Depositeds)
      })
  }

  rangeRecevingHistory(from: number, to: number): Promise<RecevingHistory> {
      return new Promise<RecevingHistory>(async (resolve, reject) => {
        const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
            timeout: 300000,
          })
          let data
          // Retrieve ERC20Deposited records according to recipient
          try {
            data = await client.request(gql`
                {
                    erc20Depositeds (orderBy: createdAt, orderDirection: desc, where: {recipient: \"${recipient.toLowerCase()}\",  index_gte: ${Number(
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
            reject(new Error(
              'Error getting ctxSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            ))
          }
          resolve(data.erc20Depositeds)
      })
  }
}
