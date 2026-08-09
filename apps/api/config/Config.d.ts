declare module 'node-config-ts' {
  interface IConfig {
    host: Host
    port: string
    aws: Aws
    blocknative: Blocknative
    eth: Eth
    imageGenerator: ImageGenerator
    ipfs: Ipfs
    imx: Imx
  }
  interface Imx {
    mainnet: Mainnet
    sepolia: Mainnet
  }
  interface Mainnet {
    apiKey: string
    client: Client
    company: Company
    project: Project
    collection: Collection
  }
  interface Collection {
    contractAddress: string
    name: string
    description: string
    iconUrl: string
    imageUrl: string
    metadataApiUrl: string
  }
  interface Project {
    name: string
    legacyId: string
  }
  interface Company {
    name: string
    contact: string
    organizationId: string
  }
  interface Client {
    publicApiUrl: string
    starkContractAddress: string
    registrationContractAddress: string
    gasLimit: string
    gasPrice: string
    enableDebug: boolean
  }
  interface Ipfs {
    authorization: string
    protocol: string
    host: string
    port: number
    path: string
    gatewayURL: string
    pinata: Pinata
  }
  interface Pinata {
    pinataApiKey: string
    pinataSecretApiKey: string
  }
  interface ImageGenerator {
    baseURL: string
    secret: string
    version: string
  }
  interface Eth {
    account: Account
    network: string
    infura: string
    etherscan: string
    alchemy: Host
    opensea: string
  }
  interface Account {
    pk: string
  }
  interface Blocknative {
    apiKey: ApiKey
    webhookSecret: string
  }
  interface ApiKey {
    comics: string
    degens: string
    p2e: string
  }
  interface Aws {
    apiSecret: string
    s3: S3
  }
  interface S3 {
    bucket: string
    clientConfig: ClientConfig
  }
  interface ClientConfig {
    region: string
    credentials: Credentials
  }
  interface Credentials {
    accessKeyId: string
    secretAccessKey: string
  }
  interface Host {
    mainnet: string
    sepolia: string
  }
  export const config: Config
  export type Config = IConfig
}
