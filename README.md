# DEX backend

Implementation of API for decentralized exchange.

## Installation

Copy project and install dependencies

```bash
git clone git@github.com:ownfrezzy/sfxdx-test.git
npm ci
```

## Environment

.env file must be created in the root folder. Required parameters:

```bash
# Mongodb connection string
MONGO_URL = mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
# Port to listen, 3000 by default
PORT = 3000
# Web-socket RPC endpoint
WEB3_RPC_ENDPOINT = wss://goerli.infura.io/ws/v3/<API-KEY>
# Order controller contract address in given network
ORDER_CONTROLLER_ADDRESS = 0xab09170C5e182aAF58f7f8fBA3D78fb7E6E41391
```

## Run locally

```javascript
nest start
```

## API documentation

```http
GET /api
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
