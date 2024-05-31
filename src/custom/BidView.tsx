import { useEffect, useState } from 'react';
import { VStack, Flex, Spacer, Text, Image } from '@chakra-ui/react';
import * as Utils from '../helpers/utils';

import { BidInfo, BidStatus, BidStatusEnum, StatusColor } from '../types';
import DApiRow from './DApiRow';
import { ChainLogo } from '@api3/logos';
import CopyInfoRow from './CopyInfoRow';
import { useReadContract, useAccount } from 'wagmi';
import { OevAuctionHouse__factory, deploymentAddresses } from '@api3/contracts';

const BidView = ({ bids }: any) => {

    const OevAuctionHouseAddres = deploymentAddresses.OevAuctionHouse[4913] as `0x${string}`
    const { chain } = useAccount()

    const [selectedBid, setSelectedBid] = useState({} as BidInfo)
    const [selectedBidStatus, setSelectedBidStatus] = useState({} as BidStatus)


    //@ts-ignore
    const { data: bidInfo } = useReadContract({
        address: OevAuctionHouseAddres,
        abi: OevAuctionHouse__factory.abi,
        chainId: chain ? chain.id : 4913,
        functionName: 'bids',
        args: [selectedBid.bidId as `0x${string}`],
        query: {
            refetchInterval: 10000,
            enabled: selectedBid.bidId !== "" as `0x${string}`
        }
    });

    useEffect(() => {
        if (!bidInfo) return
        if (!selectedBid) return

        const bidStatus = {
            status: bidInfo[0],
            expirationTimestamp: bidInfo[1],
            collateralAmount: bidInfo[2],
            protocolFeeAmount: (bidInfo[3]),
            bidId: selectedBid.bidId
        } as BidStatus

        setSelectedBidStatus(bidStatus)


    }, [bidInfo, selectedBid])

    return (
        <VStack width={"100%"} alignItems={"left"} >
            <Flex>
                <Text fontWeight={"bold"} fontSize={"md"}>Bids</Text>
                <Spacer />
            </Flex>
            {
                bids.map((bid: BidInfo, index: number) => {
                    return (
                        <VStack key={index} width={"100%"} p={1} bgColor={selectedBid.bidId === bid.bidId ? StatusColor[selectedBidStatus.status] : "blue.100"} spacing={1}>
                            <Flex gap={1} alignItems={"center"} width={"100%"}>
                                <Image src={ChainLogo(bid.chainId.toString(), true)} width={"32px"} height={"32px"} />
                                <DApiRow dApi={bid.dApi} isHeader={true} onClick={() => { selectedBid.bidId === bid.bidId ? setSelectedBid({} as BidInfo) : setSelectedBid(bid) }} isOpen={selectedBid.bidId === bid.bidId} bgColor={"white"}></DApiRow>

                            </Flex>
                            {
                                selectedBid.bidId === bid.bidId &&
                                <VStack width={"100%"} p={5} bgColor={StatusColor[selectedBidStatus.status]} spacing={3}>
                                    <CopyInfoRow header={"Bid ID"} text={bid.bidId}></CopyInfoRow>
                                    <CopyInfoRow header={"Expiration Timestamp"} text={Utils.milisecondsToDate(selectedBidStatus.expirationTimestamp)} copyEnabled={false}></CopyInfoRow>
                                    <CopyInfoRow header={"Collateral Amount"} text={Utils.parseETH(selectedBidStatus.collateralAmount) + " ETH"} copyEnabled={false}></CopyInfoRow>
                                    <CopyInfoRow header={"Protocol Fee Amount"} text={Utils.parseETH(selectedBidStatus.protocolFeeAmount) + " ETH"} copyEnabled={false}></CopyInfoRow>
                                    <CopyInfoRow header={"Status"} text={BidStatusEnum[selectedBidStatus.status]} copyEnabled={false}></CopyInfoRow>
                                </VStack>
                            }

                        </VStack>
                    )
                })
            }
        </VStack>
    );
};

export default BidView;


