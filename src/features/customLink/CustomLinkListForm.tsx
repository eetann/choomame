import type { AppDispatch, RootState } from "../../app/store";
import { addOneCustomLinkList } from "./customLinkListSlice";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  HStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CustomLinkListForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customLinkListErrorMessage = useSelector(
    (state: RootState) => state.customLinkList.errorMessage
  );
  const [isLoading, setIsLoading] = useState(false);
  const [listUrl, setListUrl] = useState("");

  const isError = customLinkListErrorMessage !== "";

  return (
    <HStack>
      <FormControl isInvalid={isError}>
        <FormLabel htmlFor="customLinkListURL">list URL</FormLabel>
        <Input
          id="customLinkListURL"
          type="url"
          value={listUrl}
          onChange={(e) => setListUrl(e.target.value)}
        />
        <FormHelperText>Write URL for custom link list</FormHelperText>
        <FormErrorMessage>{customLinkListErrorMessage}</FormErrorMessage>
      </FormControl>
      <Button
        isLoading={isLoading}
        onClick={async () => {
          setIsLoading(true);
          await dispatch(addOneCustomLinkList(listUrl));
          await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
          setIsLoading(false);
        }}
        colorScheme="teal"
      >
        Add
      </Button>
    </HStack>
  );
};
export default CustomLinkListForm;
