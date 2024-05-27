import { Image, Text, Box, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS, copy } from '../helpers/utils';

const Hero = (props: any) => {
    const { header, text, margin = 0, copyEnabled = true, bgColor = COLORS.main } = props;
    return (
        <VStack direction="row" align="left" m={margin}>
            <Text fontWeight={"bold"} fontSize={"md"}>{header}</Text>
            <Box p="2" width={"100%"} bgColor={bgColor} borderRadius={"10"} alignItems={"center"}>
                <Flex className='box'>
                    <Text noOfLines={1} fontSize={"md"}>{text}</Text>
                    <Spacer />
                    {
                        !copyEnabled ? null : <Image marginLeft={"3"} cursor={"pointer"} onClick={() => copy(text)} src={`/copy.svg`} width={"24px"} height={"24px"} />
                    }

                </Flex>
            </Box>
        </VStack>
    );
};

export default Hero;