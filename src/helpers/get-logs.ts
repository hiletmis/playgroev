import { ChainLogs, BidInfo } from "../types";
import { OevAuctionHouse__factory } from '@api3/contracts';
import { CHAINS } from "@api3/chains";
import { dapis } from '@api3/dapi-management';
import * as Utils from './utils';


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

function decodeLogs(logs: ChainLogs) {
    const oevAuctionHouse = OevAuctionHouse__factory.createInterface();

    return logs.result.map((log) => {

        const eventLog = oevAuctionHouse.decodeEventLog("PlacedBid", log.data, log.topics)

        const decodedEventLog: BidInfo = ({
            bidId: eventLog.bidId,
            bidTopic: eventLog.bidTopic,
            bidDetails: eventLog.bidDetails,
            bidDetailsHash: Utils.bidDetailsHash(eventLog.bidDetails),
            tx: log.transactionHash as `0x${string}`,
            updateTx: "0x0",
            chainId: eventLog.chainId,
            dApi: dapis.find((d) => d.name === "ETH/USD"),
            ethAmount: eventLog.bidAmount,
            explorer: getBlockExplorer(eventLog.chainId)
        });

        return decodedEventLog;
    })
}


export async function getAuctioneerLogs(auctioneer: string, rpcUrl: string, address: `0x${string}`) {
    const latestBlock = await getLatestBlockNumber(rpcUrl);
    const fromBlock = "0x0"
    const topics = [
        "0x37d580e87cc06489401e512a96663a7330c5096febe57bd356f5f2a327994c10",
        address.replace("0x", "0x000000000000000000000000"),
        "0x0000000000000000000000000000000000000000000000000000000000000001"
    ]

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


    const data = await res.json();
    const decoded = decodeLogs(data as ChainLogs);
    return decoded as BidInfo[];
}