import { Text, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS } from '../helpers/utils';

const Hero = (props: any) => {
    const { header, text, bgColor = COLORS.app } = props;
    return (
        <VStack spacing={1} p={4} width={"100%"} bgColor={bgColor} marginBottom={"5px"} borderRadius={"10"} alignItems={"left"}>
            <Text fontWeight={"bold"} fontSize={"sm"}>{header}</Text>

            <Flex className='box'>
                <Text fontSize={"md"}>{text}</Text>
                <Spacer />
            </Flex>
        </VStack>
    );
};

export default Hero;