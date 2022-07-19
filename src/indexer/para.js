const { gql, GraphQLClient } = require('graphql-request');
const GraphEndpoint = require('../graph.default');

/************** Parachain Indexer Interfaces *************/
async function paraSendCount(network, account) {
    if (network.toLowerCase() === 'thala') {
        let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
        let data;
        try {
            data = await client.request(gql`
            {
                sendingCounts (filter: {id: {equalTo: \"${account.toLowerCase()}\"}}) {
                    nodes {
                        id
                        count
                    }
                }
            }
            `);
        } catch (e) {
            throw new Error(
              'Error getting sendingCounts from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            );
        }
        return data.sendingCounts.nodes[0];
    } else {
        throw new Error('Unsupported network');
    }
}

async function paraSendHistory(network, sender) {
    if (network.toLowerCase() === 'thala') {
        let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
        let data;
        try {
            data = await client.request(gql`
            {
                xTransferSents (filter: {sender: {equalTo: \"${sender.toLowerCase()}\"}}) {
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
            `);
        } catch (e) {
            throw new Error(
              'Error getting xTransferSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            );
        }
        return data.xTransferSents.nodes;
    } else {
        throw new Error('Unsupported network');
    }
}

async function paraLimittedSendHistory(network, sender, limit) {
    if (network.toLowerCase() === 'thala') {
        let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
        let data;
        try {
            data = await client.request(gql`
            {
                xTransferSents (first: ${limit}, orderBy: CREATED_AT_DESC, filter: {sender: {equalTo: \"${sender.toLowerCase()}\"}}) {
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
            `);
        } catch (e) {
            throw new Error(
              'Error getting xTransferSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            );
        }
        return data.xTransferSents.nodes;
    } else {
        throw new Error('Unsupported network');
    }
}

async function paraRangeSendHistory(network, sender, from, to) {
    if (network.toLowerCase() === 'thala') {
        let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
        let data;
        try {
            data = await client.request(gql`
            {
                xTransferSents (orderBy: CREATED_AT_DESC, filter: {sender: {equalTo: \"${sender.toLowerCase()}\"}, index: {greaterThanOrEqualTo: ${Number(from)}, lessThanOrEqualTo:${Number(to)}}}) {
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
            `);
        } catch (e) {
            throw new Error(
              'Error getting xTransferSents from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            );
        }
        return data.xTransferSents.nodes;
    } else {
        throw new Error('Unsupported network');
    }
}

async function paraReceiveCount(network, recipient) {
    if (network.toLowerCase() === 'thala') {
        let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
        let data;
        try {
            data = await client.request(gql`
            {
                recevingCounts (filter: {id: {equalTo: \"${recipient.toLowerCase()}\"}}) {
                    nodes {
                        id
                        count
                    }
                }
            }
            `);
        } catch (e) {
            throw new Error(
                'Error getting recevingCounts from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            );
        }
        return data.recevingCounts.nodes[0];
    } else {
        throw new Error('Unsupported network');
    }
}

async function paraReceiveHistory(network, recipient) {
    if (network.toLowerCase() === 'thala') {
        let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
        let data;
        try {
            data = await client.request(gql`
            {
                xTransferDepositeds (filter: {isLocal: {equalTo: true}, account: {equalTo: \"${recipient.toLowerCase()}\"}}) {
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
            `);
        } catch (e) {
            throw new Error(
              'Error getting xTransferDepositeds from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            );
        }
        return data.xTransferDepositeds.nodes;
    } else {
        throw new Error('Unsupported network');
    }
}

async function paraLimittedReceiveHistory(network, recipient, limit) {
    if (network.toLowerCase() === 'thala') {
        let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
        let data;
        try {
            data = await client.request(gql`
            {
                xTransferDepositeds (first: ${limit}, orderBy: CREATED_AT_DESC, filter: {isLocal: {equalTo: true}, account: {equalTo: \"${recipient.toLowerCase()}\"}}) {
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
            `);
        } catch (e) {
            throw new Error(
              'Error getting xTransferDepositeds from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            );
        }
        return data.xTransferDepositeds.nodes;
    } else {
        throw new Error('Unsupported network');
    }
}

async function paraRangeReceiveHistory(network, recipient, from, to) {
    if (network.toLowerCase() === 'thala') {
        let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
        let data;
        try {
            data = await client.request(gql`
            {
                xTransferDepositeds (orderBy: CREATED_AT_DESC, filter: {isLocal: {equalTo: true}, account: {equalTo: \"${recipient.toLowerCase()}\"}, index: {greaterThanOrEqualTo: ${Number(from)}, lessThanOrEqualTo:${Number(to)}}}) {
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
            `);
        } catch (e) {
            throw new Error(
              'Error getting xTransferDepositeds from blockchain: ' +
                JSON.stringify(e) +
                JSON.stringify(data)
            );
        }
        return data.xTransferDepositeds.nodes;
    } else {
        throw new Error('Unsupported network');
    }
}

async function paraChainbridgeReceiveConfirm(network, originChainId, depositNonce) {
    let client = new GraphQLClient(GraphEndpoint[network.toLowerCase()], { timeout: 300000 });
    let data;
    try {
        data = await client.request(gql`
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
        `);
    } catch (e) {
        throw new Error(
          "Error getting cTxReceiveds from blockchain: " +
            JSON.stringify(e) +
            JSON.stringify(data)
        );
    }
    return data.cTxReceiveds;
}

module.exports = {
    paraSendCount,
    paraSendHistory,
    paraLimittedSendHistory,
    paraRangeSendHistory,
    paraReceiveCount,
    paraReceiveHistory,
    paraLimittedReceiveHistory,
    paraRangeReceiveHistory,
    paraChainbridgeReceiveConfirm
}
