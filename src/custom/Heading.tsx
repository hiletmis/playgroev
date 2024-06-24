import { Text, Heading, Flex, Spacer, VStack, Image } from '@chakra-ui/react';
import { ColorRing } from 'react-loader-spinner';

const CustomHeading = (props: any) => {
    const { header, description, isLoading } = props;
    return (
        <VStack maxW={"700px"} borderWidth="px" flex="1" alignItems={"left"}>
            <Flex alignItems={"center"}>
                <Heading size={"lg"}>{header}</Heading>
                <Spacer />
                <ColorRing height="30px" width="30px" ariaLabel="loading" visible={isLoading} />
                <Image src={'./help.svg'} width={"30px"} height={"30px"} cursor={"pointer"} />
            </Flex>
            <Text fontSize={"sm"}>{description}</Text>
        </VStack>
    );
};

export default CustomHeading;


