import { executeRequest } from '@api3/commons';
import type { Address } from 'viem';
import { dapis, api3ApiIntegrations } from '@api3/dapi-management'
import { FETCH_SIGNED_DATA_TIMEOUT } from '../helpers/constants';
import { signedApiResponseSchema } from '../schema';
import type { SignedApi } from '../types';
import { Api3ServerV1__factory } from '@api3/contracts';

export function getSignedApiUrl(url: string, airnode: Address) {
    return url.endsWith('/') ? `${url}${airnode}` : `${url}/${airnode}`;
}

export async function callSignedApi(signedApi: SignedApi, airnode: Address) {
    const { authToken, url } = signedApi;

    const executionResult = await executeRequest({
        method: 'GET',
        url: getSignedApiUrl(url, airnode),
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        timeout: FETCH_SIGNED_DATA_TIMEOUT,
    });
    if (!executionResult.success) {
        const ctx = { ...executionResult.errorData, statusCode: executionResult.statusCode };
        // Airnodes and signed APIs are not explicitly linked in the config. There may
        // be cases where signed APIs are unique per Airnode and we are unable to find
        // them by querying the signed API.
        if (ctx.statusCode === 404) {
            return null;
        }

        if (ctx.statusCode === 403) {
            return null;
        }

        return null;
    }

    const parsingResult = signedApiResponseSchema.safeParse(executionResult.data);
    if (!parsingResult.success) {
        return null;
    }
    return parsingResult.data.data;
}

export async function getSignedData(feed: string) {
    const url = 'https://signed-api.nodary.io/public/'

    const providers = dapis.find((d) => d.name === feed)?.providers || [];
    const airnodes = providers.map((provider) => api3ApiIntegrations.getAirnodeAddressByAlias(provider));

    const signedData = await Promise.all(airnodes.map(async (airnode) => {
        const res = await fetch(`${url}${airnode}/`);
        const data = await res.json();

        return data.data[api3ApiIntegrations.deriveDataFeedId(feed, airnode)]
    }));

    return signedData.filter((data) => data !== undefined);
}


export const getDataFeedDetails = (feed: string) => {

    const providers = dapis.find((d) => d.name === feed)?.providers || [];
    const airnodes = providers.map((provider) => api3ApiIntegrations.getAirnodeAddressByAlias(provider));
    const dataFeedIds = airnodes.map((airnode) => { return api3ApiIntegrations.deriveDataFeedId(feed, airnode); });

    return dataFeedIds
};

export async function getCallData(feed: string) {
    try {
        const dataFeedIds = getDataFeedDetails(feed);

        const signedData = await getSignedData(feed);
        const api3ServerV1Interface = Api3ServerV1__factory.createInterface();

        const updateBeaconWithSignedDataCallData = signedData.map((data) => {
            return api3ServerV1Interface.encodeFunctionData('updateBeaconWithSignedData', [
                data.airnode,
                data.templateId,
                data.timestamp,
                data.encodedValue,
                data.signature,
            ]);
        });
        const updateBeaconSetCallData = api3ServerV1Interface.encodeFunctionData('updateBeaconSetWithBeacons', [dataFeedIds]);

        const callData = [
            ...updateBeaconWithSignedDataCallData,
            updateBeaconSetCallData,
        ];

        return callData.flat();
    } catch (error) {
        console.error(error);
        return ['0x00'];
    }
}
