import type { AppDispatch } from "../../app/store";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  HStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const CustomLinkListForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <HStack>
        <FormControl>
          <FormLabel htmlFor="">list URL</FormLabel>
          <Input type="url" />
          <FormHelperText>Write URL for custom link list</FormHelperText>
        </FormControl>
        <Button
          isLoading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
            setIsLoading(false);
          }}
          colorScheme="teal"
        >
          Add
        </Button>
      </HStack>
    </>
  );
};
export default CustomLinkListForm;
