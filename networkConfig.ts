export enum Network {
  LOCAL = 1337,
  GOERLI = 5,
  SCROLL = 534353,
}

export type NetworkConfig = {
  multisigAddressList: { admin?: `0x${string}`; fee: `0x${string}` }
}

const local: NetworkConfig = {
  multisigAddressList: {
    fee: '0x3Fba71369E5E2E947AE2320274b1677de7D28120',
  },
}

const goerli: NetworkConfig = {
  multisigAddressList: {
    fee: '0xfBF3D68b1750032BDDa47D555D68143CfBB43EbC',
    admin: '0x99f117069F9ED15476003502AD8D96107A180648',
  },
}

const scroll: NetworkConfig = {
  multisigAddressList: {
    fee: '0xfBF3D68b1750032BDDa47D555D68143CfBB43EbC',
    admin: '0x99f117069F9ED15476003502AD8D96107A180648',
  },
}

export const configs: { [networkId in Network]: NetworkConfig } = {
  [Network.LOCAL]: local,
  [Network.GOERLI]: goerli,
  [Network.SCROLL]: scroll,
}

export const getConfig = (networkId: Network): NetworkConfig => {
  return configs[networkId]
}
