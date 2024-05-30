import { Text, Box, Image, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS, sanitizeAmount } from '../helpers/utils';
import { ChainLogo } from '@api3/logos';

import {
    NumberInput,
    NumberInputField,
} from '@chakra-ui/react'

const Hero = (props: any) => {
    const { chain, ethAmount, setEthAmount, bgColor = COLORS.app, ethBalance, isInputDisabled = false } = props;

    return (
        chain == null ? null :
            <VStack alignItems={"left"} >
                <Text fontWeight={"bold"} fontSize={"md"}>Bid Amount</Text>
                <Box width={"100%"} bgColor={bgColor} borderRadius={"10"}>
                    <VStack spacing={3} direction="row" align="left" m="1rem">
                        <Flex>
                            <NumberInput isDisabled={isInputDisabled} value={ethAmount} step={1} min={0} size={"lg"} onChange={(valueString) => sanitizeAmount(valueString, setEthAmount)}>
                                <NumberInputField borderWidth={"0px"} placeholder="0.0" fontSize={"4xl"} />
                            </NumberInput>
                            <Spacer />
                            <Image marginRight={2} src={ChainLogo(chain.id)} width={"40px"} height={"40px"} />
                        </Flex>
                        <Flex>
                            <Text
                                color={parseFloat(ethBalance) < parseFloat(ethAmount) ? "red.500" : "black"}
                                fontWeight={"bold"}
                                fontSize={"sm"}>
                                {parseFloat(ethBalance) < parseFloat(ethAmount) ? "Insufficient Balance" : "Collateral Balance"}
                            </Text>

                            <Spacer />
                            <Image src={'./wallet.svg'} width={"40px"} height={"20px"} />
                            <Text fontSize={"sm"}>{ethBalance}</Text>
                        </Flex>
                    </VStack>
                </Box>
            </VStack>
    );
};

export default Hero;


