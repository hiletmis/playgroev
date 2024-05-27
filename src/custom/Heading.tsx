import { Text, Heading, Flex, Spacer, VStack } from '@chakra-ui/react';
import { ColorRing } from 'react-loader-spinner';

const Hero = (props: any) => {
    const { header, description, isLoading } = props;
    return (
        <VStack alignItems={"left"} >
            <Flex>
                <Heading size={"lg"}>{header}</Heading>
                <Spacer />
                <ColorRing height="30px" width="30px" ariaLabel="loading" visible={isLoading} />
            </Flex>
            <Text fontSize={"sm"}>{description}</Text>
        </VStack>
    );
};

export default Hero;


