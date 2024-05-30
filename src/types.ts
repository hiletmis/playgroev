import * as z from "zod";

export const DataFeedSchema = z.object({
    "p1": z.string(),
    "p2": z.string(),
    "chainId": z.string(),
    "proxyAddress": z.string(),
    "beaconId": z.string(),
    "beneficiaryAddress": z.string(),
});
export type DataFeed = z.infer<typeof DataFeedSchema>;

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
