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
import { BidDetailsArgs, BidPrices, StageEnum } from "../types";
import { OevAuctionHouse__factory, deploymentAddresses } from '@api3/contracts';
import { parseEther } from 'ethers';
import { BidInfo, DApiElement } from "../types";
import { bidTopic } from "../helpers/constants";
import { OevContext } from "../OEVContext";
import * as Descriptions from "../helpers/descriptions";
import ProgressBar from "../custom/ProgressBar";
import { Chain } from '@api3/chains'

import {
    VStack, Flex, Text
} from "@chakra-ui/react";

const PlaceBid = () => {
    const { address, chain } = useAccount()
    const { setPrices, stage, setStage, setBid, isBiddable } = useContext(OevContext);

    const [selectedChain, setSelectedChain] = useState(null as Chain | null);
    const [dApi, setDapi] = useState(null as DApiElement | null);
    const [step, setStep] = useState(0);
    const [help, setHelp] = useState(false);

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

    const sanitizeEthAmount = (ethAmount: string) => {
        return BigInt(ethAmount === "" ? 0 : parseEther(ethAmount))
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

    //@ts-ignore
    const { data: getCurrentCollateralAndProtocolFeeAmounts } = useReadContract({
        address: OevAuctionHouseAddres,
        abi: OevAuctionHouse__factory.abi,
        chainId: chain ? chain.id : 4913,
        functionName: 'getCurrentCollateralAndProtocolFeeAmounts',
        args: [BigInt(selectedChain ? selectedChain.id : 4913), sanitizeEthAmount(ethAmount)],
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
            sanitizeEthAmount(ethAmount),
            bidDetails.bytes!,
            collateralFee,
            protocolFee
        ],
        query: {
            enabled: (ethAmount !== "" && fulfillValue !== "" && bidType !== "") && (stage === StageEnum.PlaceBid) && isBiddable,
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
        if (selectedChain == null) return;
        if (step === 0) {
            setStep(1)
        }

        if (dApi == null) return;
        if (step === 1) {
            setStep(2)
        }

        if (sanitizeEthAmount(ethAmount) > BigInt(0)) {
            if (step === 2) {
                setStep(3)
            }
        } else {
            setStep(2)
        }

        if (fulfillValue !== "" && bidType !== "") {
            if (step === 3) {
                setStep(4)
            }
        } else {
            if (step === 4) {
                setStep(3)
            }
        }

        if (stage > StageEnum.PlaceBid) {
            setStep(5)
        }
    }, [step, selectedChain, dApi, ethAmount, fulfillValue, bidType, stage])

    useEffect(() => {
        if (getCurrentCollateralAndProtocolFeeAmounts === undefined) return;
        setProtocolFee(getCurrentCollateralAndProtocolFeeAmounts[1])
        setCollateralFee(getCurrentCollateralAndProtocolFeeAmounts[0])
    }, [getCurrentCollateralAndProtocolFeeAmounts])

    useEffect(() => {
        if (address == null) return;
        setBid(undefined)
        setStage(StageEnum.PlaceBid)
    }, [address, setBid, setStage])

    return (
        chain == null ? <SignIn></SignIn> :
            <VStack spacing={4} alignItems={"left"} >
                <CustomHeading header={Descriptions.placeBidTitle} description={Descriptions.placeBidDescription} isLoading={isInputDisabled} setHelp={setHelp} help={help} stage={StageEnum.PlaceBid}></CustomHeading>
                <VStack maxW={"700px"} borderWidth="px" flex="1" bgColor={Utils.COLORS.main} alignItems={"left"}>
                    <Flex>
                        <Text fontWeight={"bold"} fontSize={"lg"}>{Descriptions.selectChainAndDapiDescription}</Text>
                    </Flex>
                    <VStack spacing={2} direction="row" align="left">
                        <DApiList dApi={dApi} setDapi={setDapi} selectedChain={selectedChain} setSelectedChain={setSelectedChain}></DApiList>
                        {

                            chain.id !== 4913 ? <SwitchNetwork header={false} switchMessage={Descriptions.switchToBid} /> :
                                <VStack alignItems={"left"} spacing={5}>
                                    {
                                        dApi == null ? null :
                                            <>
                                                <BidAmount ethAmount={ethAmount} setEthAmount={setEthAmount} ethBalance={ethBalance} chain={selectedChain} isInputDisabled={isInputDisabled}></BidAmount>
                                                <BidConditions fulfillValue={fulfillValue} setFulfillValue={setFulfillValue} condition={bidType} setCondition={setBidType} isInputDisabled={isInputDisabled}></BidConditions>
                                                <ErrorRow text={sanitizedError(placeBidError)} margin={0} bgColor={Utils.COLORS.caution} header={"Error"}></ErrorRow>
                                            </>
                                    }
                                    <ProgressBar step={step} descriptions={["Chain Selection", "dApi Selection", "Entering Bid Amount", "Entering Bid Conditions", "Placing the Bid", "Proceeding to Award and Update"]}></ProgressBar>
                                    {
                                        dApi == null ? null :
                                            stage > StageEnum.PlaceBid ? null :
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