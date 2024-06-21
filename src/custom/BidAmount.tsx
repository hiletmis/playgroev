import { Text, Box, Image, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS, parseETH, sanitizeAmount } from '../helpers/utils';
import { ChainLogo } from '@api3/logos';
import { useContext, useEffect } from 'react';
import { OevContext } from '../OEVContext';

import {
    NumberInput,
    NumberInputField,
} from '@chakra-ui/react'

const BidAmount = (props: any) => {
    const { chain, ethAmount, setEthAmount, bgColor = COLORS.app, ethBalance, isInputDisabled = false } = props;
    const { prices, isBiddable, setIsBiddable } = useContext(OevContext);

    useEffect(() => {
        if ((ethAmount) === "") return;
        const bidValue = parseFloat(ethAmount) * parseFloat(parseETH(prices.bidTokenPrice))
        const biddableAmount = parseFloat(ethBalance) * parseFloat(parseETH(prices.colleteralTokenPrice)) * 10
        setIsBiddable(bidValue <= biddableAmount)
    }, [ethAmount, ethBalance, prices, setIsBiddable]);

    return (
        chain == null ? null :
            <VStack alignItems={"left"} >
                <Text fontWeight={"bold"} fontSize={"md"}>Bid Amount</Text>
                <Box width={"100%"} bgColor={bgColor} >
                    <VStack spacing={3} direction="row" align="left" m="1rem">
                        <Flex alignItems={"center"}>
                            <NumberInput isDisabled={isInputDisabled} color={isBiddable ? "black" : "red"} value={ethAmount} step={1} min={0} size={"lg"} onChange={(valueString) => sanitizeAmount(valueString, setEthAmount)}>
                                <NumberInputField borderWidth={"0px"} placeholder="0.0" fontSize={"4xl"} />
                            </NumberInput>
                            <Spacer />
                            <Image marginRight={2} src={ChainLogo(chain.id, true)} width={"40px"} height={"40px"} />
                        </Flex>

                    </VStack>
                </Box>
                {
                    ethAmount === "" || isBiddable ? null :
                        <Flex p={2} width={"100%"} bgColor={COLORS.caution} >
                            <Text fontSize={"md"} fontWeight={"bold"}>Insufficient collateral. Please deposit more collateral</Text>
                        </Flex>
                }
            </VStack>
    );
};

export default BidAmount;


