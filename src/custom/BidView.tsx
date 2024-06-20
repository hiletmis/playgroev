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
import ErrorRow from './ErrorRow';
import { getAwardedBidLogs } from '../helpers/get-logs';
import { ContractFunctionExecutionError } from "viem";
import { OevContext } from '../OEVContext';

const BidView = () => {

    const OevAuctionHouseAddres = deploymentAddresses.OevAuctionHouse[4913] as `0x${string}`
    const [api3ServerV1Address, setApi3ServerV1Address] = useState("" as `0x${string}`)

    const { chain, chainId, address } = useAccount()
    const { setBid, bid, stage, setStage } = useContext(OevContext);

    const [updateDApiData, setUpdateDApiData] = useState(null as UpdateOevProxyDataFeedWithSignedData | null);

    const [selectedBidStatus, setSelectedBidStatus] = useState({} as BidStatus)
    const [isBusy, setIsBusy] = useState(false)

    const [page, setPage] = useState(1)
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
                    <DApiRow dApi={bid.dapi} isLoading={(isPending || isLoading || isBusy)} setDapi={() => checkCorrectNetwork(bid)} isOpen={true} bgColor={"white"}></DApiRow>
                </Flex>
                {
                    <VStack width={"100%"} p={5} bgColor={getColor(bid)} spacing={3}>
                        <CopyInfoRow header={"Collateral Amount"} text={Utils.parseETH(selectedBidStatus.collateralAmount) + " ETH"} copyEnabled={false}></CopyInfoRow>
                        <CopyInfoRow header={"Protocol Fee Amount"} text={Utils.parseETH(selectedBidStatus.protocolFeeAmount) + " ETH"} copyEnabled={false}></CopyInfoRow>
                        <CopyInfoRow header={"Status"} text={BidStatusEnum[selectedBidStatus.status]} copyEnabled={false}></CopyInfoRow>
                        {
                            selectedBidStatus.status === BidStatusEnum.Awarded && bid.updateTx === "0x0" as `0x${string}` && !bid.isExpired ?
                                bid.chainId.toString() !== chain!.id.toString() ? <SwitchNetwork header={false} destinationChain={bid.chainId} switchMessage={"Switch Network to Update DApi"} /> :
                                    <ExecuteButton isDisabled={!updateDApiCallData} text={"Update " + bid.dapi.name} isD onClick={() => signUpdateTx()}></ExecuteButton>
                                : null
                        }
                        {
                            stage === StageEnum.Report ? <ErrorRow text={"DApi has been updated. Please proceed to next stage"} margin={0} bgColor={Utils.COLORS.main} header={"Proceed to Bid"}></ErrorRow> : null
                        }
                    </VStack>
                }
            </VStack>
    );
};

export default BidView;


