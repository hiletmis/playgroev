import { Text, Flex, Spacer, VStack } from '@chakra-ui/react';
import { COLORS } from '../helpers/utils';
import { ViewIcon } from '@chakra-ui/icons';

const InfoRow = (props: any) => {
    const { header, text, link, bgColor = COLORS.app } = props;
    return (
        <VStack spacing={1} p={4} width={"100%"} bgColor={bgColor} marginBottom={"5px"} borderRadius={"10"} alignItems={"left"}>
            <Text fontWeight={"bold"} fontSize={"sm"}>{header}</Text>

            <Flex className='box'>
                <Text fontSize={"sm"}>{text}</Text>
                <Spacer />
                {
                    link &&
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        <ViewIcon w={6} h={6} />
                    </a>
                }

            </Flex>
        </VStack>
    );
};

export default InfoRow;