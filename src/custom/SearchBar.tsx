
import {
    VStack,
    Input,
    InputGroup,
    InputLeftElement,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

export const SearchBar = (props: any) => {
    const stateChanger = props.stateChanger;
    return (
        <VStack alignItems={"left"} width={"100%"} >
            <InputGroup size="md">
                <InputLeftElement
                    pointerEvents="none"
                    children={<Search2Icon color="gray.600" />}
                />
                <Input type="text" placeholder="Search..." bgColor={"white"}
                    onChange={(e) => stateChanger(e.target.value)}
                />
            </InputGroup>
        </VStack>
    );
};
