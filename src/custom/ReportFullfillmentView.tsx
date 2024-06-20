import { useEffect, useState, useContext } from 'react';
import { VStack, Flex, Image } from '@chakra-ui/react';
import * as Utils from '../helpers/utils';

import { BidInfo, BidStatus, BidStatusEnum, StageEnum, StatusColor, UpdateOevProxyDataFeedWithSignedData } from '../types';
import DApiRow from './DApiRow';
import { ChainLogo } from '@api3/logos';
import CopyInfoRow from './CopyInfoRow';
import ExecuteButton from './ExecuteButton';
import { useReadContract, useAccount, useSimulateContract, useWriteContract, useWaitForTransactionReceipt, useBlockNumber } from 'wagmi';
import { OevAuctionHouse__factory, Api3ServerV1__factory, deploymentAddresses } from '@api3/contracts';
import SwitchNetwork from './SwitchNetwork';
import { bidTopic } from "../helpers/constants";
import { getAwardedBidLogs } from '../helpers/get-logs';
import { ContractFunctionExecutionError } from "viem";
import { OevContext } from '../OEVContext';

const BidView = () => {

    const OevAuctionHouseAddres = deploymentAddresses.OevAuctionHouse[4913] as `0x${string}`
    const [api3ServerV1Address, setApi3ServerV1Address] = useState("" as `0x${string}`)

    const { chainId, address } = useAccount()
    const { setBid, bid, stage, setStage } = useContext(OevContext);

    const [updateDApiData, setUpdateDApiData] = useState(null as UpdateOevProxyDataFeedWithSignedData | null);

    const [selectedBidStatus, setSelectedBidStatus] = useState({} as BidStatus)
    const [lockState, setLockState] = useState(false)
    const [isBusy, setIsBusy] = useState(false)

    const [page, setPage] = useState(1)
    const { writeContract, data: hash, isPending, reset } = useWriteContract()

    const { isFetched: isFetchedReceipt, data: receipt } = useWaitForTransactionReceipt({
        confirmations: 1,
        hash
    });

    const blockNumber = useBlockNumber({
        query: {
            enabled: selectedBidStatus.status === BidStatusEnum.Awarded && chainId === 4913,
        }
    })

    useEffect(() => {
        if (isFetchedReceipt === undefined) return;
        if (hash === undefined) return;
        if (receipt === undefined) return;
        if (bid === undefined) return;

        bid.txBlock = receipt.blockNumber
        setBid(bid)

    }, [isFetchedReceipt, receipt, hash, bid, setBid]);

    useEffect(() => {
        if (hash === undefined) return;
        if (bid === undefined) return;
        bid.updateTx = hash as `0x${string}`

        if (stage === StageEnum.AwardAndUpdate && bid.updateTx !== "0x0" as `0x${string}`) {
            setStage(StageEnum.Report)
        }

        setBid(bid)
    }, [hash, bid, setBid, stage, setStage]);

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
        args: [bid ? bid.bidId as `0x${string}` : "0x0" as `0x${string}`],
        query: {
            refetchInterval: 5000,
            enabled: bid ? bid.bidId !== "" as `0x${string}` : false
        }
    });

    // UpdateDApi
    //@ts-ignore
    const { data: updateDApiCallData, error: errorUpdate } = useSimulateContract({
        address: api3ServerV1Address,
        abi: Api3ServerV1__factory.abi,
        chainId: chainId,
        functionName: 'updateOevProxyDataFeedWithSignedData',
        args: updateDApiData ? updateDApiData : ["0x0", "0x0", "0x0", BigInt(0), "0x0", ["0x0"]],
        value: bid ? bid.ethAmount : BigInt(0),
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
        args: [bidTopic, bid ? bid.bidDetailsHash : "0x0", bid ? bid.updateTx : "0x0"],
        query: {
            enabled: bid ? api3ServerV1Address !== "" as `0x${string}` && chainId === 4913 && bid.updateTx !== "0x0" as `0x${string}` && selectedBidStatus.status === BidStatusEnum.Awarded : false
        }
    })

    useEffect(() => {
        if (!bidInfo) return
        if (!bid) return

        const bidStatus = {
            status: bidInfo[0],
            expirationTimestamp: bidInfo[1],
            collateralAmount: bidInfo[2],
            protocolFeeAmount: (bidInfo[3]),
            bidId: bid.bidId
        } as BidStatus
        setSelectedBidStatus(bidStatus)

    }, [bidInfo, bid, stage, setStage])

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

        if (errorUpdate instanceof ContractFunctionExecutionError) {
            const cause = errorUpdate.cause
                .walk()
                .message.split(":")[2]
                .split("\n")[0]
                .trim();
            console.log(cause)
        }

        console.log(errorReportFullfillment)
    }, [errorUpdate, errorReportFullfillment])

    useEffect(() => {
        if (!blockNumber) return
        if (!bid) return
        if (!selectedBidStatus) return
        if (!chainId) return
        if (!address) return

        if (selectedBidStatus.status === BidStatusEnum.Awarded && chainId === 4913 && bid.awardedBidData === null) {
            getAwardedBidLogs(OevAuctionHouseAddres, "https://oev-network.calderachain.xyz/http", address, BigInt(bid.txBlock), bid).then((data) => {
                if (!data) return
                setUpdateDApiData(data)
                bid.awardedBidData = data
                setBid(bid)
            })
        }
    }, [OevAuctionHouseAddres, address, bid, blockNumber, chainId, selectedBidStatus, setBid])

    useEffect(() => {
        if (page < 1) {
            setPage(1)
        }
    }, [page])

    const switchActiveBid = (bid: BidInfo) => {
        if (lockState) return
        setUpdateDApiData(bid.awardedBidData)
        setBid(bid)
    }

    const checkCorrectNetwork = (bid: BidInfo) => {

        if (chainId !== 4913) {
            alert("Please switch to OEV Network to check bid status.")
            return
        }
    }

    const getColor = (bid: BidInfo) => {
        if (bid.isExpired) return "red.300"
        return StatusColor[selectedBidStatus.status]
    }

    return (
        bid === undefined ? null :
            <VStack width={"100%"} p={1} bgColor={getColor(bid)} spacing={1}>
                <Flex gap={1} alignItems={"center"} width={"100%"}>
                    <Image src={ChainLogo(bid.chainId.toString(), true)} width={"32px"} height={"32px"} />
                    <DApiRow dApi={bid.dapi} isLoading={(isPending || isLoading || isBusy)} setDapi={() => checkCorrectNetwork(bid)} onClick={() => { switchActiveBid(bid) }} isOpen={true} bgColor={"white"}></DApiRow>
                </Flex>
                {
                    <VStack width={"100%"} p={5} bgColor={getColor(bid)} spacing={3}>
                        <CopyInfoRow header={"Collateral Amount"} text={Utils.parseETH(selectedBidStatus.collateralAmount) + " ETH"} copyEnabled={false}></CopyInfoRow>
                        <CopyInfoRow header={"Protocol Fee Amount"} text={Utils.parseETH(selectedBidStatus.protocolFeeAmount) + " ETH"} copyEnabled={false}></CopyInfoRow>
                        <CopyInfoRow header={"Status"} text={BidStatusEnum[selectedBidStatus.status]} copyEnabled={false}></CopyInfoRow>
                        {
                            selectedBidStatus.status === BidStatusEnum.Awarded && bid.updateTx !== "0x0" as `0x${string}` ?
                                chainId !== 4913 ? <SwitchNetwork header={false} switchMessage={"Switch Network to Report Fullfillment"} /> :
                                    <ExecuteButton text={"Report Fullfillment"} onClick={() => reportFulfillment()}></ExecuteButton>
                                : null
                        }
                    </VStack>
                }

            </VStack>
    );
};

export default BidView;


