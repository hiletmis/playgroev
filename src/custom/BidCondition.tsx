import { Text, Box, Radio, RadioGroup, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS, sanitizeAmount } from '../helpers/utils';

import {
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from '@chakra-ui/react'

const BidCondition = (props: any) => {
    const { fulfillValue, setFulfillValue, condition, setCondition, bgColor = COLORS.app, isInputDisabled = false } = props;

    return (
        <VStack alignItems={"left"} >
            <Text fontWeight={"bold"} fontSize={"lg"}>for an update that satisfies the condition</Text>

            <Box width={"100%"} height="80px" bgColor={bgColor} >
                <VStack spacing={3} direction="row" align="left" m="1rem">
                    <Flex alignItems={"center"}>

                        <VStack alignItems={"center"}>
                            <RadioGroup onChange={setCondition} value={condition}>
                                <VStack direction='column' align={"left"}>
                                    <Radio isDisabled={isInputDisabled} value='LTE'>Less than or equal to</Radio>
                                    <Radio isDisabled={isInputDisabled} value='GTE'>Greater than or equal to</Radio>
                                </VStack>
                            </RadioGroup>
                        </VStack>

                        <Spacer />
                        <NumberInput isDisabled={isInputDisabled} value={fulfillValue} step={1} min={0} size={"lg"} onChange={(valueString) => sanitizeAmount(valueString, setFulfillValue)}>
                            <NumberInputField borderWidth={"0px"} placeholder="0.0" fontSize={"4xl"} inputMode="numeric" /><NumberInputStepper></NumberInputStepper>
                        </NumberInput>
                    </Flex>
                </VStack>
            </Box>
        </VStack>
    );
};

export default BidCondition;





