
import { useContext, useState } from 'react';
import { Button, VStack, Flex, Text, Spacer } from '@chakra-ui/react';
import CustomHeading from '../custom/Heading';
import ExecuteButton from '../custom/ExecuteButton';
import AddCollateral from '../custom/AddCollateral';
import SignIn from '../custom/SignIn';
import { useAccount, useWriteContract, useSimulateContract, useReadContract } from 'wagmi';
import SwitchNetwork from '../custom/SwitchNetwork';
import { OevContext } from '../OEVContext';
import { COLORS, parseETH, trimHash } from '../helpers/utils';
import { OevAuctionHouse__factory, deploymentAddresses } from '@api3/contracts';
import { parseEther } from 'ethers';
import { ViewIcon } from '@chakra-ui/icons';

const Bridge = () => {
    const { chain, address } = useAccount()

    const { balance } = useContext(OevContext);
    const [ethAmount, setEthAmount] = useState("");

    const OevAuctionHouseAddres = deploymentAddresses.OevAuctionHouse[4913] as `0x${string}`

    //@ts-ignore
    const { data: bidderBalance } = useReadContract({
        address: OevAuctionHouseAddres,
        abi: OevAuctionHouse__factory.abi,
        chainId: chain ? chain.id : 4913,
        functionName: 'bidderToBalance',
        args: [address as `0x${string}`],
        query: {
            refetchInterval: 10000,
        }
    });

    const { writeContract, isPending, data: hash, reset } = useWriteContract()

    //@ts-ignore
    const { data: depositForBidderData } = useSimulateContract({
        address: OevAuctionHouseAddres,
        abi: OevAuctionHouse__factory.abi,
        chainId: chain ? chain.id : 4913,
        functionName: 'depositForBidder',
        args: [address as `0x${string}`],
        value: ethAmount === "" ? BigInt(0) : parseEther(ethAmount),
        query: {
            enabled: ethAmount !== "0" && ethAmount !== "",
        }
    })

    async function depositForBidder() {
        //@ts-ignore
        writeContract(depositForBidderData?.request, {
            onError: (error: any) => {
                reset();
            },
            onSuccess: () => {

            }
        });
    }

    return (
        chain == null ? <SignIn></SignIn> :
            chain.id !== 4913 ? <SwitchNetwork /> :
                <VStack alignItems={"left"} spacing={5}>
                    <CustomHeading header={"Deposit Collateral"} description={"Depoist your Ethereum to start placing bids."} isLoading={isPending}></CustomHeading>
                    {
                        balance === BigInt(0) ?
                            <VStack p={4} width={"100%"} borderRadius={"10"} bgColor={COLORS.caution} alignItems={"left"} spacing={5}>
                                <Text fontSize={"md"} fontWeight={"bold"}>Add Funds</Text>
                                <Text fontSize={"sm"}>You have no funds to deposit. Please add funds to your wallet.</Text>
                                <Text fontSize={"sm"}>You can add funds to your wallet by using the official OEV Network bridge.</Text>
                                <Button
                                    size={"md"} colorScheme={"blue"} variant={"solid"}
                                    onClick={() => window.open('https://oev-network.bridge.caldera.xyz/', '_blank')}>OEV Network Bridge
                                </Button>
                            </VStack>
                            :
                            <VStack alignItems={"left"} spacing={5}>
                                <Flex p={2} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                                    <Text fontSize={"md"} fontWeight={"bold"}>Deposit Balance</Text>
                                    <Spacer />
                                    <Text fontWeight={"bold"} fontSize={"md"}>{parseETH(bidderBalance)} ETH</Text>
                                </Flex>
                                <AddCollateral tokenAmount={ethAmount} setTokenAmount={setEthAmount} tokenBalance={parseETH(balance)} ></AddCollateral>
                                <ExecuteButton
                                    text={'Deposit Collateral'}
                                    isDisabled={ethAmount === "0" || ethAmount === "" || parseFloat(parseETH(balance)) < parseFloat(ethAmount)}
                                    onClick={() => depositForBidder()}>
                                </ExecuteButton>
                            </VStack>
                    }
                    {
                        hash &&
                        <Flex p={2} gap={2} width={"100%"} bgColor={COLORS.app} borderRadius={"10"}>
                            <Text fontSize={"md"} fontWeight={"bold"}>Transaction</Text>
                            <Spacer />
                            <Text fontWeight={"bold"} fontSize={"md"}>{trimHash(hash)}</Text>
                            <Text fontSize={"md"} fontWeight={"bold"}>
                                <a href={`https://oev-network.calderaexplorer.xyz/tx/${hash}`} target="_blank" rel="noopener noreferrer">
                                    <ViewIcon color={"blue.500"}></ViewIcon>
                                </a>
                            </Text>
                        </Flex>
                    }
                </VStack>
    );
};

export default Bridge;