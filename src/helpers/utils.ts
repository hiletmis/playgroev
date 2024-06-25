import { formatUnits, hexlify, randomBytes, keccak256, solidityPacked } from 'ethers';
import { dapis, getChains as getChainsFromDapiManagement } from '@api3/dapi-management'
import { CHAINS } from '@api3/chains';
import { computeDapiProxyWithOevAddress, managerMultisigAddresses } from '@api3/contracts';

import {
    encodeAbiParameters,
    decodeAbiParameters,
    parseAbiParameters,
    Hex
} from 'viem';

import { BidCondition, BidDetailsArgs, BidPrices } from '../types';
import { getSignedData } from './signed-api';

export const parseETH = (value: any) => {
    if (value === undefined) return '0';
    return formatUnits(value, 18);
}

export const COLORS = {
    app: '#f2f2f2',
    appDarker: '#e1e1e1',
    bg: '#ffffff',
    table: "blue.900",
    info: "blue.100",
    main: "#ffffff",
    button: "blue.700",
    buttonDisabled: "gray.800",
    caution: "yellow.300",
    select: "blue.100",
    selectDarker: "blue.200",
};

export const BID_CONDITIONS: BidCondition[] = [
    { onchainIndex: BigInt(0), description: 'LTE' },
    { onchainIndex: BigInt(1), description: 'GTE' },
];

export const copy = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(err => { console.error('Failed to write clipboard contents: ', err) });
    } else {
        alert("Clipboard API not available");
    }
}

export const trimHash = (hash: string | undefined) => {
    if (!hash) return "";
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
    return filteredChains.filter((chain) => chain.testnet === false && chain.alias !== 'lukso');
}

export function getChain(id: string) {
    return CHAINS.find((chain) => chain.id === id);
}

export function getDapiProxyWithOevAddress(chainId: string, dApiName: string): `0x${string}` {
    const beneficiaryAddress = managerMultisigAddresses[chainId as keyof typeof managerMultisigAddresses] as `0x${string}`;
    const metadata = "0x"
    return computeDapiProxyWithOevAddress(chainId, dApiName, beneficiaryAddress, metadata) as `0x${string}`;
}

export const generateRandom32Bytes = () => hexlify(randomBytes(32)) as `0x${string}`;

export function encodeBidDetails(args: BidDetailsArgs) {
    const condition = BID_CONDITIONS.find((c) => c.description === args.bidType)!;
    const rNonce = generateRandom32Bytes()

    const parsedAbiParameters = parseAbiParameters('address, uint256, int224, address, bytes32');
    //@ts-ignore
    return encodeAbiParameters(parsedAbiParameters, [
        args.proxyAddress,
        condition.onchainIndex,
        args.conditionValue,
        args.updaterAddress,
        rNonce,
    ]);
}

export function decodeBidDetails(bidDetails: Hex): BidDetailsArgs | null {
    const parsedAbiParameters = parseAbiParameters('address, uint256, int224, address');

    // The user can submit invalid bidDetails that can't decode
    //@ts-ignore
    const decodeRes = decodeAbiParameters(parsedAbiParameters, bidDetails)

    if (decodeRes === null) {
        return null;
    }

    const bidDetailsArgs: BidDetailsArgs = {
        bidType: BID_CONDITIONS.find((c) => c.onchainIndex === decodeRes[1])!.description,
        proxyAddress: decodeRes[0],
        conditionValue: decodeRes[2],
        updaterAddress: decodeRes[3],
    };

    return bidDetailsArgs;
}

export function calculateCollateralAndProtocolFeeAmounts(chainId: string, bidAmount: bigint) {
    return {
        collateralAmount: BigInt(0),
        protocolFeeAmount: BigInt(0),
    };
}

export const dapiProxyAddressExternalLink = (blockExplorer: string | undefined, proxyAddress: `0x${string}`) => {
    if (!blockExplorer) return null;
    return `${blockExplorer}/address/${proxyAddress}`;
}

export const transactionLink = (blockExplorer: string | undefined, tx: `0x${string}` | undefined) => {
    if (!blockExplorer) return null;
    if (!tx) return null;
    return `${blockExplorer}/tx/${tx}`;
}

export function getBidId(address: `0x${string}`, bidTopic: `0x${string}`, bidDetails: string): `0x${string}` {
    return keccak256(
        solidityPacked(
            ['address', 'bytes32', 'bytes32'],
            [address, bidTopic, keccak256(bidDetails)]
        )
    ) as `0x${string}`;
}

export function bidDetailsHash(bidDetails: string): `0x${string}` {
    return keccak256(bidDetails) as `0x${string}`;
}

export function sanitizeAmount(value: string, setAmount: any) {
    if (value === ".") {
        value = "0."
    }
    value = value.replace(/[^0-9.]/g, '')
    value = value.replace(/\.(?=.*\.)/g, '')

    const decimalCount = (value: string) => {
        if (value.indexOf('.') === -1) {
            return 0;
        }
        if (Number.isInteger(value)) {
            return 0;
        } else {
            return value.toString().split('.')[1].length;
        }
    }

    if (decimalCount(value) > 18) {
        value = value.slice(0, value.indexOf('.') + 19);
    }
    if (value === "") {
        setAmount("0")
    }
    setAmount(value)
}

export function truncate(value: string, length: number) {
    if (!value) return "";
    if (value.length <= length) return value;
    return value.substring(0, length) + "..." + value.substring(value.length - length);
}

export function milisecondsToDate(ms: number) {
    return new Date(ms * 1000).toLocaleString();
}

export function hashBidDetails(bidDetails: string) {
    return keccak256(bidDetails) as `0x${string}`;
}

//@ts-ignore
export const deriveBeaconSetId = (dataFeedIds: string[]) => keccak256(encodeAbiParameters(parseAbiParameters('bytes32[]'), [dataFeedIds]));

export function packOevUpdateSignature(airnodeAddress: `0x${string}`, templateId: `0x${string}`, signature: `0x${string}`) {
    const parsedAbiParameters = parseAbiParameters('address, bytes32, bytes');
    //@ts-ignore
    return encodeAbiParameters(parsedAbiParameters, [airnodeAddress, templateId, signature]);
}

export function encodeData(decodedData: BigInt) {
    //@ts-ignore
    return encodeAbiParameters(['int256'], [decodedData]);
}

export async function getBidTokenPrice(dApiName: string): Promise<BigInt> {
    const price = await getSignedData(dApiName);
    const decodedPrice = price.map((p: any) => BigInt(p.encodedValue));
    const median = decodedPrice.sort()[Math.floor(decodedPrice.length / 2)];
    return median;
}

export function getETHPrice() {
    return getBidTokenPrice('ETH/USD');
}

export async function getPrices(dApiName: string): Promise<BidPrices> {
    const bidTokenPrice = await getBidTokenPrice(dApiName);
    const ethPrice = await getETHPrice();

    return {
        colleteralTokenPrice: ethPrice,
        bidTokenPrice: bidTokenPrice,
    }
}