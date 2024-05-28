import { useContext, useEffect } from 'react';
import { Flex, Text, Spacer, Image, Button } from '@chakra-ui/react';
import { ChainLogo } from '@api3/logos';
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useSwitchChain, useBalance } from 'wagmi'
import { parseETH } from '../helpers/utils'
import { OevContext } from '../OEVContext';

const Header = () => {
    const { open } = useWeb3Modal()
    const { chain, address, status } = useAccount()
    const { chains, switchChain } = useSwitchChain()

    const { setBalance } = useContext(OevContext);

    const { data: walletBalance } = useBalance(
        {
            chainId: chain?.id || 4913,
            address: address
        }
    )

    useEffect(() => {
        if (walletBalance !== undefined) {
            setBalance(walletBalance.value)
        }
    }, [setBalance, walletBalance])

    const SwitchNetwork = () => {
        return (
            <Flex alignItems={"center"} gap={2} >
                {
                    chain === undefined ?
                        <Flex alignItems={"center"} gap={2} >
                            <Text fontSize={'md'} fontWeight={'bold'} p={2} bgColor={"red.100"} borderRadius={"md"}>
                                Wrong Network
                            </Text>
                            <Button onClick={() => switchChain({ chainId: chains[chains.length - 1].id })}>
                                {`Switched to ${chains[chains.length - 1].name}`}
                            </Button>
                        </Flex>
                        :
                        <Image src={ChainLogo(chain.id.toString())} width={'40px'} height={'40px'} bgColor={"gray.100"} borderRadius={"md"} onClick={() => open()} cursor={"pointer"} />
                }
            </Flex>
        )
    }

    const ConnectButton = () => {
        return (
            status !== 'connected' ?
                <Button
                    colorScheme={'cyan'}
                    p={4}
                    fontSize={'md'}
                    h={'40px'}
                    onClick={() => open()}
                >
                    Connect
                </Button> :
                <Flex alignItems={"center"} gap={2} >
                    <SwitchNetwork />
                    <Text fontSize={'md'} fontWeight={'bold'} p={2} bgColor={"gray.100"} borderRadius={"md"} onClick={() => open()} cursor={"pointer"}>
                        {address?.substring(0, 6)}...{address?.substring(address.length - 4, address.length)}
                    </Text>
                    {
                        chain === undefined ? null :
                            <Text fontSize={'md'} fontWeight={'bold'} p={2} bgColor={"gray.100"} borderRadius={"md"} onClick={() => open()} cursor={"pointer"}>
                                {walletBalance === undefined ? "0" : parseETH(walletBalance.value) + " " + walletBalance.symbol}
                            </Text>
                    }
                </Flex>
        )
    }

    return (
        <Flex width={'100%'} height={'90px'} flexDirection={'column'} justifyContent={'center'}>
            <Flex as="header" align="center" justify="space-between" p={4} boxShadow={'md'}>
                <Flex align="flex-start" cursor="pointer" gap={'5px'}>
                    <Image src={ChainLogo("4913")} bgColor={"black"} width={'32px'} height={'32px'} />
                    <Text fontWeight={'light'} fontSize="xl">
                        OEV Playground
                    </Text>
                </Flex>
                <Spacer />
                <ConnectButton />
            </Flex>
        </Flex>
    );
};

export default Header;
