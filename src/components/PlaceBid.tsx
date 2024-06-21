import { useState, useEffect, useContext } from "react";
import SignIn from '../custom/SignIn';
import SwitchNetwork from '../custom/SwitchNetwork';
import { useAccount, useReadContract, useWriteContract, useSimulateContract } from "wagmi";
import * as Utils from '../helpers/utils';
import CustomHeading from "../custom/Heading";
import BidAmount from "../custom/BidAmount";
import BidConditions from "../custom/BidCondition";
import ExecuteButton from "../custom/ExecuteButton";
import ErrorRow from "../custom/ErrorRow";
import DApiList from "../custom/DApiList";
import InfoRow from "../custom/InfoRow";
import { BidDetailsArgs, BidPrices, StageEnum } from "../types";
import { OevAuctionHouse__factory, deploymentAddresses } from '@api3/contracts';
import { parseEther } from 'ethers';
import { BidInfo } from "../types";
import { bidTopic } from "../helpers/constants";
import { OevContext } from "../OEVContext";

import {
    VStack, Flex, Text
} from "@chakra-ui/react";

const PlaceBid = () => {
    const { address, chain } = useAccount()
    const { setPrices, stage, setStage, setBid, isBiddable } = useContext(OevContext);

    const [selectedChain, setSelectedChain] = useState(Utils.getChain("1"));
    const [dApi, setDapi] = useState(Utils.getEthUsdDapi());
    const [dapiProxyWithOevAddress, setDapiProxyWithOevAddress] = useState("" as `0x${string}`);

    const [ethAmount, setEthAmount] = useState("");
    const [ethBalance, setEthBalance] = useState("0");
    const [fulfillValue, setFulfillValue] = useState("");
    const [bidType, setBidType] = useState("");
    const [bidDetails, setBidDetails] = useState({} as BidDetailsArgs);
    const [protocolFee, setProtocolFee] = useState(BigInt(0))
    const [collateralFee, setCollateralFee] = useState(BigInt(0))

    const [bidId, setBidId] = useState("" as `0x${string}`)
    const [isInputDisabled, setIsInputDisabled] = useState(false)

    const [isError, setIsError] = useState(false)

    const OevAuctionHouseAddres = deploymentAddresses.OevAuctionHouse[4913] as `0x${string}`

    const sanitizedError = (error: any | null) => {
        if (error === null) return null;
        return (error.message.split("\n")[0])
    }

    const signPayload = async () => {

        if (placeBidData == null) return;
        setIsInputDisabled(true)

        //@ts-ignore
        writeContract(placeBidData?.request, {
            onError: (error: any) => {
                console.log(error)
                setIsInputDisabled(false)
                reset();
            },
            onSuccess: () => {
                setIsInputDisabled(false)

                const newBid = {
                    bidId: bidId,
                    bidTopic: bidTopic,
                    bidDetails: bidDetails,
                    bidDetailsHash: bidDetails.hash,
                    tx: hash,
                    updateTx: "0x0",
                    reportTx: "0x0",
                    awardedBidData: null,
                    txBlock: BigInt(0),
                    chainId: parseInt(selectedChain!.id),
                    chainSymbol: selectedChain!.symbol,
                    dapi: dApi,
                    ethAmount: BigInt(parseEther(ethAmount)),
                    explorer: selectedChain!.explorer.browserUrl,
                    isExpired: false,
                    status: null
                } as BidInfo

                setBid(newBid)
                if (stage === StageEnum.PlaceBid) {
                    setStage(StageEnum.AwardAndUpdate)
                }

            }
        });
    }

    //@ts-ignore
    const { data: bidderBalance } = useReadContract({
        address: OevAuctionHouseAddres,
        abi: OevAuctionHouse__factory.abi,
        chainId: chain ? chain.id : 4913,
        functionName: 'bidderToBalance',
        args: [address as `0x${string}`],
        query: {
            refetchInterval: 10000,
        }
    });

    const { writeContract, data: hash, reset } = useWriteContract()

    //@ts-ignore
    const { data: placeBidData, error: placeBidError } = useSimulateContract({
        address: OevAuctionHouseAddres,
        abi: OevAuctionHouse__factory.abi,
        chainId: chain ? chain.id : 4913,
        functionName: 'placeBid',
        args: [
            bidTopic,
            BigInt(selectedChain ? selectedChain.id : 1),
            BigInt(ethAmount === "" ? 0 : parseEther(ethAmount)),
            bidDetails.bytes!,
            collateralFee,
            protocolFee
        ],
        query: {
            enabled: (ethAmount !== "0" && ethAmount !== "" && fulfillValue !== "" && bidType !== "") && (stage === StageEnum.PlaceBid) && isBiddable,
        }
    })

    useEffect(() => {
        setIsError(placeBidError != null)
    }, [placeBidError])

    useEffect(() => {
        if (dApi == null) return;
        if (selectedChain == null) return;
        if (address == null) return;

        const oevProxy = Utils.getDapiProxyWithOevAddress(selectedChain.id.toString(), dApi.name);
        Utils.getPrices(selectedChain.symbol + "/USD").then((prices: BidPrices) => {
            setPrices(prices)
        })
        setDapiProxyWithOevAddress(oevProxy);

        if (bidType !== "LTE" && bidType !== "GTE") return;

        let bidDetailsArgs: BidDetailsArgs = {
            bidType: bidType,
            proxyAddress: oevProxy,
            conditionValue: fulfillValue === "" ? BigInt(0) : parseEther(fulfillValue),
            updaterAddress: address!,
        }

        const bidDetails = Utils.encodeBidDetails(bidDetailsArgs)
        bidDetailsArgs.hash = Utils.bidDetailsHash(bidDetails)
        bidDetailsArgs.bytes = bidDetails

        setBidDetails(bidDetailsArgs)
        setBidId(Utils.getBidId(address, bidTopic, bidDetails))

    }, [address, bidType, dApi, fulfillValue, selectedChain, setPrices]);

    useEffect(() => {
        if (bidderBalance != null) {
            setEthBalance(Utils.parseETH(bidderBalance))
        }
    }, [bidderBalance]);

    useEffect(() => {
        if (ethAmount === "") return;
        const protocolFee = BigInt(parseEther(ethAmount));
        const collateralFee = BigInt(parseEther(ethAmount));
        setProtocolFee(protocolFee)
        setCollateralFee(collateralFee)
    }, [ethAmount])

    useEffect(() => {
        if (address == null) return;
        setBid(undefined)
        setStage(StageEnum.PlaceBid)
    }, [address, setBid, setStage])

    return (
        chain == null ? <SignIn></SignIn> :
            <VStack spacing={4} alignItems={"left"} >
                <CustomHeading header={"Place a Bid"} description={"Places bids in anticipation of an OEV opportunity on a specific dapi."} isLoading={isInputDisabled}></CustomHeading>
                <VStack maxW={"700px"} p={4} shadow="md" borderWidth="px" flex="1" bgColor={Utils.COLORS.main} alignItems={"left"}>
                    <Flex>
                        <Text fontWeight={"bold"} fontSize={"md"}>Select Chain and DApi</Text>
                    </Flex>
                    <VStack spacing={2} direction="row" align="left">
                        <DApiList dApi={dApi} setDapi={setDapi} selectedChain={selectedChain} setSelectedChain={setSelectedChain}></DApiList>
                        <InfoRow header={"DApi Proxy"} text={dapiProxyWithOevAddress} link={Utils.dapiProxyAddressExternalLink(selectedChain?.explorer.browserUrl, dapiProxyWithOevAddress)}></InfoRow>

                        {
                            chain.id !== 4913 ? <SwitchNetwork header={false} switchMessage={"Switch Network to Place a Bid"} /> :
                                <VStack alignItems={"left"} spacing={5}>
                                    <BidAmount ethAmount={ethAmount} setEthAmount={setEthAmount} ethBalance={ethBalance} chain={selectedChain} isInputDisabled={isInputDisabled}></BidAmount>
                                    <BidConditions fulfillValue={fulfillValue} setFulfillValue={setFulfillValue} condition={bidType} setCondition={setBidType} isInputDisabled={isInputDisabled}></BidConditions>
                                    <ErrorRow text={sanitizedError(placeBidError)} margin={0} bgColor={Utils.COLORS.caution} header={"Error"}></ErrorRow>

                                    {
                                        stage > StageEnum.PlaceBid ? <ErrorRow text={"Your bid has been placed. Please proceed to next stage"} margin={0} bgColor={Utils.COLORS.info} header={"Proceed to Update DApi"}></ErrorRow> :
                                            <ExecuteButton
                                                isDisabled={isError || isInputDisabled || !ethAmount || !fulfillValue || !bidType || isNaN(parseFloat(ethAmount)) || parseFloat(ethAmount) <= 0 || !isBiddable}
                                                text={isInputDisabled ? "Placing Bid..." : "Place Bid"}
                                                onClick={signPayload}>
                                            </ExecuteButton>
                                    }
                                </VStack>
                        }
                    </VStack>
                </VStack>

            </VStack>
    );
};

export default PlaceBid;