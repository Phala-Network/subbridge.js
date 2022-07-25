# subbridge.js - SubBridge JavaScript SDK

## Getting started

### Install

- Install by yarn,

    ```bash
    yarn add subbridge.js
    ```

- Or use prebuilt target `dist/subbridge.min.js` in browser,

- Or build from source code,

    ```bash
    yarn build
    ```

### Usage

- Use **Transaction** issue crosschain transaction

- Use **Indexer** query crosschain transaction histtory

    ```typescript
    const { ParaIndexer } = require(`subbridge.js`);
    const { Keyring } = require('@polkadot/api');

    const account = keyring.addFromUri('//Alice');
    const paraIndexer = new ParaIndexer(account.publicKey);

    // Query all sending history issued from Khala network
    const history = await paraIndexer.sendingHistory();

    // You should then get the history list from our indexing service
    ```

## API

Head to [APIs](./API.md) see all the API list currently supported.