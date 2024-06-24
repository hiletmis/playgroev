import { Box, Flex, VStack, NumberInput, NumberInputField, Spacer, Image } from '@chakra-ui/react';
import { COLORS, sanitizeAmount } from "../helpers/utils";
import { ChainLogo } from "@api3/logos";

const AddCollateral = (props: any) => {
    const { setTokenAmount, tokenAmount, tokenBalance, bgColor = COLORS.app } = props;

    const isBalance = () => {
        return parseFloat(tokenBalance) > parseFloat(tokenAmount)
    }

    return (
        <Box width={"100%"} bgColor={bgColor} >
            <VStack spacing={3} direction="row" align="left" m="1.2rem">
                <Flex alignItems={"center"}>
                    <NumberInput value={tokenAmount} color={isBalance() ? "black" : "red"} step={1} min={0} size={"lg"} onChange={(valueString) => { sanitizeAmount(valueString, setTokenAmount) }}><NumberInputField borderWidth={"0px"} placeholder="0.0" fontSize={"4xl"} inputMode="numeric" /></NumberInput>
                    <Spacer />
                    <Image src={ChainLogo("4913", true)} width={"40px"} height={"40px"} />
                </Flex>


            </VStack>
        </Box>
    );
};

export default AddCollateral;