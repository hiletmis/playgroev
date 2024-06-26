import { Image, Text, Box, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS, copy } from '../helpers/utils';

const CopyInfoRow = (props: any) => {
    const { header, text, margin = 0, copyEnabled = true, refreshData = false, bgColor = COLORS.main } = props;
    return (
        <VStack direction="row" align="left" m={margin} width={"100%"}>
            <Text fontWeight={"bold"} fontSize={"md"}>{header}</Text>
            <Box p="2" width={"100%"} bgColor={bgColor} alignItems={"center"}>
                <Flex className='box'>
                    <Text noOfLines={1} fontSize={"md"}>{text}</Text>
                    <Spacer />
                    {
                        !copyEnabled ? null : <Image marginLeft={"3"} cursor={"pointer"} onClick={() => copy(text)} src={`./copy.svg`} width={"24px"} height={"24px"} />
                    }
                    {
                        !refreshData ? null : <Image marginLeft={"3"} cursor={"pointer"} onClick={() => props.refreshData()} src={`./refresh.svg`} width={"24px"} height={"24px"} />
                    }

                </Flex>
            </Box>
        </VStack>
    );
};

export default CopyInfoRow;