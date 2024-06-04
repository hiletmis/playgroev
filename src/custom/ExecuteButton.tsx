import { Button, VStack } from '@chakra-ui/react';

const ExecuteButton = (props: any) => {
    const { text, height = "50px", minWidth = "200px", isDisabled, onClick } = props;

    return (
        <VStack spacing={4} w="100%">
            <Button
                borderColor="gray.500"
                borderWidth="1px"
                color="black"
                size="md"
                height={height}
                minWidth={minWidth}
                isDisabled={isDisabled}
                onClick={() => { onClick() }}
            >
                {text}
            </Button>
        </VStack>
    );
};

export default ExecuteButton;