const { gql, GraphQLClient } = require('graphql-request');
const { ChainId: ChainBridgeChainId } = require('../chainbridge');
const GraphEndpoint = require('../graph.default');

function getChainbridgeChainid(network) {
    if (!ChainBridgeChainId.hasOwnProperty(network.toLowerCase())) {
        throw new Error('Network does not exist.')
    }
    return ChainBridgeChainId[network.toLowerCase()];
}

async function chainbridgeSendCount(network, sender) {
    let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
    let data;
    try {
        data = await client.request(gql`
        {
            sendingCounts (where: {id: \"${sender.toLowerCase()}\"}) {
                id
                count
            }
        }
        `);
    } catch (e) {
        throw new Error(
          'Error getting ctxSents from blockchain: ' +
            JSON.stringify(e) +
            JSON.stringify(data)
        );
    }
    return data.sendingCounts;
}

async function chainbridgeReceiveCount(network, recipient) {
    let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
    let data;
    try {
        data = await client.request(gql`
        {
            recevingCounts (where: {id: \"${recipient.toLowerCase()}\"}) {
                id
                count
            }
        }
        `);
    } catch (e) {
        throw new Error(
          'Error getting ctxSents from blockchain: ' +
            JSON.stringify(e) +
            JSON.stringify(data)
        );
    }
    return data.recevingCounts;
}

async function chainbridgeEvmSendHistory(network, sender) {
    let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
    let data;
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
        `);
    } catch (e) {
        throw new Error(
          'Error getting ctxSents from blockchain: ' +
            JSON.stringify(e) +
            JSON.stringify(data)
        );
    }
    return data.ctxSents;
}

async function chainbridgeEvmLimittedSendHistory(network, sender, count) {
    let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
    let data;
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
        `);
    } catch (e) {
        throw new Error(
          'Error getting ctxSents from blockchain: ' +
            JSON.stringify(e) +
            JSON.stringify(data)
        );
    }
    return data.ctxSents;
}

async function chainbridgeEvmRangeSendHistory(network, sender, from, to) {
    let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
    let data;
    try {
        data = await client.request(gql`
        {
            ctxSents (orderBy: createdAt, orderDirection: desc, where: {sender: \"${sender.toLowerCase()}\", index_gte: ${Number(from)}, index_lte: ${Number(to)}}) {
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
        `);
    } catch (e) {
        throw new Error(
          'Error getting ctxSents from blockchain: ' +
            JSON.stringify(e) +
            JSON.stringify(data)
        );
    }
    return data.ctxSents;
}

async function chainbridgeEvmReceivedHistory(network, recipient) {
    let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
    let data;
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
        `);
    } catch (e) {
        throw new Error(
          "Error getting ctxSents from blockchain: " +
            JSON.stringify(e) +
            JSON.stringify(data)
        );
    }
    return data.erc20Depositeds;
}

async function chainbridgeEvmLimittedReceivedHistory(network, recipient, count) {
    let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
    let data;
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
                iindex
            }
        }
        `);
    } catch (e) {
        throw new Error(
          "Error getting ctxSents from blockchain: " +
            JSON.stringify(e) +
            JSON.stringify(data)
        );
    }
    return data.erc20Depositeds;
}

async function chainbridgeEvmRangeReceivedHistory(network, recipient, from, to) {
    let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
    let data;
    // Retrieve ERC20Deposited records according to recipient
    try {
        data = await client.request(gql`
        {
            erc20Depositeds (orderBy: createdAt, orderDirection: desc, where: {recipient: \"${recipient.toLowerCase()}\",  index_gte: ${Number(from)}, index_lte: ${Number(to)}}) {
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
        `);
    } catch (e) {
        throw new Error(
          "Error getting ctxSents from blockchain: " +
            JSON.stringify(e) +
            JSON.stringify(data)
        );
    }
    return data.erc20Depositeds;
}

async function chainbridgeEvmReceiveConfirm(network, originChainId, depositNonce) {
    let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
    let data;
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
        `);
    } catch (e) {
        throw new Error(
          "Error getting ctxSents from blockchain: " +
            JSON.stringify(e) +
            JSON.stringify(data)
        );
    }
    return data.ctxReceiveds;
}

module.exports = {
    getChainbridgeChainid,
    chainbridgeSendCount,
    chainbridgeReceiveCount,
    chainbridgeEvmSendHistory,
    chainbridgeEvmLimittedSendHistory,
    chainbridgeEvmRangeSendHistory,
    chainbridgeEvmReceivedHistory,
    chainbridgeEvmLimittedReceivedHistory,
    chainbridgeEvmRangeReceivedHistory,
    chainbridgeEvmReceiveConfirm,
}
