import { formatUnits } from 'ethers';
import { dapis, getChains as getChainsFromDapiManagement } from '@api3/dapi-management'
import { CHAINS } from '@api3/chains';
import { computeDapiProxyWithOevAddress } from '@api3/contracts';

export const parseETH = (value: any) => {
    if (value === undefined) return '0';
    return formatUnits(value, 18);
}

export const COLORS = {
    app: '#f2f2f2',
    appDarker: '#e1e1e1',
    bg: '#ffffff',
    table: "blue.900",
    info: "gray.500",
    main: "#ffffff",
    button: "blue.700",
    buttonDisabled: "gray.800",
    caution: "yellow.700",
};

export const copy = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(err => { console.error('Failed to write clipboard contents: ', err) });
    } else {
        alert("Clipboard API not available");
    }
}

export const trimHash = (hash: string) => {
    return hash.substring(0, 6) + "..." + hash.substring(hash.length - 4);
}

export function getDapis(): typeof dapis {
    return dapis.filter((dapi) => dapi.stage === 'active');
}

export function getEthUsdDapi() {
    return dapis.find((dapi) => dapi.name === 'ETH/USD');
}

export function getChains() {
    const activeChains = getChainsFromDapiManagement().filter((chain) => chain.stage === 'active');
    const filteredChains = CHAINS.filter((chain) => activeChains.find((activeChain) => activeChain.id === chain.id));
    return filteredChains.filter((chain) => chain.testnet === false);
}

export function getChain(id: string) {
    return CHAINS.find((chain) => chain.id === id);
}

export function getDapiProxyWithOevAddress(chainId: string, dApiName: string): `0x${string}` {
    const oevBeneficiary = "0x07b589f06bd0a5324c4e2376d66d2f4f25921de1"
    const metadata = "0x"
    return computeDapiProxyWithOevAddress(chainId, dApiName, oevBeneficiary, metadata) as `0x${string}`;
}
