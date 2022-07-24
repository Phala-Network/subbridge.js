

# Indexer

## Classes

![image ](./img/indexer-class.png)

```typescript
abstract class Indexer {
    /**
     * Account value should be either a 32 bytes substrate-compitable public key * or a 20 bytes Ethereum-like account address.
     */
    public account: string;

    abstract sendingCount(): number;
    abstract sendingHistory(): SendingHistory;
    abstract limittedSendingHistory(limit: number): SendingHistory;
    abstract rangeSendingHistory(limit: number): SendingHistory;

    abstract recevingCount(): number;
    abstract RecevingHistory(): SendingHistory;
    abstract limittedRecevingHistory(limit: number): SendingHistory;
    abstract rangeRecevingHistory(limit: number): SendingHistory;
}
```

## MultiAsset & MultiLocation

Both `MultiAsset` and `MultiLocation` are defined in [@polkadot.js/types]()

## Tx

```typescript

interface Tx {
    sender: string;
    hash: string;
}
```

## Sending count & receving count

```typescript
interface Count {
    account: string;
    count: string;
}
```

## Crosschain transaction status

```typescript
interface Status {
    Sent,
    Forwarded,
    Confirmed,
    Failed,
}
```

## Sending history

```typescript
interface SendingHistory {
    createdAt: string;
    isXcm: boolean;
    xcmSendingData?: XCMSendingData;
    isChainbridge: boolean;
    chainbridge?: ChainbridgeSendingData;
    status: string;
}

interface XCMSendingData {
    id: string;
    asset: MultiAsset;
    recipient: string;
    amount: string;
    index: number;
    sendTx: Tx;
    sender: string;
}

interface ChainbridgeSendingData {
    id: string;
    destChainId: number;
    depositNonce: number;
    resourceId: string;
    amount: string;
    recipient: string;
    index: number;
    sendTx: Tx;
    sender: string;
}
```

## Receving history

```typescript
interface RecevingHistory {
    createdAt: string;
    isXcm: boolean;
    xcmSendingData?: XCMRecevingData;
    isChainbridge: boolean;
    chainbridge?: ChainbridgeRecevingData;
}

interface XCMRecevingData {
    id: string;
    asset: MultiAsset;
    amount: string;
    account: string;
    index: number;
}

interface ChainbridgeRecevingData {
    id: string;
    asset: MultiAsset;
    amount: string;
    account: string;
    index: number;
    originChainId: number;
    depositNonce: number;
    resourceId: string;
    status: string;
    executeTx: Tx;
}
```