import { Text, Stack, Box, Image, Flex, Spacer, VStack } from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { COLORS } from '../helpers/utils';
import { SymbolLogo } from '@api3/logos';

const Hero = (props: any) => {
    const dApiName = props.dApi.name;
    const isHeader = props.isHeader || false;
    const isOpen = props.isOpen || false;
    const symbols = dApiName.split('/');

    return (
        <VStack width={"100%"} alignItems={"left"} cursor={"pointer"} onClick={isHeader ? props.onClick : () => { props.setDapi(props.dApi) }}>
            <Box p="3" width={"100%"} height={"70px"} bgColor={props.bgColor ? props.bgColor : isOpen ? COLORS.selectDarker : isHeader ? COLORS.app : COLORS.main} alignItems={"left"}>
                <Flex className='box' alignItems={"center"}>
                    <Stack direction="column" spacing={"2"} width={"100%"}>
                        <Stack direction="row" spacing={"2"} >
                            <Stack direction="row" spacing={"1"}>
                                <Image src={SymbolLogo(symbols[0], true)} width={"24px"} height={"24px"} />
                                <Image src={SymbolLogo(symbols[1], true)} width={"24px"} height={"24px"} />
                            </Stack>
                            <Text fontSize="md" fontWeight="bold">{dApiName}</Text>
                            <Spacer />
                        </Stack>
                        <Text width={"100%"} noOfLines={1} fontSize="xs">{props.dApi.metadata.category}</Text>
                    </Stack>
                    <Spacer />
                    {
                        isHeader && (isOpen ? <TriangleUpIcon w={6} h={6} /> : <TriangleDownIcon w={6} h={6} />)
                    }

                </Flex>
            </Box>
        </VStack>
    );
};

export default Hero;


