import { useEffect, useState, useContext } from 'react';
import { VStack, Flex, Image } from '@chakra-ui/react';
import * as Utils from '../helpers/utils';

import { BidInfo, BidStatus, BidStatusEnum, StageEnum, StatusColor } from '../types';
import DApiRow from './DApiRow';
import { ChainLogo } from '@api3/logos';
import InfoRow from './InfoRow';
import ExecuteButton from './ExecuteButton';
import { useReadContract, useAccount, useSimulateContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { OevAuctionHouse__factory, deploymentAddresses } from '@api3/contracts';
import SwitchNetwork from './SwitchNetwork';
import { bidTopic } from "../helpers/constants";
import { OevContext } from '../OEVContext';
import * as Description from '../helpers/descriptions';

const BidView = () => {

    const OevAuctionHouseAddres = deploymentAddresses.OevAuctionHouse[4913] as `0x${string}`
    const [api3ServerV1Address, setApi3ServerV1Address] = useState("" as `0x${string}`)

    const [isBusy, setIsBusy] = useState(false)
    const [bidderBalanceBeforeUpdate, setBidderBalanceBeforeUpdate] = useState(BigInt(0))
    const [bidderBalanceAfterUpdate, setBidderBalanceAfterUpdate] = useState(BigInt(0))

    const { chainId, address } = useAccount()
    const { setBid, bid, stage, setStage, setTab } = useContext(OevContext);
    const { writeContract, data: hash, isPending, reset } = useWriteContract()

    const { isFetched: isFetchedReceipt, data: receipt } = useWaitForTransactionReceipt({
        confirmations: 1,
        hash
    });

    const checkBidStatus = (status: BidStatusEnum) => {
        if (!bid) return false
        if (bid.isExpired) return false
        if (bid.status === null) return false
        return bid.status.status === status
    }

    const getBidStatus = () => {
        const dummyStatus = {
            status: 0,
            expirationTimestamp: BigInt(0),
            collateralAmount: BigInt(0),
            protocolFeeAmount: BigInt(0),
            bidId: "0x0" as `0x${string}`
        }

        if (!bid) return dummyStatus
        if (!bid.status) return dummyStatus
        return bid.status
    }

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
        bid.reportTx = hash as `0x${string}`
        if (stage === StageEnum.AwardAndUpdate && bid.reportTx !== "0x0" as `0x${string}`) {
            setStage(StageEnum.Reported)
        }

        setBid(bid)
    }, [hash, bid, setBid, stage, setStage]);

    const reportFulfillment = async () => {
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
            }
        });
    }

    //@ts-ignore
    const { data: bidderBalance } = useReadContract({
        address: OevAuctionHouseAddres,
        abi: OevAuctionHouse__factory.abi,
        chainId: 4913,
        functionName: 'bidderToBalance',
        args: [address as `0x${string}`],
        query: {
            refetchInterval: 10000,
        }
    });


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

    // ReportFullfillment
    //@ts-ignore
    const { data: reportFullfillmentData, error: errorReportFullfillment } = useSimulateContract({
        address: OevAuctionHouseAddres,
        abi: OevAuctionHouse__factory.abi,
        chainId: chainId,
        functionName: 'reportFulfillment',
        args: [bidTopic, bid ? bid.bidDetailsHash : "0x0", bid ? bid.updateTx : "0x0"],
        query: {
            enabled: bid ? api3ServerV1Address !== "" as `0x${string}` && chainId === 4913 && bid.updateTx !== "0x0" as `0x${string}` && checkBidStatus(BidStatusEnum.Awarded) : false
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
        bid.status = bidStatus

        if (bidStatus.status === BidStatusEnum.FulfillmentConfirmed) {
            setStage(StageEnum.Confirm)
        }

        if (bidStatus.status === BidStatusEnum.FulfillmentContradicted) {
            setStage(StageEnum.Contradict)
        }

        setBid(bid)

    }, [bidInfo, bid, stage, setStage, setBid])

    useEffect(() => {
        if (!chainId) return
        if (!deploymentAddresses.Api3ServerV1.hasOwnProperty(chainId)) return

        //@ts-ignore
        const api3ServerV1Address = deploymentAddresses.Api3ServerV1[chainId] as `0x${string}`
        setApi3ServerV1Address(api3ServerV1Address)

    }, [chainId])

    useEffect(() => {
        if (!errorReportFullfillment) return

        console.log(errorReportFullfillment)
    }, [errorReportFullfillment])

    useEffect(() => {
        if (bidderBalance === undefined) return;
        if (stage === StageEnum.Report) {
            setBidderBalanceBeforeUpdate(bidderBalance)
        }

        if (stage === StageEnum.Confirm) {
            setBidderBalanceAfterUpdate(bidderBalance)
        }

        if (stage === StageEnum.Contradict) {
            setBidderBalanceAfterUpdate(bidderBalance)
        }


    }, [bidderBalance, setBidderBalanceAfterUpdate, setBidderBalanceBeforeUpdate, stage]);

    const checkCorrectNetwork = (bid: BidInfo) => {

        if (chainId !== 4913) {
            alert("Please switch to OEV Network to check bid status.")
            return
        }
    }

    const getColor = (bid: BidInfo) => {
        if (bid.isExpired) return "red.300"
        return StatusColor[bid.status ? bid.status.status : 0]
    }

    const getFeeRefund = () => {
        if (!bid) return "Bid not found."
        if (!bid.status) return "Status not found."

        const ifConfirmed = Description.feeDeductionRefundConfirmed(Utils.parseETH(bid.status.protocolFeeAmount))
        const ifContradicted = Description.feeDeductionRefundContradicted(Utils.parseETH(bid.status.protocolFeeAmount))

        if (bid.status.status === BidStatusEnum.FulfillmentConfirmed) return ifConfirmed
        if (bid.status.status === BidStatusEnum.FulfillmentContradicted) return ifContradicted

        return Description.feeDeductionRefundDefault
    }

    const isReported = () => {
        if (!bid) return false
        if (!bid.status) return false
        return bid.reportTx !== "0x0" as `0x${string}`
    }

    return (
        bid === undefined ? null :
            <VStack maxW={"700px"} p={4} shadow="md" borderWidth="px" flex="1" bgColor={Utils.COLORS.main} alignItems={"left"}>
                <Flex p={2} gap={1} alignItems={"center"} boxShadow={"sm"} bgColor={getColor(bid)} width={"100%"}>
                    <Image src={ChainLogo(bid.chainId.toString(), true)} width={"32px"} height={"32px"} />
                    <DApiRow dApi={bid.dapi} isLoading={(isPending || isLoading || isBusy || (isReported() && stage === StageEnum.Report))} setDapi={() => checkCorrectNetwork(bid)} onClick={() => { }} isOpen={true} bgColor={"white"}></DApiRow>
                </Flex>
                {
                    <VStack width={"100%"} spacing={3}>

                        <Flex width={"100%"} gap={3} justifyContent={"space-between"}>
                            <InfoRow header={Description.collateralBalanceBeforeReport} text={Utils.parseETH(bidderBalanceBeforeUpdate) + " ETH"} ></InfoRow>
                            {
                                bidderBalanceAfterUpdate !== BigInt(0) &&
                                <InfoRow header={Description.collateralBalanceAfterReport} text={Utils.parseETH(bidderBalanceAfterUpdate) + " ETH"} ></InfoRow>
                            }
                        </Flex>
                        <InfoRow header={"Fee Deduction"} text={getFeeRefund()} ></InfoRow>
                        <InfoRow header={"Update Transaction"} text={bid.updateTx} link={Utils.transactionLink("https://oev-network.explorer.caldera.dev", bid.updateTx)} copyEnabled={true}></InfoRow>
                        <InfoRow header={"Status"} text={BidStatusEnum[getBidStatus().status]} copyEnabled={false}></InfoRow>
                        {
                            getBidStatus().status === BidStatusEnum.Awarded && !isReported() ?
                                chainId !== 4913 ? <SwitchNetwork header={false} switchMessage={"Switch Network to Report Fullfillment"} /> :
                                    <ExecuteButton text={"Report Fullfillment"} onClick={() => reportFulfillment()}></ExecuteButton>
                                : null
                        }

                    </VStack>
                }
                {
                    stage === StageEnum.Confirm &&
                    <VStack width={"100%"} p={5} bgColor={Utils.COLORS.info} spacing={3}>
                        <ExecuteButton text={"Place a New Bid"} onClick={() => setTab(StageEnum.PlaceBid)}></ExecuteButton>
                    </VStack>
                }

            </VStack>
    );
};

export default BidView;


