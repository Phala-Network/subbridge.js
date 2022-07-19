const {
    chainbridgeChainid,
    chainbridgeSendCount,
    chainbridgeReceiveCount,
    chainbridgeEvmSendHistory,
    chainbridgeEvmLimittedSendHistory,
    chainbridgeEvmRangeSendHistory,
    chainbridgeEvmReceivedHistory,
    chainbridgeEvmLimittedReceivedHistory,
    chainbridgeEvmRangeReceivedHistory,
    chainbridgeEvmReceiveConfirm,
} = require('./chainbridge')

const { 
    paraSendCount,
    paraSendHistory,
    paraLimittedSendHistory,
    paraRangeSendHistory,
    paraReceiveCount,
    paraReceiveHistory,
    paraLimittedReceiveHistory,
    paraRangeReceiveHistory,
    paraChainbridgeReceiveConfirm
} = require('./para')


module.exports = {
    chainbridgeChainid,
    chainbridgeSendCount,
    chainbridgeReceiveCount,
    chainbridgeEvmSendHistory,
    chainbridgeEvmLimittedSendHistory,
    chainbridgeEvmRangeSendHistory,
    chainbridgeEvmReceivedHistory,
    chainbridgeEvmLimittedReceivedHistory,
    chainbridgeEvmRangeReceivedHistory,
    chainbridgeEvmReceiveConfirm,

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