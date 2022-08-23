import {gql, GraphQLClient} from 'graphql-request'
import {ChainBridgeChainId} from '../chainbridge'
import {GraphEndpoint} from '../graph.default'

import {Indexer} from './indexer'
import {
  Option,
  Count,
  ChainbridgeConfirmData,
  SendingHistory,
  RecevingHistory,
} from './types'
import {chainbridgeFilterBatchChainbridgeSendingData} from './utils'

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
  ): Promise<Option<ChainbridgeConfirmData>> {
    return new Promise<Option<ChainbridgeConfirmData>>((resolve, reject) => {
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
                    cTxReceiveds (orderBy: CREATED_AT_DESC, filter: {originChainId: {equalTo: ${originChainId}}, depositNonce: {equalTo: \"${depositNonce}\"}}) {
                        nodes {
                            id
                            createdAt
                            originChainId
                            depositNonce
                            status
                            executeTx {
                                sender
                                hash
                            }
                        }
                    }
                }
                `
        )
        .then((data) => {
          if (data.cTxReceiveds?.nodes.length > 0) {
            resolve({
              id: data.cTxReceiveds.nodes[0],
              originChainId: data.cTxReceiveds.nodes[0].originChainId,
              depositNonce: data.cTxReceiveds.nodes[0].depositNonce,
              status: data.cTxReceiveds.nodes[0].status,
              executeTx: data.cTxReceiveds.nodes[0].executeTx,
            })
          } else {
            resolve(null)
          }
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

  sendingCount(): Promise<Option<Count>> {
    return new Promise<Option<Count>>((resolve, reject) => {
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
          if (data.sendingCounts?.length > 0) {
            resolve({
              account: data.sendingCounts[0].id,
              count: data.sendingCounts[0].count,
            })
          } else {
            resolve(null)
          }
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

  sendingHistory(): Promise<Option<SendingHistory[]>> {
    return new Promise<Option<SendingHistory[]>>((resolve, reject) => {
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
                            sender,
                            hash
                        }
                        sender,
                        index
                    }
                }
                `
        )
        .then((data) => {
          if (data.ctxSents?.length > 0) {
            resolve(chainbridgeFilterBatchChainbridgeSendingData(data.ctxSents))
          } else {
            resolve(null)
          }
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

  limittedSendingHistory(limit: number): Promise<Option<SendingHistory[]>> {
    return new Promise<Option<SendingHistory[]>>((resolve, reject) => {
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
          if (data.ctxSents?.length > 0) {
            resolve(chainbridgeFilterBatchChainbridgeSendingData(data.ctxSents))
          } else {
            resolve(null)
          }
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

  rangeSendingHistory(
    from: number,
    to: number
  ): Promise<Option<SendingHistory[]>> {
    return new Promise<Option<SendingHistory[]>>((resolve, reject) => {
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
          if (data.ctxSents?.length > 0) {
            resolve(chainbridgeFilterBatchChainbridgeSendingData(data.ctxSents))
          } else {
            resolve(null)
          }
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

  recevingCount(): Promise<Option<Count>> {
    return new Promise<Option<Count>>((resolve, reject) => {
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
          if (data.recevingCounts?.length > 0) {
            resolve({
              account: data.recevingCounts[0].id,
              count: data.recevingCounts[0].count,
            })
          } else {
            resolve(null)
          }
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

  recevingHistory(): Promise<RecevingHistory[]> {
    return new Promise<RecevingHistory[]>((resolve, reject) => {
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

  limittedRecevingHistory(limit: number): Promise<RecevingHistory[]> {
    return new Promise<RecevingHistory[]>((resolve, reject) => {
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

  rangeRecevingHistory(from: number, to: number): Promise<RecevingHistory[]> {
    return new Promise<RecevingHistory[]>((resolve, reject) => {
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
