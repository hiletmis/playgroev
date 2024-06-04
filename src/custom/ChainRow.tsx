import { Text, Stack, Box, Image, Flex, Spacer, VStack } from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { COLORS } from '../helpers/utils';
import { ChainLogo } from '@api3/logos';

const ChainRow = (props: any) => {
    const isHeader = props.isHeader || false;
    const isOpen = props.isOpen || false;

    return (
        <VStack width={"100%"} alignItems={"left"} cursor={"pointer"} onClick={isHeader ? props.onClick : () => { props.setSelectedChain(props.selectedChain) }}>
            <Box p="3" width={"100%"} height={"70px"} bgColor={isOpen ? COLORS.selectDarker : isHeader ? COLORS.app : COLORS.main} alignItems={"left"}>
                <Flex className='box' alignItems={"center"}>
                    <Stack direction="column" spacing={"2"} width={"100%"}>
                        <Stack direction="row" spacing={"2"} >
                            <Image src={ChainLogo(props.selectedChain.id, true)} width={"24px"} height={"24px"} />
                            <Text fontSize="md" fontWeight="bold">{props.selectedChain.name}</Text>
                        </Stack>
                        <Text width={"100%"} noOfLines={1} fontSize="xs">{props.selectedChain.id}</Text>
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

export default ChainRow;


