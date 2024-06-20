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

    const bidValue = () => {
        if (prices == null) return 0;
        if (ethAmount === "") return 0;
        return parseFloat(ethAmount) * parseFloat(parseETH(prices.bidTokenPrice));
    }

    const collateralValue = () => {
        if (prices == null) return null;
        if (ethBalance === "") return 0;
        return parseFloat(ethBalance) * parseFloat(parseETH(prices.colleteralTokenPrice));
    }

    const biddableAmount = () => {
        if (ethBalance === "") return 0;
        return parseFloat(ethBalance) * parseFloat(parseETH(prices.colleteralTokenPrice)) * 10
    }

    useEffect(() => {
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
                            <NumberInput isDisabled={isInputDisabled} value={ethAmount} step={1} min={0} size={"lg"} onChange={(valueString) => sanitizeAmount(valueString, setEthAmount)}>
                                <NumberInputField borderWidth={"0px"} placeholder="0.0" fontSize={"4xl"} />
                            </NumberInput>
                            <Spacer />
                            <Image marginRight={2} src={ChainLogo(chain.id, true)} width={"40px"} height={"40px"} />
                        </Flex>

                    </VStack>
                </Box>
                <Text fontWeight={"bold"} fontSize={"md"}>Collateral</Text>
                <Box width={"100%"} bgColor={bgColor} >
                    <VStack spacing={3} direction="row" align="left" m="1rem">

                        <Flex>
                            <Text fontWeight={"bold"} fontSize={"md"}>Collateral Amount</Text>
                            <Spacer />
                            <Text fontSize={"md"}>{ethBalance} ETH</Text>
                        </Flex>
                        <Flex>
                            <Text fontWeight={"bold"} fontSize={"md"}>Collateral Value</Text>
                            <Spacer />
                            <Text fontSize={"md"}>${collateralValue()}</Text>
                        </Flex>

                        <Flex>
                            <Text fontWeight={"bold"} fontSize={"md"}>Bid Allowance</Text>
                            <Spacer />
                            <Text fontSize={"md"}>${biddableAmount()}</Text>
                        </Flex>
                        <Flex>
                            <Text fontWeight={"bold"} color={isBiddable ? "black" : "red"} fontSize={"md"}>Bid Value</Text>
                            <Spacer />
                            <Text fontSize={"md"}>${bidValue()}</Text>
                        </Flex>
                    </VStack>

                </Box>

            </VStack>
    );
};

export default BidAmount;


