import { useEffect, useState } from 'react';
import { VStack, Flex, Spacer, Text, Image } from '@chakra-ui/react';
import * as Utils from '../helpers/utils';

import { BidInfo, BidStatus, BidStatusEnum, StatusColor } from '../types';
import DApiRow from './DApiRow';
import { ChainLogo } from '@api3/logos';
import CopyInfoRow from './CopyInfoRow';
import ExecuteButton from './ExecuteButton';
import { useReadContract, useAccount } from 'wagmi';
import { OevAuctionHouse__factory, deploymentAddresses } from '@api3/contracts';
import SwitchNetwork from './SwitchNetwork';

const BidView = ({ bids }: any) => {

    const OevAuctionHouseAddres = deploymentAddresses.OevAuctionHouse[4913] as `0x${string}`
    const { chain } = useAccount()

    const [selectedBid, setSelectedBid] = useState({} as BidInfo)
    const [selectedBidStatus, setSelectedBidStatus] = useState({} as BidStatus)
    const [lockState, setLockState] = useState(false)

    const [updateTx, setUpdateTx] = useState("" as `0x${string}`)


    const signUpdateTx = async () => {
        console.log("Update Bid")
        console.log(updateTx)

    }

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
        setUpdateTx("" as `0x${string}`)


    }, [bidInfo, selectedBid])

    useEffect(() => {
        setLockState(chain?.id !== 4913)
    }, [chain])

    const switchActiveBid = (bid: BidInfo) => {
        if (lockState) return
        if (selectedBid.bidId === bid.bidId) {
            setSelectedBid({} as BidInfo)
        } else {
            setSelectedBid(bid)
        }
    }

    const checkCorrectNetwork = (bid: BidInfo) => {
        if (selectedBid.bidId === bid.bidId) {
            return
        }

        if (chain?.id !== 4913) {
            alert("Please switch to OEV Network to check bid status.")
            return
        }
    }

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
                                <DApiRow dApi={bid.dApi} isHeader={!lockState} setDapi={() => checkCorrectNetwork(bid)} onClick={() => { switchActiveBid(bid) }} isOpen={selectedBid.bidId === bid.bidId} bgColor={"white"}></DApiRow>

                            </Flex>
                            {
                                selectedBid.bidId === bid.bidId &&
                                <VStack width={"100%"} p={5} bgColor={StatusColor[selectedBidStatus.status]} spacing={3}>
                                    <CopyInfoRow header={"Collateral Amount"} text={Utils.parseETH(selectedBidStatus.collateralAmount) + " ETH"} copyEnabled={false}></CopyInfoRow>
                                    <CopyInfoRow header={"Protocol Fee Amount"} text={Utils.parseETH(selectedBidStatus.protocolFeeAmount) + " ETH"} copyEnabled={false}></CopyInfoRow>
                                    <CopyInfoRow header={"Status"} text={BidStatusEnum[selectedBidStatus.status]} copyEnabled={false}></CopyInfoRow>
                                    {
                                        selectedBidStatus.status === BidStatusEnum.Awarded ?
                                            bid.chainId.toString() !== chain!.id.toString() ? <SwitchNetwork header={false} destinationChain={bid.chainId} switchMessage={"Switch Network to Update DApi"} /> :
                                                <ExecuteButton text={"Update " + selectedBid.dApi.name} onClick={() => signUpdateTx()}></ExecuteButton>
                                            : null
                                    }
                                    {
                                        selectedBidStatus.status === BidStatusEnum.FulfillmentReported &&
                                        <CopyInfoRow header={"Fulfillment Report"} text={"Fulfillment Report"} copyEnabled={false}></CopyInfoRow>
                                    }
                                    {
                                        selectedBidStatus.status === BidStatusEnum.FulfillmentConfirmed &&
                                        <CopyInfoRow header={"Fulfillment Report"} text={"Fulfillment Report"} copyEnabled={false}></CopyInfoRow>
                                    }
                                    {
                                        selectedBidStatus.status === BidStatusEnum.FulfillmentContradicte &&
                                        <CopyInfoRow header={"Fulfillment Report"} text={"Fulfillment Report"} copyEnabled={false}></CopyInfoRow>

                                    }
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


