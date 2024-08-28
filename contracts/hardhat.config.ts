import { HardhatUserConfig } from "hardhat/config";


const config: HardhatUserConfig = {
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
    },
  },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
