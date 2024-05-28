import { CHAINS, viemConfig } from '@api3/chains';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

export const projectId = String('72b9b848e4e945c6be129961f0ead954')

export const chainIds = CHAINS.filter(({ testnet }) => !testnet).map(({ id }) => String(id));
const filteredChains = viemConfig.chains().filter(({ id }) => chainIds.includes(String(id)));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const arrayFromChains = filteredChains.map(({ ...rest }) => rest);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const chainsWithoutFirstElement = [...arrayFromChains.slice(1)];

export const chains: [(typeof arrayFromChains)[0], ...typeof chainsWithoutFirstElement] = [
  arrayFromChains[0],
  ...chainsWithoutFirstElement,
];

const metadata = {
  name: 'OEV Playground',
  description: 'OEV Playground',
  url: 'https://api3dao.github.io/',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  verifyUrl: 'https://web3modal.com/verify',
};

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});
