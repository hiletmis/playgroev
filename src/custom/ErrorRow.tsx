import { Text, Box, VStack } from '@chakra-ui/react';
import { COLORS } from '../helpers/utils';

const ErrorRow = ({ header, text, margin = 0, bgColor = COLORS.caution }: any) => {
    return (
        text &&
        <VStack direction="row" align="left" width={"100%"} height={"auto"} m={margin}>
            <Text fontWeight={"bold"} fontSize={"md"}>{header}</Text>
            <Box p="2" width={"100%"} bgColor={bgColor} marginBottom={"5px"} alignItems={"center"}>
                <Text marginLeft={"2"} fontSize={"md"}>{text}</Text>
            </Box>
        </VStack>
    );
};

export default ErrorRow;