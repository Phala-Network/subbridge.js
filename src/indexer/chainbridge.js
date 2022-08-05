import {gql, GraphQLClient} from 'graphql-request'
import {ChainId as ChainBridgeChainId} from '../chainbridge'
import GraphEndpoint from '../graph.default'

export function chainbridgeChainid(network) {
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

export async function chainbridgeSendCount(network, sender) {
  const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
    timeout: 300000,
  })
  let data
  try {
    data = await client.request(gql`
        {
            sendingCounts (where: {id: \"${sender.toLowerCase()}\"}) {
                id
                count
            }
        }
        `)
  } catch (e) {
    throw new Error(
      'Error getting ctxSents from blockchain: ' +
        JSON.stringify(e) +
        JSON.stringify(data)
    )
  }
  return data.sendingCounts
}

export async function chainbridgeReceiveCount(network, recipient) {
  const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
    timeout: 300000,
  })
  let data
  try {
    data = await client.request(gql`
        {
            recevingCounts (where: {id: \"${recipient.toLowerCase()}\"}) {
                id
                count
            }
        }
        `)
  } catch (e) {
    throw new Error(
      'Error getting ctxSents from blockchain: ' +
        JSON.stringify(e) +
        JSON.stringify(data)
    )
  }
  return data.recevingCounts
}

export async function chainbridgeEvmSendHistory(network, sender) {
  const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
    timeout: 300000,
  })
  let data
  try {
    data = await client.request(gql`
        {
            ctxSents (orderBy: createdAt, orderDirection: desc, where: {sender: \"${sender.toLowerCase()}\"}) {
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
    throw new Error(
      'Error getting ctxSents from blockchain: ' +
        JSON.stringify(e) +
        JSON.stringify(data)
    )
  }
  return data.ctxSents
}

export async function chainbridgeEvmLimittedSendHistory(
  network,
  sender,
  count
) {
  const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
    timeout: 300000,
  })
  let data
  try {
    data = await client.request(gql`
        {
            ctxSents (first: ${count}, orderBy: createdAt, orderDirection: desc, where: {sender: \"${sender.toLowerCase()}\"}) {
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
    throw new Error(
      'Error getting ctxSents from blockchain: ' +
        JSON.stringify(e) +
        JSON.stringify(data)
    )
  }
  return data.ctxSents
}

export async function chainbridgeEvmRangeSendHistory(
  network,
  sender,
  from,
  to
) {
  const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
    timeout: 300000,
  })
  let data
  try {
    data = await client.request(gql`
        {
            ctxSents (orderBy: createdAt, orderDirection: desc, where: {sender: \"${sender.toLowerCase()}\", index_gte: ${Number(
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
    throw new Error(
      'Error getting ctxSents from blockchain: ' +
        JSON.stringify(e) +
        JSON.stringify(data)
    )
  }
  return data.ctxSents
}

export async function chainbridgeEvmReceivedHistory(network, recipient) {
  const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
    timeout: 300000,
  })
  let data
  // Retrieve ERC20Deposited records according to recipient
  try {
    data = await client.request(gql`
        {
            erc20Depositeds (orderBy: createdAt, orderDirection: desc, where: {recipient: \"${recipient.toLowerCase()}\"}) {
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
    throw new Error(
      'Error getting ctxSents from blockchain: ' +
        JSON.stringify(e) +
        JSON.stringify(data)
    )
  }
  return data.erc20Depositeds
}

export async function chainbridgeEvmLimittedReceivedHistory(
  network,
  recipient,
  count
) {
  const client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], {
    timeout: 300000,
  })
  let data
  // Retrieve ERC20Deposited records according to recipient
  try {
    data = await client.request(gql`
        {
            erc20Depositeds (first: ${count}, orderBy: createdAt, orderDirection: desc, where: {recipient: \"${recipient.toLowerCase()}\"}) {
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
    throw new Error(
      'Error getting ctxSents from blockchain: ' +
        JSON.stringify(e) +
        JSON.stringify(data)
    )
  }
  return data.erc20Depositeds
}

export async function chainbridgeEvmRangeReceivedHistory(
  network,
  recipient,
  from,
  to
) {
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
    throw new Error(
      'Error getting ctxSents from blockchain: ' +
        JSON.stringify(e) +
        JSON.stringify(data)
    )
  }
  return data.erc20Depositeds
}

export async function chainbridgeEvmReceiveConfirm(
  network,
  originChainId,
  depositNonce
) {
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
    throw new Error(
      'Error getting ctxReceiveds from blockchain: ' +
        JSON.stringify(e) +
        JSON.stringify(data)
    )
  }
  return data.ctxReceiveds
}
