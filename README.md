# subbridge.js - SubBridge JavaScript SDK

## **❗️Work in progress, DO NOT USE❗️**

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

- Issue crosschain transaction with **Transaction**

- Query crosschain transaction history with **Indexer**

  ```typescript
	const {Indexer} = require('subbridge.js')
	const {Keyring} = require('@polkadot/api')

	const account = keyring.addFromUri('//Alice')
	const paraIndexer = new Indexer.ParaIndexer(
      // Account public key
      '0x7804e66ec9eea3d8daf6273ffbe0a8af25a8879cf43f14d0ebbb30941f578242',
      // Name of parachain network
      'thala'
	)
	// Query all sending history issued from Khala network
	const history = await paraIndexer.sendingHistory()

	// You should then get the history list from our indexing service
  ```

  Head to [example](./examples/) folder see more usage. Run examples by executing `yarn build` and `node example/<script name>`.

## API

Head to [APIs](./doc/api-indexer.md) see all the API list currently supported.
