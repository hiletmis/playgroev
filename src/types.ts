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
    tx: `0x${string}`;
    chainId: bigint;
    dApi: any;
    ethAmount: bigint;
    explorer: string;
};

export type BidStatus = {
    status: number;
    expirationTimestamp: number;
    collateralAmount: bigint;
    protocolFeeAmount: bigint;
    bidId: `0x${string}`;
};

export enum BidStatusEnum {
    None,
    Placed,
    Awarded,
    FulfillmentReported,
    FulfillmentConfirmed,
    FulfillmentContradicted
}