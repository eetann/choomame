import type { AppDispatch } from "../../app/store";
import InputWithLabelOnLeft from "../../common/InputWithLabelOnLeft";
import {
  CustomLinkWithoutId,
  customLinkWithoutIdSchema,
} from "./customLinkSchema";
import { addOneCustomLink } from "./customLinkSlice";
import { Button, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const CustomLinkForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const methods = useForm<CustomLinkWithoutId>({
    resolver: zodResolver(customLinkWithoutIdSchema),
    mode: "all",
  });

  const onSubmit: SubmitHandler<CustomLinkWithoutId> = (data) => {
    dispatch(addOneCustomLink(data));

    // keep the input string
    methods.setValue("group", data.group);
    methods.setValue("match", data.match);

    // clear the input string
    methods.setValue("name", "");
    methods.setValue("url", "");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <VStack alignItems="start">
          <InputWithLabelOnLeft
            name="group"
            label="Group name"
            helperText="example: TypeScript"
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
            Add
          </Button>
        </VStack>
      </form>
    </FormProvider>
  );
};
export default CustomLinkForm;
