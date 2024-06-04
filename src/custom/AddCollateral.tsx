import { Button, Box, Flex, VStack, NumberInput, NumberInputField, Spacer, Image, Text } from '@chakra-ui/react';
import { COLORS, sanitizeAmount } from "../helpers/utils";
import { SymbolLogo } from "@api3/logos";

const AddCollateral = (props: any) => {
    const { setTokenAmount, tokenAmount, tokenBalance, bgColor = COLORS.app } = props;

    return (
        <Box width={"100%"} bgColor={bgColor} >
            <VStack spacing={3} direction="row" align="left" m="1.2rem">
                <Flex>
                    <NumberInput value={tokenAmount} step={1} min={0} size={"lg"} onChange={(valueString) => { sanitizeAmount(valueString, setTokenAmount) }}><NumberInputField borderWidth={"0px"} placeholder="0.0" fontSize={"4xl"} inputMode="numeric" /></NumberInput>
                    <Spacer />
                    <Image src={SymbolLogo("ETH", true)} width={"40px"} height={"40px"} />
                </Flex>

                <Flex gap={3} alignItems={"center"}>
                    <Text
                        color={parseFloat(tokenBalance) < parseFloat(tokenAmount) ? "red.500" : "black"}
                        fontWeight={"bold"}
                        visibility={tokenBalance === "0" ? "hidden" : "visible"}
                        fontSize={"md"}>
                        {parseFloat(tokenBalance) < parseFloat(tokenAmount) ? "Insufficient Balance" : "Ethereum Balance"}
                    </Text>
                    <Spacer />
                    <Button
                        size={"xs"} colorScheme={"green"} variant={"outline"}
                        onClick={() => window.open('https://oev-network.bridge.caldera.xyz/', '_blank')}>Add Funds
                    </Button>
                    <Text
                        cursor={'pointer'}
                        onClick={() => {
                            setTokenAmount(tokenBalance)
                        }} fontWeight={"bold"} fontSize={"lg"}>{tokenBalance} ETH</Text>
                </Flex>

            </VStack>
        </Box>
    );
};

export default AddCollateral;