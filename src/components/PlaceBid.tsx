import { useState, useEffect } from "react";
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
import BidView from "../custom/BidView";
import { EncodeBidDetailsArgs } from "../types";
import { OevAuctionHouse__factory, deploymentAddresses } from '@api3/contracts';
import { parseEther } from 'ethers';
import { BidInfo } from "../types";

import {
    VStack, Flex, Text
} from "@chakra-ui/react";

const Hero = () => {
    const { address, chain } = useAccount()

    const [selectedChain, setSelectedChain] = useState(Utils.getChain("1"));
    const [dApi, setDapi] = useState(Utils.getEthUsdDapi());
    const [dapiProxyWithOevAddress, setDapiProxyWithOevAddress] = useState("" as `0x${string}`);

    const [ethAmount, setEthAmount] = useState("");
    const [ethBalance, setEthBalance] = useState("0");
    const [fulfillValue, setFulfillValue] = useState("");
    const [bidType, setBidType] = useState("");
    const [bidDetails, setBidDetails] = useState("" as `0x${string}`);
    const [protocolFee, setProtocolFee] = useState(BigInt(0))
    const [collateralFee, setCollateralFee] = useState(BigInt(0))

    const [bidId, setBidId] = useState("" as `0x${string}`)
    const [bids, setBids] = useState([] as BidInfo[])
    const [isInputDisabled, setIsInputDisabled] = useState(false)

    const [isError, setIsError] = useState(false)

    const OevAuctionHouseAddres = deploymentAddresses.OevAuctionHouse[4913] as `0x${string}`
    const bidTopic = "0x0000000000000000000000000000000000000000000000000000000000000001" as `0x${string}`

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
                    tx: hash,
                    chainId: BigInt(selectedChain!.id),
                    dApi: dApi,
                    ethAmount: BigInt(parseEther(ethAmount)),
                    explorer: selectedChain!.explorer.browserUrl
                } as BidInfo

                setBids([...bids, newBid])

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
            bidDetails,
            collateralFee,
            protocolFee
        ],
        query: {
            enabled: ethAmount !== "0" && ethAmount !== "" && fulfillValue !== "" && bidType !== "",
        }
    })

    useEffect(() => {
        setIsError(placeBidError != null)
    }, [placeBidError])

    useEffect(() => {
        if (dApi == null) return;
        if (selectedChain == null) return;
        if (address == null) return;

        const oevProxy = Utils.getDapiProxyWithOevAddress(BigInt(selectedChain.id).toString(), dApi.name);
        setDapiProxyWithOevAddress(oevProxy);

        if (bidType !== "LTE" && bidType !== "GTE") return;

        const bidDetailsArgs: EncodeBidDetailsArgs = {
            bidType: bidType,
            proxyAddress: oevProxy,
            conditionValue: fulfillValue === "" ? BigInt(0) : parseEther(fulfillValue),
            updaterAddress: address!,
        }

        const bidDetails = Utils.encodeBidDetails(bidDetailsArgs)
        setBidDetails(bidDetails)
        setBidId(Utils.getBidId(address, bidTopic, bidDetails))

    }, [address, bidType, dApi, fulfillValue, selectedChain]);

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

    return (
        chain == null ? <SignIn></SignIn> :
            chain.id !== 4913 ? <SwitchNetwork /> :
                <VStack spacing={4} alignItems={"left"} >
                    <CustomHeading header={"Place a Bid"} description={"Places bids in anticipation of an OEV opportunity on a specific dapi."} isLoading={isInputDisabled}></CustomHeading>
                    <Flex flexWrap={"wrap"} justifyContent={"space-between"} alignItems={"left"} width={"100%"} >
                        <VStack minW={"400px"} p={4} shadow="md" borderWidth="px" flex="1" bgColor={Utils.COLORS.main} alignItems={"left"}>
                            <Flex>
                                <Text fontWeight={"bold"} fontSize={"md"}>Select Chain and DApi</Text>
                            </Flex>
                            <VStack spacing={5} direction="row" align="left">
                                <DApiList dApi={dApi} setDapi={setDapi} selectedChain={selectedChain} setSelectedChain={setSelectedChain}></DApiList>
                                <InfoRow header={"DApi Proxy"} text={dapiProxyWithOevAddress} link={Utils.dapiProxyAddressExternalLink(selectedChain?.explorer.browserUrl, dapiProxyWithOevAddress)}></InfoRow>
                                <BidAmount ethAmount={ethAmount} setEthAmount={setEthAmount} ethBalance={ethBalance} chain={chain} isInputDisabled={isInputDisabled}></BidAmount>
                                <BidConditions fulfillValue={fulfillValue} setFulfillValue={setFulfillValue} condition={bidType} setCondition={setBidType} isInputDisabled={isInputDisabled}></BidConditions>
                                <ErrorRow text={sanitizedError(placeBidError)} margin={0} bgColor={Utils.COLORS.caution} header={"Error"}></ErrorRow>
                                <ExecuteButton
                                    isDisabled={isError || isInputDisabled || !ethAmount || !fulfillValue || !bidType || isNaN(parseFloat(ethAmount)) || parseFloat(ethAmount) <= 0 || parseFloat(ethBalance) < parseFloat(ethAmount)}
                                    text={isInputDisabled ? "Placing Bid..." : "Place Bid"}
                                    onClick={signPayload}>
                                </ExecuteButton>
                            </VStack>
                        </VStack>
                        <VStack minW={"400px"} p={4} shadow="md" borderWidth="px" flex="1" bgColor={Utils.COLORS.main} alignItems={"left"} overflow={"scroll"}>
                            <BidView bids={bids}></BidView>
                        </VStack>
                    </Flex>
                </VStack>
    );
};

export default Hero;