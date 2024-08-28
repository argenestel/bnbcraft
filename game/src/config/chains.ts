// chains.ts
export const zkSyncTestnet = {
  id: 280,
  name: 'zkSync Era Testnet',
  network: 'zksync-era-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://testnet.era.zksync.dev'] },
    default: { http: ['https://testnet.era.zksync.dev'] },
  },
  blockExplorers: {
    default: { name: 'zkSync Era Testnet Explorer', url: 'https://goerli.explorer.zksync.io' },
  },
  testnet: true,
};