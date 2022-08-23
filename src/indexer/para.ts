import {gql, GraphQLClient} from 'graphql-request'
import {GraphEndpoint} from '../graph.default'

import {Indexer} from './indexer'

import {
  Option,
  Count,
  ChainbridgeConfirmData,
  SendingHistory,
  RecevingHistory,
} from './types'
import {
  paraFilterSingleXCMSendingData,
  paraFilterSingleChainbridgeSendingData,
} from './utils'

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
                    ctxReceiveds (orderBy: createdAt, orderDirection: desc, where: {originChainId: ${originChainId}, depositNonce: \"${depositNonce}\"}) {
                        id
                        createdAt
                        originChainId
                        depositNonce
                        resourceId
                        status
                        executeTx {
                            sender
                            hash
                        }
                    }
                }
                `
        )
        .then((data) => {
          if (data.ctxReceiveds?.length > 0) {
            resolve({
              id: data.ctxReceiveds,
              originChainId: data.ctxReceiveds.originChainId,
              depositNonce: data.ctxReceiveds.depositNonce,
              status: data.ctxReceiveds.status,
              executeTx: data.ctxReceiveds.executeTx,
            })
          } else {
            resolve(null)
          }
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

  sendingCount(): Promise<Option<Count>> {
    return new Promise<Option<Count>>((resolve, reject) => {
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
            if (data.sendingCounts?.nodes.length > 0) {
              resolve({
                account: data.sendingCounts.nodes[0].id,
                count: data.sendingCounts.nodes[0].count,
              })
            } else {
              resolve(null)
            }
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

  sendingHistory(): Promise<Option<SendingHistory[]>> {
    return new Promise<Option<SendingHistory[]>>((resolve, reject) => {
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
                                        sendTx {
                                            sender
                                            hash
                                        }
                                    }
                                    isChainbridge
                                    chainbridge {
                                        id
                                        destChainId
                                        depositNonce
                                        resourceId
                                        recipient
                                        amount
                                        sendTx {
                                            sender
                                            hash
                                        }
                                    }
                                }
                            }
                        }
                        `
          )
          .then((data) => {
            if (data.xTransferSents.nodes?.length > 0) {
              resolve(
                data.xTransferSents.nodes.map((raw: any) => {
                  if (raw.isXcm === true) {
                    return paraFilterSingleXCMSendingData(raw)
                  } else {
                    return paraFilterSingleChainbridgeSendingData(raw)
                  }
                })
              )
            } else {
              resolve(null)
            }
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

  limittedSendingHistory(limit: number): Promise<Option<SendingHistory[]>> {
    return new Promise<Option<SendingHistory[]>>((resolve, reject) => {
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
                                        sendTx {
                                            sender
                                            hash
                                        }
                                    }
                                    isChainbridge
                                    chainbridge {
                                        id
                                        destChainId
                                        depositNonce
                                        resourceId
                                        recipient
                                        amount
                                        sendTx {
                                            sender
                                            hash
                                        }
                                    }
                                }
                            }
                        }
                        `
          )
          .then((data) => {
            if (data.xTransferSents.nodes?.length > 0) {
              resolve(
                data.xTransferSents.nodes.map((raw: any) => {
                  if (raw.isXcm === true) {
                    return paraFilterSingleXCMSendingData(raw)
                  } else {
                    return paraFilterSingleChainbridgeSendingData(raw)
                  }
                })
              )
            } else {
              resolve(null)
            }
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

  rangeSendingHistory(
    from: number,
    to: number
  ): Promise<Option<SendingHistory[]>> {
    return new Promise<Option<SendingHistory[]>>((resolve, reject) => {
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
                                        sendTx {
                                            sender
                                            hash
                                        }
                                    }
                                    isChainbridge
                                    chainbridge {
                                        id
                                        destChainId
                                        depositNonce
                                        resourceId
                                        recipient
                                        amount
                                        sendTx {
                                            sender
                                            hash
                                        }
                                    }
                                }
                            }
                        }
                        `
          )
          .then((data) => {
            if (data.xTransferSents.nodes?.length > 0) {
              resolve(
                data.xTransferSents.nodes.map((raw: any) => {
                  if (raw.isXcm === true) {
                    return paraFilterSingleXCMSendingData(raw)
                  } else {
                    return paraFilterSingleChainbridgeSendingData(raw)
                  }
                })
              )
            } else {
              resolve(null)
            }
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

  recevingCount(): Promise<Option<Count>> {
    return new Promise<Option<Count>>((resolve, reject) => {
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
            if (data.recevingCounts?.nodes.length > 0) {
              resolve({
                account: data.recevingCounts.nodes[0].id,
                count: data.recevingCounts.nodes[0].count,
              })
            } else {
              resolve(null)
            }
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

  recevingHistory(): Promise<RecevingHistory[]> {
    return new Promise<RecevingHistory[]>((resolve, reject) => {
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

  limittedRecevingHistory(limit: number): Promise<RecevingHistory[]> {
    return new Promise<RecevingHistory[]>((resolve, reject) => {
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

  rangeRecevingHistory(from: number, to: number): Promise<RecevingHistory[]> {
    return new Promise<RecevingHistory[]>((resolve, reject) => {
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
