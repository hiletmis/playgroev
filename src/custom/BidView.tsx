import { useEffect, useState, useContext } from 'react';
import { VStack, Flex, Image } from '@chakra-ui/react';
import * as Utils from '../helpers/utils';

import { BidInfo, BidStatus, BidStatusEnum, StageEnum, StatusColor, UpdateOevProxyDataFeedWithSignedData, DApiValue } from '../types';
import DApiRow from './DApiRow';
import { ChainLogo } from '@api3/logos';
import InfoRow from './InfoRow';
import ExecuteButton from './ExecuteButton';
import { useReadContract, useAccount, useSimulateContract, useWriteContract, useWaitForTransactionReceipt, useBlockNumber } from 'wagmi';
import { OevAuctionHouse__factory, Api3ServerV1__factory, deploymentAddresses } from '@api3/contracts';
import SwitchNetwork from './SwitchNetwork';
import ErrorRow from './ErrorRow';
import { getAwardedBidLogs } from '../helpers/get-logs';
import { ContractFunctionExecutionError } from "viem";
import { OevContext } from '../OEVContext';
import * as Description from '../helpers/descriptions';

const BidView = () => {

    const OevAuctionHouseAddres = deploymentAddresses.OevAuctionHouse[4913] as `0x${string}`
    const [api3ServerV1Address, setApi3ServerV1Address] = useState("" as `0x${string}`)
    const [updateDApiData, setUpdateDApiData] = useState(null as UpdateOevProxyDataFeedWithSignedData | null);
    const [isBusy, setIsBusy] = useState(false)
    const [dapiValueAfterUpdate, setDapiValueAfterUpdate] = useState(null as DApiValue | null)
    const [status, setStatus] = useState(null as BidStatus | null)

    const { chain, chainId, address } = useAccount()
    const { setBid, bid, stage, setStage } = useContext(OevContext);
    const { writeContract, data: hash, isPending, reset } = useWriteContract()

    const signUpdateTx = async () => {
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
                setIsBusy(false)
            }
        });
    }

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

    const blockNumber = useBlockNumber({
        query: {
            enabled: checkBidStatus(BidStatusEnum.Awarded) && chainId === 4913,
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


    }, [hash, bid, setBid, stage, setStage]);

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
            enabled: api3ServerV1Address !== "" as `0x${string}` && chainId !== 4913 && checkBidStatus(BidStatusEnum.Awarded) && stage === StageEnum.AwardAndUpdate,
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
        setStatus(bidStatus)
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
        if (!errorUpdate) return
        console.log(errorUpdate)

        if (errorUpdate instanceof ContractFunctionExecutionError) {
            const cause = errorUpdate.cause
                .walk()
                .message.split(":")[2]
                .split("\n")[0]
                .trim();
            console.log(cause)
        }

    }, [errorUpdate])

    useEffect(() => {
        if (!blockNumber) return
        if (!bid) return
        if (!bid.status) return
        if (!chainId) return
        if (!address) return

        if (bid.status.status === BidStatusEnum.Awarded && chainId === 4913 && bid.awardedBidData === null) {
            getAwardedBidLogs(OevAuctionHouseAddres, "https://oev-network.calderachain.xyz/http", address, BigInt(bid.txBlock), bid).then((data) => {
                if (!data) return
                setUpdateDApiData(data)
                bid.awardedBidData = data

                const value = data[4]
                const timestamp = data[3]

                const date = new Date(parseInt(timestamp.toString()) * 1000)
                const bigIntValue = BigInt(value)

                const dapiValue = {
                    value: bigIntValue,
                    timestamp: date.toLocaleString()
                } as DApiValue

                setDapiValueAfterUpdate(dapiValue)

                setBid(bid)
            })
        }
    }, [OevAuctionHouseAddres, address, bid, blockNumber, chainId, setBid])

    useEffect(() => {
        if (!blockNumber) return
        if (!bid) return
        if (!bid.status) return


    }, [blockNumber, bid])

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

    const getBidType = () => {
        if (!bid) return ""
        if (!bid.bidDetails) return ""

        switch (bid.bidDetails.bidType) {
            case "LTE":
                return Description.extendedLTE + " $" + Utils.parseETH(bid.bidDetails.conditionValue)
            case "GTE":
                return Description.extendedGTE + " $" + Utils.parseETH(bid.bidDetails.conditionValue)
        }
    }

    const getFeeDeduction = () => {
        if (!bid) return BigInt(0)
        if (!bid.status) return BigInt(0)

        return bid.status.collateralAmount > bid.status.protocolFeeAmount ? bid.status.collateralAmount : bid.status.protocolFeeAmount
    }

    return (
        bid === undefined ? null :
            <VStack maxW={"700px"} p={4} shadow="md" borderWidth="px" flex="1" bgColor={Utils.COLORS.main} alignItems={"left"}>
                <Flex p={2} gap={1} alignItems={"center"} boxShadow={"sm"} bgColor={getColor(bid)} width={"100%"}>
                    <Image src={ChainLogo(bid.chainId.toString(), true)} width={"32px"} height={"32px"} />
                    <DApiRow dApi={bid.dapi} isLoading={(isPending || isLoading || isBusy)} setDapi={() => checkCorrectNetwork(bid)} isOpen={true} bgColor={"white"}></DApiRow>
                </Flex>

                <VStack width={"100%"} spacing={3}>
                    <Flex width={"100%"} gap={3} justifyContent={"space-between"}>
                        <InfoRow header={"Bid Condition"} text={getBidType()} ></InfoRow>
                        <InfoRow header={"Bid Amount"} text={Utils.parseETH(bid.ethAmount) + " " + bid.chainSymbol} ></InfoRow>
                    </Flex>
                    {
                        status &&
                        <VStack width={"100%"} spacing={3}>
                            <Flex width={"100%"} gap={3} justifyContent={"space-between"}>
                                <InfoRow header={"Collateral Amount"} text={Utils.parseETH(status.collateralAmount) + " ETH"} ></InfoRow>
                                <InfoRow header={"Protocol Fee Amount"} text={Utils.parseETH(status.protocolFeeAmount) + " ETH"} ></InfoRow>
                            </Flex>
                            <InfoRow header={"Fee Deduction"} text={Description.feeDeductionTitle(Utils.parseETH(getFeeDeduction()))} ></InfoRow>
                            {
                                dapiValueAfterUpdate &&
                                <Flex width={"100%"} gap={3} justifyContent={"space-between"}>
                                    <InfoRow header={"dAPI Value to Update"} text={"$" + Utils.parseETH(dapiValueAfterUpdate?.value) + " | " + dapiValueAfterUpdate?.timestamp} ></InfoRow>
                                </Flex>
                            }
                            <InfoRow header={"Status"} text={BidStatusEnum[status.status]} ></InfoRow>
                            {
                                status.status === BidStatusEnum.Awarded && bid.updateTx === "0x0" as `0x${string}` && !bid.isExpired ?
                                    bid.chainId.toString() !== chain!.id.toString() ? <SwitchNetwork header={false} destinationChain={bid.chainId} switchMessage={`Switch Network to Update ${bid.dapi.name} DApi`} /> :
                                        <ExecuteButton isDisabled={!updateDApiCallData} text={"Update " + bid.dapi.name} isD onClick={() => signUpdateTx()}></ExecuteButton>
                                    : null
                            }

                        </VStack>
                    }
                    {
                        stage === StageEnum.Report ? <ErrorRow text={Description.proceedToReportStage} margin={0} bgColor={Utils.COLORS.info} header={Description.proceedToReportTitle}></ErrorRow> : null
                    }
                </VStack>

            </VStack>
    );
};

export default BidView;


