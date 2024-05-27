import { Text, Stack, Box, Image, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS } from '../helpers/utils';
import { SymbolLogo } from '@api3/logos';

const Hero = (props: any) => {
    const { dataFeed } = props;
    return (
        <VStack alignItems={"left"} >
            <Text fontWeight={"bold"} fontSize={"md"}>DApi</Text>
            <Box p="3" width={"100%"} height={"70px"} borderRadius={"10"} bgColor={COLORS.app} alignItems={"left"}>
                <Flex className='box'>
                    <Stack direction="column" spacing={"2"} width={"100%"}>
                        <Stack direction="row" spacing={"2"} >
                            <Stack visibility={!dataFeed ? "hidden" : "visible"} direction="row" spacing={"1"}>
                                <Image src={SymbolLogo(dataFeed.p1, true)} width={"24px"} height={"24px"} />
                                <Image src={SymbolLogo(dataFeed.p2, true)} fallbackSrc={`/coins/NA.webp`} width={"24px"} height={"24px"} />
                            </Stack>
                            <Text fontSize="md" fontWeight="bold">{dataFeed === null ? "" : dataFeed.p1 + '/' + dataFeed.p2}</Text>
                            <Spacer />
                        </Stack>
                        <Text width={"100%"} noOfLines={1} fontSize="xs">{dataFeed === null ? "" : dataFeed.beaconId}</Text>
                    </Stack>
                    <Spacer />

                </Flex>
            </Box>
        </VStack>
    );
};

export default Hero;


