import { Text, Box, Image, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS } from '../helpers/utils';
import { ChainLogo } from '@api3/logos';

import {
    NumberInput,
    NumberInputField,
} from '@chakra-ui/react'

const Hero = (props: any) => {
    const { title, chain, ethAmount, setEthAmount, bgColor = COLORS.app, ethBalance } = props;

    return (
        chain == null ? null :
            <VStack alignItems={"left"} >
                <Text fontWeight={"bold"} fontSize={"md"}>{title}</Text>
                <Box width={"100%"} bgColor={bgColor} borderRadius={"10"}>
                    <VStack spacing={3} direction="row" align="left" m="1rem">
                        <Flex>
                            <NumberInput value={ethAmount} step={1} min={0} size={"lg"} onChange={(valueString) => setEthAmount(valueString)}>
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
                                {parseFloat(ethBalance) < parseFloat(ethAmount) ? "Insufficient Balance" : chain.nativeCurrency.name + " Balance"}
                            </Text>

                            <Spacer />
                            <Image src={'/wallet.svg'} width={"40px"} height={"20px"} />
                            <Text fontSize={"sm"}>{ethBalance}</Text>
                        </Flex>
                    </VStack>
                </Box>
            </VStack>
    );
};

export default Hero;


