import type { AppDispatch } from "../../app/store";
import InputWithLabelOnLeft from "../../common/InputWithLabelOnLeft";
import { addOneCustomLinkItem } from "./customLinkItemSlice";
import {
  CustomLinkItemWithoutId,
  customLinkItemWithoutIdSchema,
} from "./customLinkSchema";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const CustomLinkItemForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const methods = useForm<CustomLinkItemWithoutId>({
    resolver: zodResolver(customLinkItemWithoutIdSchema),
    mode: "all",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialFocusRef = useRef<HTMLInputElement>(null);

  const onSubmit: SubmitHandler<CustomLinkItemWithoutId> = (data) => {
    dispatch(addOneCustomLinkItem(data));

    // keep the input string
    methods.setValue("group", data.group);
    methods.setValue("match", data.match);

    // clear the input string
    methods.setValue("name", "");
    methods.setValue("url", "");
  };

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      closeOnBlur={false} // for continuous input
      initialFocusRef={initialFocusRef}
      placement="left-end"
    >
      <PopoverTrigger>
        <Button
          colorScheme="teal"
          onClick={onOpen}
          data-testid="open-popover-for-new-item"
        >
          Add
        </Button>
      </PopoverTrigger>
      <PopoverContent width="xl">
        <PopoverArrow />
        <PopoverHeader fontSize="sm">new Custom Link item</PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <VStack alignItems="start">
                <InputWithLabelOnLeft
                  name="group"
                  label="Group name"
                  helperText="example: TypeScript"
                  ref={initialFocusRef}
                />
                <InputWithLabelOnLeft
                  name="match"
                  label="Match"
                  helperText="example: ts|typescript"
                />
                <InputWithLabelOnLeft
                  name="name"
                  label="Link name"
                  helperText="example: Homepage"
                />
                <InputWithLabelOnLeft
                  name="url"
                  label="URL"
                  helperText="example: https://www.typescriptlang.org"
                />
                <Button
                  colorScheme="teal"
                  type="submit"
                  disabled={!methods.formState.isValid}
                  isLoading={methods.formState.isSubmitting}
                >
                  Save
                </Button>
              </VStack>
            </form>
          </FormProvider>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
export default CustomLinkItemForm;
