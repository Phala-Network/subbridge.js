import {gql, GraphQLClient} from 'graphql-request'
import {GraphEndpoint} from '../graph.default'

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
                        resourceId
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
            new Error(
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
      if (this.network === 'thala') {
        this.client
          .request(
            gql`
                        {
                            sendingCounts (filter: {id: {equalTo: \"${this.account.toLowerCase()}\"}}) {
                                nodes {
                                    id
                                    count
                                }
                            }
                        }
                        `
          )
          .then((data) => {
            resolve(data.sendingCounts.nodes[0])
          })
          .catch((e) => {
            reject(
              Error(
                'Error getting sendingCounts from blockchain: ' +
                  JSON.stringify(e)
              )
            )
          })
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  sendingHistory(): Promise<SendingHistory> {
    return new Promise<SendingHistory>((resolve, reject) => {
      if (this.network === 'thala') {
        this.client
          .request(
            gql`
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
                        `
          )
          .then((data) => {
            resolve(data.xTransferSents.nodes)
          })
          .catch((e) => {
            reject(
              new Error(
                'Error getting xTransferSents from blockchain: ' +
                  JSON.stringify(e)
              )
            )
          })
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  limittedSendingHistory(limit: number): Promise<SendingHistory> {
    return new Promise<SendingHistory>((resolve, reject) => {
      if (this.network === 'thala') {
        this.client
          .request(
            gql`
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
                        `
          )
          .then((data) => {
            resolve(data.xTransferSents.nodes)
          })
          .catch((e) => {
            reject(
              new Error(
                'Error getting xTransferSents from blockchain: ' +
                  JSON.stringify(e)
              )
            )
          })
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  rangeSendingHistory(from: number, to: number): Promise<SendingHistory> {
    return new Promise<SendingHistory>((resolve, reject) => {
      if (this.network === 'thala') {
        this.client
          .request(
            gql`
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
                        `
          )
          .then((data) => {
            resolve(data.xTransferSents.nodes)
          })
          .catch((e) => {
            reject(
              new Error(
                'Error getting xTransferSents from blockchain: ' +
                  JSON.stringify(e)
              )
            )
          })
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  recevingCount(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (this.network === 'thala') {
        this.client
          .request(
            gql`
                        {
                            recevingCounts (filter: {id: {equalTo: \"${this.account.toLowerCase()}\"}}) {
                                nodes {
                                    id
                                    count
                                }
                            }
                        }
                        `
          )
          .then((data) => {
            resolve(data.recevingCounts.nodes[0])
          })
          .catch((e) => {
            reject(
              new Error(
                'Error getting recevingCounts from blockchain: ' +
                  JSON.stringify(e)
              )
            )
          })
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  recevingHistory(): Promise<RecevingHistory> {
    return new Promise<RecevingHistory>((resolve, reject) => {
      if (this.network === 'thala') {
        this.client
          .request(
            gql`
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
                        `
          )
          .then((data) => {
            resolve(data.xTransferDepositeds.nodes)
          })
          .catch((e) => {
            reject(
              new Error(
                'Error getting xTransferDepositeds from blockchain: ' +
                  JSON.stringify(e)
              )
            )
          })
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  limittedRecevingHistory(limit: number): Promise<RecevingHistory> {
    return new Promise<RecevingHistory>((resolve, reject) => {
      if (this.network === 'thala') {
        this.client
          .request(
            gql`
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
                        `
          )
          .then((data) => {
            resolve(data.xTransferDepositeds.nodes)
          })
          .catch((e) => {
            reject(
              new Error(
                'Error getting xTransferDepositeds from blockchain: ' +
                  JSON.stringify(e)
              )
            )
          })
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }

  rangeRecevingHistory(from: number, to: number): Promise<RecevingHistory> {
    return new Promise<RecevingHistory>((resolve, reject) => {
      if (this.network === 'thala') {
        this.client
          .request(
            gql`
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
                        `
          )
          .then((data) => {
            resolve(data.xTransferDepositeds.nodes)
          })
          .catch((e) => {
            reject(
              new Error(
                'Error getting xTransferDepositeds from blockchain: ' +
                  JSON.stringify(e)
              )
            )
          })
      } else {
        reject(new Error('Unsupported network'))
      }
    })
  }
}
