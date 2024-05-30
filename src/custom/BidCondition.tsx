import { Text, Box, Radio, RadioGroup, Stack, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS, sanitizeAmount } from '../helpers/utils';

import {
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from '@chakra-ui/react'

const Hero = (props: any) => {
    const { fulfillValue, setFulfillValue, condition, setCondition, bgColor = COLORS.app, isInputDisabled = false } = props;

    return (
        <VStack alignItems={"left"} >
            <Text fontWeight={"bold"} fontSize={"md"}>Bid Conditions</Text>

            <Box width={"100%"} height="80px" bgColor={bgColor} >
                <VStack spacing={3} direction="row" align="left" m="1rem">
                    <Flex>
                        <NumberInput isDisabled={isInputDisabled} value={fulfillValue} step={1} min={0} size={"lg"} onChange={(valueString) => sanitizeAmount(valueString, setFulfillValue)}>
                            <NumberInputField borderWidth={"0px"} placeholder="0.0" fontSize={"4xl"} inputMode="numeric" /><NumberInputStepper></NumberInputStepper>
                        </NumberInput>
                        <Spacer />
                        <Flex alignItems={"center"}>
                            <RadioGroup onChange={setCondition} value={condition}>
                                <Stack direction='row'>
                                    <Radio isDisabled={isInputDisabled} value='LTE'>LTE</Radio>
                                    <Radio isDisabled={isInputDisabled} value='GTE'>GTE</Radio>
                                </Stack>
                            </RadioGroup>
                        </Flex>
                    </Flex>
                </VStack>
            </Box>
        </VStack>
    );
};

export default Hero;





