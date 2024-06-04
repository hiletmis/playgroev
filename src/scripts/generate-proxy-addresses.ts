import { dapis } from '@api3/dapi-management';
import { deploymentAddresses } from '@api3/contracts';
import { getDapiProxyWithOevAddress } from '../helpers/utils';
import fs from 'fs';

function generateDapiProxyWithOevAddresses(chainId: string) {
    const addresses = dapis.map((dapi) => {
        return {
            dapi: dapi.name,
            address: getDapiProxyWithOevAddress(chainId, dapi.name)
        }
    });
    return addresses;
}

function generateDapiProxyWithOevAddressesForAllChains() {
    console.log("Generating DAPI proxy with OEV addresses for all chains");

    const api3ServerV1Addresses = deploymentAddresses.Api3ServerV1;

    const groupChains: { [address: string]: string[] } = {};
    Object.entries(api3ServerV1Addresses).forEach(([chainId, address]) => {
        if (!groupChains[address]) {
            groupChains[address] = [];
        }
        groupChains[address].push(chainId);
    });

    const allAddresses = Object.values(groupChains).map((chains) => {
        return {
            chains: chains,
            addresses: generateDapiProxyWithOevAddresses(chains[0])
        }
    });

    fs.writeFileSync(`./src/data/dapi-proxy-addresses.json`, JSON.stringify(allAddresses, null, 2));
    console.log("Done!");
}

generateDapiProxyWithOevAddressesForAllChains()