import { useState, useEffect } from "react";
import SignIn from '../custom/SignIn';
import SwitchNetwork from '../custom/SwitchNetwork';
import { useAccount, useBalance } from "wagmi";
import { COLORS, getEthUsdDapi, getChain } from '../helpers/utils';
import CustomHeading from "../custom/Heading";
import BidAmount from "../custom/BidAmount";
import BidConditions from "../custom/BidCondition";
import ExecuteButton from "../custom/ExecuteButton";
import DApiList from "../custom/DApiList";

import {
    VStack, Box, Text, Flex, Spacer
} from "@chakra-ui/react";

const Hero = () => {
    const { address, chain } = useAccount()

    const [selectedChain, setSelectedChain] = useState(getChain("1"));
    const [dApi, setDapi] = useState(getEthUsdDapi());
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

    }

    useEffect(() => {

    }, [dApi]);

    return (
        chain == null ? <SignIn></SignIn> :
            chain.id !== 4913 ? <SwitchNetwork /> :
                <VStack spacing={4} minWidth={"400px"} maxWidth={"700px"} alignItems={"left"} >
                    <CustomHeading header={"Place a Bid"} description={"Places bids in anticipation of an OEV opportunity on a specific dapi."} isLoading={false}></CustomHeading>
                    <Box width={"100%"} bgColor={COLORS.main} borderRadius={"10"}  >

                        <VStack spacing={3} direction="row" align="left" m="1rem">
                            <DApiList dApi={dApi} setDapi={setDapi} selectedChain={selectedChain} setSelectedChain={setSelectedChain}></DApiList>
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