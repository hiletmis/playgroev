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
