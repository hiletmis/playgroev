import { Text, Stack, Box, Image, Flex, Spacer, VStack } from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { COLORS } from '../helpers/utils';
import { SymbolLogo } from '@api3/logos';
import { ColorRing } from 'react-loader-spinner';

const DApiRow = (props: any) => {

    const placeholder = {
        name: "Select a dApi",
        metadata: {
            category: ""
        }
    }

    const getDapi = () => {
        return props.dApi === null ? placeholder : props.dApi;
    }

    const dApiName = getDapi().name;
    const category = getDapi().metadata.category;
    const isHeader = props.isHeader || false;
    const isOpen = props.isOpen || false;
    const isLoading = props.isLoading || false;
    const symbols = dApiName.split('/');

    return (
        <VStack width={"100%"} alignItems={"left"} cursor={"pointer"} onClick={isHeader ? props.onClick : () => { props.setDapi(props.dApi) }}>
            <Box p="3" width={"100%"} height={"70px"} bgColor={props.bgColor ? props.bgColor : isOpen ? COLORS.selectDarker : isHeader ? COLORS.app : COLORS.main} alignItems={"left"}>
                <Flex className='box' alignItems={"center"} gap={5}>
                    <Stack direction="column" spacing={"2"} width={"100%"}>
                        <Stack direction="row" spacing={"2"} >
                            {
                                category === "" ? null :
                                    <Stack direction="row" spacing={"1"}>
                                        <Image src={SymbolLogo(symbols[0], true)} width={"24px"} height={"24px"} />
                                        <Image src={SymbolLogo(symbols[1], true)} width={"24px"} height={"24px"} />
                                    </Stack>
                            }
                            <Text fontSize="md" fontWeight="bold">{dApiName}</Text>
                            <Spacer />
                        </Stack>
                        <Text width={"100%"} noOfLines={1} fontSize="xs">{category}</Text>
                    </Stack>
                    <Spacer />
                    {
                        isLoading ? <ColorRing height="50px" width="50px" ariaLabel="loading" visible={isLoading} />
                            : isHeader && (isOpen ? <TriangleUpIcon w={6} h={6} /> : <TriangleDownIcon w={6} h={6} />)
                    }

                </Flex>
            </Box>
        </VStack>
    );
};

export default DApiRow;


