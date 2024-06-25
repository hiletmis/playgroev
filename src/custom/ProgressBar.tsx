import { Text, Flex, Spacer, VStack, Box } from '@chakra-ui/react';
import { COLORS } from '../helpers/utils';

const ProgressBar = (props: any) => {
    const { descriptions, step } = props;
    const steps = descriptions.length - 1;
    return (
        <VStack width={"100%"} alignItems={"left"}>
            <Text fontSize={"lg"} fontWeight={"bold"}>Progress</Text>
            <VStack bgColor={steps === step ? "green.100" : COLORS.app} spacing={5} p={4} alignItems={"left"}>
                <Flex gap={3} width={"100%"} justifyContent={"center"} alignItems={"center"}>
                    <Text fontSize={"md"} fontWeight={"bold"}>{descriptions[step]}</Text>
                    <Spacer />
                    {
                        descriptions.map((description: string, index: number) => {
                            return (
                                <Box key={index} bgColor={step >= index ? "green.400" : "gray.300"} borderRadius={"10px"} width={"20px"} height={"10px"} ></Box>
                            );
                        })
                    }
                </Flex>
            </VStack>
        </VStack>
    );
};

export default ProgressBar;


