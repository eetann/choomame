import type { AppDispatch, RootState } from "../../app/store";
import { addOneCustomLinkCollection } from "./customLinkCollectionSlice";
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

const CustomLinkCollectionForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customLinkCollectionErrorMessage = useSelector(
    (state: RootState) => state.customLinkCollection.errorMessage
  );
  const [isLoading, setIsLoading] = useState(false);
  const [collectionUrl, setCollectionUrl] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialFocusRef = useRef<HTMLInputElement>(null);

  const isError = customLinkCollectionErrorMessage !== "";

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      closeOnBlur={false} // for continuous input
      placement="left-end"
      initialFocusRef={initialFocusRef}
    >
      <PopoverTrigger>
        <Button
          colorScheme="teal"
          onClick={onOpen}
          data-testid="open-popover-for-new-collection"
        >
          Add
        </Button>
      </PopoverTrigger>
      <PopoverContent width="xl">
        <PopoverArrow />
        <PopoverHeader fontSize="sm">new Collection</PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>
          <VStack alignItems="start">
            <FormControl isInvalid={isError}>
              <FormHelperText>
                Write URL. Example:
                https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/eetann.json5
              </FormHelperText>
              <Input
                id="customLinkCollectionURL"
                type="url"
                value={collectionUrl}
                onChange={(e) => setCollectionUrl(e.target.value)}
                ref={initialFocusRef}
              />
              <FormErrorMessage>
                {customLinkCollectionErrorMessage}
              </FormErrorMessage>
            </FormControl>
            <Button
              isLoading={isLoading}
              onClick={async () => {
                setIsLoading(true);
                try {
                  await dispatch(
                    addOneCustomLinkCollection(collectionUrl)
                  ).unwrap();
                  setCollectionUrl("");
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
export default CustomLinkCollectionForm;
