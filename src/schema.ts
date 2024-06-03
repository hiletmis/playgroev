import { z } from "zod";
import {
    addressSchema,
    keccak256HashSchema,
} from '@api3/commons'
import type { Hex } from 'viem';

export const hexSchema = z.string().transform((val) => val as Hex);

export const signedApiSchema = z.strictObject({
    name: z.string(),
    url: z.string().url(),
    authToken: z.string().nullable(),
});

// =======================================================
// Signed API
// =======================================================
// https://github.com/api3dao/signed-api/blob/ec260f5d2531e0f98c9164d213e65246bf8acbd6/packages/api/src/schema.ts#L42
export const signedDataSchema = z.strictObject({
    airnode: addressSchema,
    templateId: keccak256HashSchema,
    timestamp: z.string(),
    encodedValue: keccak256HashSchema,
    signature: hexSchema,
});

export const signedApiResponseSchema = z.object({
    count: z.number().positive(),
    data: z.record(keccak256HashSchema /* Beacon ID */, signedDataSchema),
});
