import {gql, GraphQLClient} from 'graphql-request'
import GraphEndpoint from '../graph.default'

import {Indexer} from './indexer'
import {ChainbridgeConfirmData, SendingHistory, RecevingHistory} from './types'

export class ParaIndexer extends Indexer {
  public client: GraphQLClient

  constructor(account: string, network: string) {
    super(account, network)

    this.client = new GraphQLClient(GraphEndpoint[this.network], {
      timeout: 300000,
    })
  }

  chainbridgeConfirmData(
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
                    cTxReceiveds (orderBy: CREATED_AT_DESC, filter: {originChainId: {equalTo: ${originChainId}}, depositNonce: {equalTo: \"${depositNonce}\"}}) {
                        nodes {
                            id
                            createdAt
                            originChainId
                            depositNonce
                            resourceId
                            status
                            executeTx {
                                hash
                            }
                        }
                    }
                }
                `)
      } catch (e) {
        reject(
          new Error(
            'Error getting cTxReceiveds from blockchain: ' +
              JSON.stringify(e) +
              JSON.stringify(data)
          )
        )
      }
      resolve(data.cTxReceiveds)
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
      if (this.network === 'thala') {
        let data
        try {
          data = await this.client.request(gql`
                        {
                            sendingCounts (filter: {id: {equalTo: \"${this.account.toLowerCase()}\"}}) {
                                nodes {
                                    id
                                    count
                                }
                            }
                        }
                        `)
        } catch (e) {
          reject(
            Error(
              'Error getting sendingCounts from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            )
          )
        }
        resolve(data.sendingCounts.nodes[0])
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  sendingHistory(): Promise<SendingHistory> {
    return new Promise<SendingHistory>(async (resolve, reject) => {
      if (this.network === 'thala') {
        let data
        try {
          data = await this.client.request(gql`
                        {
                            xTransferSents (filter: {sender: {equalTo: \"${this.account.toLowerCase()}\"}}) {
                                nodes {
                                    id
                                    createdAt
                                    sender
                                    index
                                    isXcm
                                    xcm {
                                        id
                                        asset
                                        sender
                                        recipient
                                        amount
                                    }
                                    isChainbridge
                                    chainbridge {
                                        id
                                        destChainId
                                        depositNonce
                                        resourceId
                                        recipient
                                        amount
                                    }
                                }
                            }
                        }
                        `)
        } catch (e) {
          reject(
            new Error(
              'Error getting xTransferSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            )
          )
        }
        resolve(data.xTransferSents.nodes)
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  limittedSendingHistory(limit: number): Promise<SendingHistory> {
    return new Promise<SendingHistory>(async (resolve, reject) => {
      if (this.network === 'thala') {
        let data
        try {
          data = await this.client.request(gql`
                        {
                            xTransferSents (first: ${limit}, orderBy: CREATED_AT_DESC, filter: {sender: {equalTo: \"${this.account.toLowerCase()}\"}}) {
                                nodes {
                                    id
                                    createdAt
                                    sender
                                    index
                                    isXcm
                                    xcm {
                                        id
                                        asset
                                        sender
                                        recipient
                                        amount
                                    }
                                    isChainbridge
                                    chainbridge {
                                        id
                                        destChainId
                                        depositNonce
                                        resourceId
                                        recipient
                                        amount
                                    }
                                }
                            }
                        }
                        `)
        } catch (e) {
          reject(
            new Error(
              'Error getting xTransferSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            )
          )
        }
        resolve(data.xTransferSents.nodes)
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  rangeSendingHistory(from: number, to: number): Promise<SendingHistory> {
    return new Promise<SendingHistory>(async (resolve, reject) => {
      if (this.network === 'thala') {
        let data
        try {
          data = await this.client.request(gql`
                        {
                            xTransferSents (orderBy: CREATED_AT_DESC, filter: {sender: {equalTo: \"${this.account.toLowerCase()}\"}, index: {greaterThanOrEqualTo: ${Number(
            from
          )}, lessThanOrEqualTo:${Number(to)}}}) {
                                nodes {
                                    id
                                    createdAt
                                    sender
                                    index
                                    isXcm
                                    xcm {
                                        id
                                        asset
                                        sender
                                        recipient
                                        amount
                                    }
                                    isChainbridge
                                    chainbridge {
                                        id
                                        destChainId
                                        depositNonce
                                        resourceId
                                        recipient
                                        amount
                                    }
                                }
                            }
                        }
                        `)
        } catch (e) {
          reject(
            new Error(
              'Error getting xTransferSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            )
          )
        }
        resolve(data.xTransferSents.nodes)
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  recevingCount(): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      if (this.network === 'thala') {
        let data
        try {
          data = await this.client.request(gql`
                        {
                            recevingCounts (filter: {id: {equalTo: \"${this.account.toLowerCase()}\"}}) {
                                nodes {
                                    id
                                    count
                                }
                            }
                        }
                        `)
        } catch (e) {
          reject(
            new Error(
              'Error getting recevingCounts from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            )
          )
        }
        resolve(data.recevingCounts.nodes[0])
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  RecevingHistory(): Promise<RecevingHistory> {
    return new Promise<RecevingHistory>(async (resolve, reject) => {
      if (this.network === 'thala') {
        let data
        try {
          data = await this.client.request(gql`
                        {
                            xTransferDepositeds (filter: {isLocal: {equalTo: true}, account: {equalTo: \"${this.account.toLowerCase()}\"}}) {
                                nodes {
                                    id
                                    createdAt
                                    asset
                                    amount
                                    account
                                    index
                                }
                            }
                        }
                        `)
        } catch (e) {
          reject(
            new Error(
              'Error getting xTransferDepositeds from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            )
          )
        }
        resolve(data.xTransferDepositeds.nodes)
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  limittedRecevingHistory(limit: number): Promise<RecevingHistory> {
    return new Promise<RecevingHistory>(async (resolve, reject) => {
      if (this.network === 'thala') {
        let data
        try {
          data = await this.client.request(gql`
                        {
                            xTransferDepositeds (first: ${limit}, orderBy: CREATED_AT_DESC, filter: {isLocal: {equalTo: true}, account: {equalTo: \"${this.account.toLowerCase()}\"}}) {
                                nodes {
                                    id
                                    createdAt
                                    asset
                                    amount
                                    account
                                    index
                                }
                            }
                        }
                        `)
        } catch (e) {
          reject(
            new Error(
              'Error getting xTransferDepositeds from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            )
          )
        }
        resolve(data.xTransferDepositeds.nodes)
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  rangeRecevingHistory(from: number, to: number): Promise<RecevingHistory> {
    return new Promise<RecevingHistory>(async (resolve, reject) => {
      if (this.network === 'thala') {
        let data
        try {
          data = await this.client.request(gql`
                        {
                            xTransferDepositeds (orderBy: CREATED_AT_DESC, filter: {isLocal: {equalTo: true}, account: {equalTo: \"${this.account.toLowerCase()}\"}, index: {greaterThanOrEqualTo: ${Number(
            from
          )}, lessThanOrEqualTo:${Number(to)}}}) {
                                nodes {
                                    id
                                    createdAt
                                    asset
                                    amount
                                    account
                                    index
                                }
                            }
                        }
                        `)
        } catch (e) {
          reject(
            new Error(
              'Error getting xTransferDepositeds from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            )
          )
        }
        resolve(data.xTransferDepositeds.nodes)
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }
}
