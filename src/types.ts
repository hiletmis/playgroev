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

export type EncodeBidDetailsArgs = {
    bidType: string;
    proxyAddress: `0x${string}`;
    conditionValue: bigint;
    updaterAddress: `0x${string}`;
};

export type BidInfo = {
    bidId: `0x${string}`;
    bidTopic: `0x${string}`;
    bidDetails: string;
    bidDetailsHash: `0x${string}`;
    tx: `0x${string}`;
    chainId: number;
    dApi: any;
    ethAmount: bigint;
    explorer: string;
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
    "FulfillmentContradicte",
}

export enum StatusColor {
    "blue.100",
    "yellow.300",
    "green.100",
    "green.200",
    "red.300",
}

export type MulticallDataType = `0x${string}`[];