import { ChainLogs, BidInfo, BidStatus, BidStatusEnum, DecodedAwardedBidData, UpdateOevProxyDataFeedWithSignedData } from "../types";
import { OevAuctionHouse__factory, Api3ServerV1__factory } from '@api3/contracts';
import { CHAINS } from "@api3/chains";
import { dapis } from '@api3/dapi-management';
import * as Utils from './utils';
import DapiProxyWithOevAddresses from '../data/dapi-proxy-addresses.json';

async function getLatestBlockNumber(rpcUrl: string) {
    const res = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
        }),
    });

    const data = await res.json();

    return data.result;
}

function getBlockExplorer(chainId: number) {
    const chain = CHAINS.find((chain) => chain.id === chainId.toString());
    if (!chain) return "";
    return chain.explorer.browserUrl;
}

function returnDefaultDapi() {
    return dapis.find((d) => d.name === "ETH/USD");
}

function findDapiProxy(chainId: string, address: string) {
    const batch = DapiProxyWithOevAddresses.find((d) => d.chains.includes(chainId));
    if (!batch) return returnDefaultDapi()
    const dapiName = batch.addresses.find((a) => a.address === address);
    if (!dapiName) return returnDefaultDapi()
    const dapi = dapis.find((d) => d.name === dapiName.dapi);
    return dapi
}

function decodePlacedBidLog(logs: ChainLogs) {
    const oevAuctionHouse = OevAuctionHouse__factory.createInterface();

    return logs.result.map((log) => {

        const eventLog = oevAuctionHouse.decodeEventLog("PlacedBid", log.data, log.topics)

        const bidStatus: BidStatus = ({
            status: BidStatusEnum.None,
            expirationTimestamp: parseInt(eventLog.expirationTimestamp.toString()),
            collateralAmount: BigInt(eventLog.collateralAmount),
            protocolFeeAmount: BigInt(eventLog.protocolFeeAmount),
            bidId: eventLog.bidId
        })

        const isExpired = Date.now() > bidStatus.expirationTimestamp * 1000;
        let bidDetails = Utils.decodeBidDetails(eventLog.bidDetails);
        bidDetails!.hash = Utils.bidDetailsHash(eventLog.bidDetails);

        const dapi = findDapiProxy(eventLog.chainId.toString(), bidDetails!.proxyAddress!);

        const decodedEventLog: BidInfo = ({
            bidId: eventLog.bidId,
            bidTopic: eventLog.bidTopic,
            bidDetails: bidDetails!,
            bidDetailsHash: bidDetails?.hash as `0x${string}`,
            tx: log.transactionHash as `0x${string}`,
            updateTx: "0x0",
            reportTx: "0x0",
            awardedBidData: null,
            txBlock: BigInt(log.blockNumber),
            chainId: eventLog.chainId,
            chainSymbol: CHAINS.find((c) => c.id === eventLog.chainId.toString())?.symbol as string,
            dapi: dapi,
            ethAmount: eventLog.bidAmount,
            explorer: getBlockExplorer(eventLog.chainId),
            isExpired: isExpired,
            status: bidStatus
        });
        return decodedEventLog;
    })
}

function decodeAwardedBidLog(logs: ChainLogs) {
    const oevAuctionHouse = OevAuctionHouse__factory.createInterface();

    return logs.result.map((log) => {

        const eventLog = oevAuctionHouse.decodeEventLog("AwardedBid", log.data, log.topics)

        const awardedBidData: DecodedAwardedBidData = ({
            bidder: eventLog.bidder,
            bidTopic: eventLog.bidTopic,
            bidId: eventLog.bidId,
            awardDetails: eventLog.awardDetails,
            bidderBalance: eventLog.bidderBalance
        })

        return awardedBidData;
    })
}


export async function getAwardedBidLogs(auctioneer: string, rpcUrl: string, address: `0x${string}`, txBlock: bigint, bid: BidInfo): Promise<UpdateOevProxyDataFeedWithSignedData | null> {
    const latestBlock = await getLatestBlockNumber(rpcUrl);
    const fromBlock = `0x${txBlock.toString(16)}`

    const topics = [
        "0xd6a2a9b03edbda2093822585a736f8b6377d318f22f5fdf2d1aa6961af709159",
        address.replace("0x", "0x000000000000000000000000"),
        "0x76302d70726f642d61756374696f6e6565720000000000000000000000000000"
    ]

    const data = await fetchLog(auctioneer, rpcUrl, fromBlock, latestBlock, topics);
    const decoded = decodeAwardedBidLog(data as ChainLogs);

    const filter = decoded.filter((d) => d.bidId === bid.bidId);
    if (filter.length === 0) return null;

    const api3ServerV1Interface = Api3ServerV1__factory.createInterface();
    const eventLog = api3ServerV1Interface.decodeFunctionData("updateOevProxyDataFeedWithSignedData", filter[0].awardDetails);

    const updateData: UpdateOevProxyDataFeedWithSignedData = [
        eventLog[0],
        eventLog[1],
        eventLog[2],
        eventLog[3],
        eventLog[4],
        eventLog[5].map((a: string) => `${a}`)
    ]

    return updateData
}


export async function getAuctioneerLogs(auctioneer: string, rpcUrl: string, address: `0x${string}`) {
    const latestBlock = await getLatestBlockNumber(rpcUrl);
    const fromBlock = "0x0"
    const topics = [
        "0x37d580e87cc06489401e512a96663a7330c5096febe57bd356f5f2a327994c10",
        address.replace("0x", "0x000000000000000000000000"),
        "0x76302d70726f642d61756374696f6e6565720000000000000000000000000000"
    ]

    const data = await fetchLog(auctioneer, rpcUrl, fromBlock, latestBlock, topics);
    const decoded = decodePlacedBidLog(data as ChainLogs);
    const last = decoded[decoded.length - 1];
    return last as BidInfo;
}

async function fetchLog(auctioneer: string, rpcUrl: string, fromBlock: string, latestBlock: string, topics: string[]) {
    const res = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getLogs',
            params: [{
                address: auctioneer,
                fromBlock: fromBlock,
                toBlock: latestBlock,
                topics: topics
            }],
            id: 1,
        }),
    });

    return await res.json();
}