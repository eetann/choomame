import type { AppDispatch, RootState } from "../../app/store";
import { addOneCustomLinkList } from "./customLinkListSlice";
import {
  FormControl,
  FormHelperText,
  Button,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  useDisclosure,
  Input,
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CustomLinkListForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customLinkListErrorMessage = useSelector(
    (state: RootState) => state.customLinkList.errorMessage
  );
  const [isLoading, setIsLoading] = useState(false);
  const [listUrl, setListUrl] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const isError = customLinkListErrorMessage !== "";

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      closeOnBlur={false} // for continuous input
      placement="left-end"
      initialFocusRef={firstFieldRef}
    >
      <PopoverTrigger>
        <Button
          colorScheme="teal"
          onClick={onOpen}
          data-testid="open-popover-for-new-list"
        >
          Add
        </Button>
      </PopoverTrigger>
      <PopoverContent width="xl">
        <PopoverArrow />
        <PopoverHeader fontSize="sm">new List</PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>
          <VStack alignItems="start">
            <FormControl isInvalid={isError}>
              <FormHelperText>
                Write URL. Example:
                https://raw.githubusercontent.com/eetann/choomame-custom-link-list/main/src/eetann.json5
              </FormHelperText>
              <Input
                id="customLinkListURL"
                type="url"
                value={listUrl}
                onChange={(e) => setListUrl(e.target.value)}
                ref={firstFieldRef}
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
              Save
            </Button>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
export default CustomLinkListForm;
