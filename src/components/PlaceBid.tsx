import { useState, useEffect } from "react";
import SignIn from '../custom/SignIn';
import { useAccount, useBalance } from "wagmi";
import { COLORS } from '../helpers/utils';
import DataFeedRow from "../custom/DataFeedRow";
import CustomHeading from "../custom/Heading";
import BidAmount from "../custom/BidAmount";
import BidConditions from "../custom/BidCondition";
import ExecuteButton from "../custom/ExecuteButton";
import { DataFeed } from "../types";

import {
    VStack, Box, Text, Flex, Spacer
} from "@chakra-ui/react";

const Hero = () => {
    const { address, chain } = useAccount()

    const [dataFeed, setDataFeed] = useState({
        p1: "ETH",
        p2: "USD",
        chainId: "1",
        proxyAddress: "0x5c9dd501921A7dD4FB31d88aC832Cdc36b8D3140",
        beaconId: "0x74736c3bb73e14107f6b39de71be6a9044180759b3d669204c2341d499f8cbe0",
        beneficiaryAddress: "0x90f79bf6eb2c4f870365e785982e1f101e93b906"
    } as DataFeed);
    const [ethAmount, setEthAmount] = useState("");
    const [ethBalance, setEthBalance] = useState("0");
    const [fulfillValue, setFulfillValue] = useState("");
    const [condition, setCondition] = useState(null);

    const fetchETHBalance_ = useBalance({
        address: address,
    })

    useEffect(() => {
        if (fetchETHBalance_.data != null) {
            setEthBalance(fetchETHBalance_.data.formatted)
        }
    }, [fetchETHBalance_]);

    const signPayload = async () => {
        setDataFeed(dataFeed);
    }

    return (
        chain == null ? <SignIn></SignIn> :
            <VStack spacing={4} minWidth={"350px"} maxWidth={"700px"} alignItems={"left"} >
                <CustomHeading header={"Place a Bid"} description={"Places bids in anticipation of an OEV opportunity on a specific dapi."} isLoading={false}></CustomHeading>
                <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"} boxShadow={"md"} >

                    <VStack spacing={3} direction="row" align="left" m="1rem">
                        <DataFeedRow dataFeed={dataFeed}></DataFeedRow>
                        <BidAmount ethAmount={ethAmount} setEthAmount={setEthAmount} ethBalance={ethBalance} chain={chain}></BidAmount>
                        <BidConditions fulfillValue={fulfillValue} setFulfillValue={setFulfillValue} condition={condition} setCondition={setCondition}></BidConditions>
                        <ExecuteButton
                            isDisabled={!ethAmount || !fulfillValue || !condition || isNaN(parseFloat(ethAmount)) || parseFloat(ethAmount) <= 0 || parseFloat(ethBalance) < parseFloat(ethAmount)}
                            text={'Bid'}
                            onClick={signPayload}>
                        </ExecuteButton>
                    </VStack>
                </Box>
                <VStack p={4} shadow="md" borderWidth="px" flex="1" borderRadius={"10"} bgColor={COLORS.main} alignItems={"left"}>
                    <Flex>
                        <Text fontWeight={"bold"} fontSize={"md"}>Bid</Text>
                        <Spacer />
                    </Flex>

                </VStack>
            </VStack>
    );
};

export default Hero;