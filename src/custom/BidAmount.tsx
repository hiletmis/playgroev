import { Text, Box, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS, parseETH, sanitizeAmount } from '../helpers/utils';
import { useContext, useEffect, useState } from 'react';
import { OevContext } from '../OEVContext';
import { useBalance, useAccount } from 'wagmi';
import * as Utils from '../helpers/utils';
import { parseEther } from 'ethers';

import {
    NumberInput,
    NumberInputField,
} from '@chakra-ui/react'

const BidAmount = (props: any) => {

    const [error, setError] = useState("")

    const { chain, ethAmount, setEthAmount, bgColor = COLORS.app, ethBalance, isInputDisabled = false } = props;
    const { prices, isBiddable, setIsBiddable } = useContext(OevContext);

    const { address } = useAccount()

    const { data: targetChainBalance } = useBalance(
        {
            chainId: parseInt(chain.id) || 4913,
            address: address
        }
    )

    useEffect(() => {
        if ((ethAmount) === "") return;
        if (targetChainBalance === undefined) return;

        setError("")
        setIsBiddable(true)

        if (targetChainBalance.value - BigInt(parseEther(ethAmount)) < 0) {
            setError(`Insufficient balance on ${chain.name} chain with ${Utils.parseETH(targetChainBalance.value)} ${chain.symbol}`)
            setIsBiddable(false)
            return;
        }

        const bidValue = parseFloat(ethAmount) * parseFloat(parseETH(prices.bidTokenPrice))
        const biddableAmount = parseFloat(ethBalance) * parseFloat(parseETH(prices.colleteralTokenPrice)) * 10
        setIsBiddable(bidValue <= biddableAmount)
        setError(bidValue <= biddableAmount ? "" : `Insufficient collateral. Please deposit more collateral`)
    }, [ethAmount, ethBalance, prices, setIsBiddable, targetChainBalance, chain]);

    return (
        chain == null ? null :
            <VStack alignItems={"left"} >
                <Text fontWeight={"bold"} fontSize={"lg"}>I want to bid</Text>
                <Box width={"100%"} bgColor={bgColor} >
                    <VStack spacing={3} direction="row" align="left" m="1rem">
                        <Flex alignItems={"center"}>
                            <NumberInput isDisabled={isInputDisabled} color={isBiddable ? "black" : "red"} value={ethAmount} step={1} min={0} size={"lg"} onChange={(valueString) => sanitizeAmount(valueString, setEthAmount)}>
                                <NumberInputField borderWidth={"0px"} placeholder="0.0" fontSize={"4xl"} />
                            </NumberInput>
                            <Spacer />
                            <Text fontWeight={"bold"} fontSize={"lg"}>{chain.symbol}</Text>
                        </Flex>

                    </VStack>
                </Box>
                {
                    ethAmount === "" || isBiddable ? null :
                        <Flex p={2} width={"100%"} bgColor={COLORS.caution} >
                            <Text fontSize={"md"} fontWeight={"bold"}>{error}</Text>
                        </Flex>
                }

            </VStack>
    );
};

export default BidAmount;


