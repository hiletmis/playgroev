import { z } from "zod";
import { signedApiSchema, signedDataSchema, signedApiResponseSchema } from "./schema";

// Signed API
export type SignedApi = z.infer<typeof signedApiSchema>;
export type SignedData = z.infer<typeof signedDataSchema>;
export type SignedApiResponse = z.infer<typeof signedApiResponseSchema>;


export type BidCondition = {
    readonly onchainIndex: bigint;
    readonly description: BidConditionDescription;
};

// Auction-creator/Auction-cop state
export type BidConditionDescription = 'GTE' | 'LTE';

export type BidDetailsArgs = {
    bidType: string;
    proxyAddress: `0x${string}`;
    conditionValue: bigint;
    updaterAddress: `0x${string}`;
    hash?: `0x${string}`;
    bytes?: `0x${string}`;
};

export type BidInfo = {
    bidId: `0x${string}`;
    bidTopic: `0x${string}`;
    bidDetails: BidDetailsArgs;
    bidDetailsHash: `0x${string}`;
    tx: `0x${string}`;
    updateTx: `0x${string}`;
    reportTx: `0x${string}`;
    txBlock: bigint;
    awardedBidData: UpdateOevProxyDataFeedWithSignedData | null;
    chainId: number;
    chainSymbol: string;
    dapi: any;
    ethAmount: bigint;
    explorer: string;
    isExpired: boolean;
    status: BidStatus | null;
};

export type BidStatus = {
    status: BidStatusEnum;
    expirationTimestamp: number;
    collateralAmount: bigint;
    protocolFeeAmount: bigint;
    bidId: `0x${string}`;
};

export enum BidStatusEnum {
    "None",
    "Placed",
    "Awarded",
    "FulfillmentReported",
    "FulfillmentConfirmed",
    "FulfillmentContradicted",
}

export enum StageEnum {
    "SignIn" = -1,
    "Bridge" = 0,
    "Deposit" = 1,
    "PlaceBid" = 2,
    "AwardAndUpdate" = 3,
    "Report" = 4,
    "Reported" = 5,
    "Confirm" = 6, // Confirm the report
    "Contradict" = 7 // Contradict the report
}

export enum StatusColor {
    "blue.100",
    "yellow.300",
    "green.100",
    "green.200",
    "green.300",
    "red.300",
}

export const AddressSchema = z.enum([
    "0x34f13a5c0ad750d212267bcbc230c87aefd35cc5",
]);
export type Address = z.infer<typeof AddressSchema>;


export const LogIndexSchema = z.enum([
    "0x0",
]);
export type LogIndex = z.infer<typeof LogIndexSchema>;


export const TransactionIndexSchema = z.enum([
    "0x1",
]);
export type TransactionIndex = z.infer<typeof TransactionIndexSchema>;

export const ResultSchema = z.object({
    "address": AddressSchema,
    "topics": z.array(z.string()),
    "data": z.string(),
    "blockNumber": z.string(),
    "transactionHash": z.string(),
    "transactionIndex": TransactionIndexSchema,
    "blockHash": z.string(),
    "logIndex": LogIndexSchema,
    "removed": z.boolean(),
});
export type Result = z.infer<typeof ResultSchema>;

export const ChainLogsSchema = z.object({
    "result": z.array(ResultSchema),
});
export type ChainLogs = z.infer<typeof ChainLogsSchema>;

export interface DecodedPlaceBidData {
    bidder: `0x${string}`;
    bidTopic: `0x${string}`;
    bidId: `0x${string}`;
    chainId: number;
    bidAmount: `0x${string}`;
    bidDetails: `0x${string}`;
    expirationTimestamp: string;
    collateralAmount: string;
    protocolFeeAmount: string;
}

export interface DecodedAwardedBidData {
    bidder: `0x${string}`;
    bidTopic: `0x${string}`;
    bidId: `0x${string}`;
    awardDetails: `0x${string}`;
    bidderBalance: bigint
}

export type UpdateOevProxyDataFeedWithSignedData = readonly [`0x${string}`, `0x${string}`, `0x${string}`, bigint, `0x${string}`, readonly `0x${string}`[]]

export type BidPrices = {
    colleteralTokenPrice: BigInt;
    bidTokenPrice: BigInt;
};

export type DApiValue = {
    timestamp: string;
    value: BigInt;
};