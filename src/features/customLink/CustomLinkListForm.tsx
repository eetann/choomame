import type { AppDispatch, RootState } from "../../app/store";
import { addOneCustomLinkList } from "./customLinkListSlice";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
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
    <VStack alignItems="start">
      <FormControl isInvalid={isError}>
        <FormLabel htmlFor="customLinkListURL">new List</FormLabel>
        <FormHelperText>
          Write URL. Example:
          https://raw.githubusercontent.com/eetann/choomame-custom-link-list/main/src/eetann.json5
        </FormHelperText>
        <Input
          id="customLinkListURL"
          type="url"
          value={listUrl}
          onChange={(e) => setListUrl(e.target.value)}
        />
        <FormErrorMessage>{customLinkListErrorMessage}</FormErrorMessage>
      </FormControl>
      <Button
        isLoading={isLoading}
        onClick={async () => {
          setIsLoading(true);
          try {
            await dispatch(addOneCustomLinkList(listUrl)).unwrap();
            setListUrl("");
          } catch (e) {
            // error
          }
          setIsLoading(false);
        }}
        colorScheme="teal"
      >
        Add
      </Button>
    </VStack>
  );
};
export default CustomLinkListForm;
