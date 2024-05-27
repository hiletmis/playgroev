import { Text, Box, Radio, RadioGroup, Stack, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS } from '../helpers/utils';

import {
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from '@chakra-ui/react'

const Hero = (props: any) => {
    const { fulfillValue, setFulfillValue, condition, setCondition, bgColor = COLORS.app } = props;
    return (
        <VStack alignItems={"left"} >
            <Text fontWeight={"bold"} fontSize={"md"}>Bid Conditions</Text>

            <Box width={"100%"} height="80px" bgColor={bgColor} borderRadius={"10"}>
                <VStack spacing={3} direction="row" align="left" m="1rem">
                    <Flex>
                        <NumberInput value={fulfillValue} step={1} min={0} size={"lg"} onChange={(valueString) => setFulfillValue(valueString)}>
                            <NumberInputField borderWidth={"0px"} placeholder="0.0" fontSize={"4xl"} inputMode="numeric" /><NumberInputStepper></NumberInputStepper>
                        </NumberInput>
                        <Spacer />
                        <Flex alignItems={"center"}>
                            <RadioGroup onChange={setCondition} value={condition}>
                                <Stack direction='row'>
                                    <Radio value='LTE'>LTE</Radio>
                                    <Radio value='GTE'>GTE</Radio>
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





