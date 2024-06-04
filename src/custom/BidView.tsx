import { useEffect, useState } from 'react';
import { VStack, Flex, Spacer, Text, Image } from '@chakra-ui/react';
import * as Utils from '../helpers/utils';

import { BidInfo, BidStatus, BidStatusEnum, StatusColor, MulticallDataType } from '../types';
import DApiRow from './DApiRow';
import { ChainLogo } from '@api3/logos';
import CopyInfoRow from './CopyInfoRow';
import ExecuteButton from './ExecuteButton';
import { useReadContract, useAccount, useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { OevAuctionHouse__factory, Api3ServerV1__factory, deploymentAddresses } from '@api3/contracts';
import SwitchNetwork from './SwitchNetwork';
import { getCallData } from '../helpers/signed-api';
import { bidTopic } from "../helpers/constants";

const BidView = ({ bids }: any) => {

    const OevAuctionHouseAddres = deploymentAddresses.OevAuctionHouse[4913] as `0x${string}`
    const [api3ServerV1Address, setApi3ServerV1Address] = useState("" as `0x${string}`)

    const { chain, chainId } = useAccount()

    const [updateDApiData, setUpdateDApiData] = useState(['0x00'] as MulticallDataType);

    const [selectedBid, setSelectedBid] = useState({} as BidInfo)
    const [selectedBidStatus, setSelectedBidStatus] = useState({} as BidStatus)
    const [lockState, setLockState] = useState(false)
    const [isBusy, setIsBusy] = useState(false)

    const { writeContract, data: hash, isPending, reset } = useWriteContract()

    const signUpdateTx = async () => {
        console.log("Update Bid")
        if (updateDApiCallData == null) return;
        setIsBusy(true)

        //@ts-ignore
        writeContract(updateDApiCallData?.request, {
            onError: (error: any) => {
                console.log(error)
                setIsBusy(false)
                reset();
            },
            onSuccess: () => {
                console.log("Success")
                setIsBusy(false)
            }
        });
    }

    const { isFetched: isFetchedReceipt, data: receipt } = useWaitForTransactionReceipt({
        confirmations: 1,
        hash
    });

    useEffect(() => {
        if (isFetchedReceipt === undefined) return;
        if (hash === undefined) return;

        if (receipt === undefined) return;

        console.log(isFetchedReceipt, receipt, hash)

    }, [isFetchedReceipt, receipt, hash, reset]);

    useEffect(() => {
        if (hash === undefined) return;
        selectedBid.updateTx = hash as `0x${string}`
        setSelectedBid(selectedBid)
    }, [hash, selectedBid]);

    const reportFulfillment = async () => {
        console.log("Report Fullfillment")
        setIsBusy(true)

        if (reportFullfillmentData == null) return;

        //@ts-ignore
        writeContract(reportFullfillmentData?.request, {
            onError: (error: any) => {
                console.log(error)
                setIsBusy(false)
                reset();
            },
            onSuccess: () => {
                setIsBusy(false)
                console.log("Success")
            }
        });
    }

    //@ts-ignore
    const { data: bidInfo, isLoading } = useReadContract({
        address: OevAuctionHouseAddres,
        abi: OevAuctionHouse__factory.abi,
        chainId: chainId,
        functionName: 'bids',
        args: [selectedBid.bidId as `0x${string}`],
        query: {
            refetchInterval: 5000,
            enabled: selectedBid.bidId !== "" as `0x${string}`
        }
    });

    // UpdateDApi
    //@ts-ignore
    const { data: updateDApiCallData, error: errorUpdate } = useSimulateContract({
        address: api3ServerV1Address,
        abi: Api3ServerV1__factory.abi,
        chainId: chainId,
        functionName: 'multicall',
        args: [updateDApiData],
        query: {
            enabled: api3ServerV1Address !== "" as `0x${string}` && chainId !== 4913 && selectedBidStatus.status === BidStatusEnum.Awarded
        }
    })

    // ReportFullfillment
    //@ts-ignore
    const { data: reportFullfillmentData, error: errorReportFullfillment } = useSimulateContract({
        address: OevAuctionHouseAddres,
        abi: OevAuctionHouse__factory.abi,
        chainId: chainId,
        functionName: 'reportFulfillment',
        args: [bidTopic, selectedBid.bidDetailsHash, selectedBid.updateTx],
        query: {
            enabled: api3ServerV1Address !== "" as `0x${string}` && chainId === 4913 && selectedBid.updateTx !== "0x0" as `0x${string}` && selectedBidStatus.status === BidStatusEnum.Awarded
        }
    })

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
        getCallData(selectedBid.dapi.name).then((data) => {
            setUpdateDApiData(data as MulticallDataType);
        });

    }, [bidInfo, selectedBid])

    useEffect(() => {
        if (!chainId) return
        setLockState(chainId !== 4913)
        if (!deploymentAddresses.Api3ServerV1.hasOwnProperty(chainId)) return

        //@ts-ignore
        const api3ServerV1Address = deploymentAddresses.Api3ServerV1[chainId] as `0x${string}`
        setApi3ServerV1Address(api3ServerV1Address)

    }, [chainId])

    useEffect(() => {
        if (!updateDApiCallData) return
        console.log(updateDApiCallData)
    }, [updateDApiCallData])

    useEffect(() => {
        if (!reportFullfillmentData) return
        console.log(reportFullfillmentData)
    }, [reportFullfillmentData])

    useEffect(() => {
        if (!errorUpdate && !errorReportFullfillment) return
        console.log(errorUpdate)
        console.log(errorReportFullfillment)
    }, [errorUpdate, errorReportFullfillment])

    const switchActiveBid = (bid: BidInfo) => {
        if (lockState) return
        if (selectedBid.bidId === bid.bidId) {
            reset()
            setSelectedBid({} as BidInfo)
            setSelectedBidStatus({} as BidStatus)
        } else {
            setSelectedBid(bid)
        }
    }

    const checkCorrectNetwork = (bid: BidInfo) => {
        if (selectedBid.bidId === bid.bidId) {
            return
        }

        if (chainId !== 4913) {
            alert("Please switch to OEV Network to check bid status.")
            return
        }
    }

    const getColor = (bid: BidInfo) => {
        if (bid.isExpired) return "red.300"
        return selectedBid.bidId === bid.bidId ? StatusColor[selectedBidStatus.status] : "blue.100"
    }

    return (
        <VStack width={"100%"} alignItems={"left"} >
            <Flex>
                <Text fontWeight={"bold"} fontSize={"md"}>Bids</Text>
                <Spacer />
            </Flex>
            {
                bids.toReversed().map((bid: BidInfo, index: number) => {
                    return (
                        <VStack key={index} width={"100%"} p={1} bgColor={getColor(bid)} spacing={1}>
                            <Flex gap={1} alignItems={"center"} width={"100%"}>
                                <Image src={ChainLogo(bid.chainId.toString(), true)} width={"32px"} height={"32px"} />
                                <DApiRow dApi={bid.dapi} isLoading={selectedBid.bidId === bid.bidId ? (isPending || isLoading || isBusy) : false} isHeader={!lockState} setDapi={() => checkCorrectNetwork(bid)} onClick={() => { switchActiveBid(bid) }} isOpen={selectedBid.bidId === bid.bidId} bgColor={"white"}></DApiRow>

                            </Flex>
                            {
                                selectedBid.bidId === bid.bidId &&
                                <VStack width={"100%"} p={5} bgColor={getColor(bid)} spacing={3}>
                                    <CopyInfoRow header={"Collateral Amount"} text={Utils.parseETH(selectedBidStatus.collateralAmount) + " ETH"} copyEnabled={false}></CopyInfoRow>
                                    <CopyInfoRow header={"Protocol Fee Amount"} text={Utils.parseETH(selectedBidStatus.protocolFeeAmount) + " ETH"} copyEnabled={false}></CopyInfoRow>
                                    <CopyInfoRow header={"Status"} text={BidStatusEnum[selectedBidStatus.status]} copyEnabled={false}></CopyInfoRow>
                                    {
                                        selectedBidStatus.status === BidStatusEnum.Awarded && selectedBid.updateTx === "0x0" as `0x${string}` && !selectedBid.isExpired ?
                                            bid.chainId.toString() !== chain!.id.toString() ? <SwitchNetwork header={false} destinationChain={bid.chainId} switchMessage={"Switch Network to Update DApi"} /> :
                                                <ExecuteButton text={"Update " + selectedBid.dapi.name} onClick={() => signUpdateTx()}></ExecuteButton>
                                            : null
                                    }
                                    {
                                        selectedBidStatus.status === BidStatusEnum.Awarded && selectedBid.updateTx !== "0x0" as `0x${string}` ?
                                            chainId !== 4913 ? <SwitchNetwork header={false} switchMessage={"Switch Network to Report Fullfillment"} /> :
                                                <ExecuteButton text={"Report Fullfillment"} onClick={() => reportFulfillment()}></ExecuteButton>
                                            : null
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


