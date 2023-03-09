import { CustomLinkItemWithoutId } from "../features/customLink/customLinkSchema";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  FormErrorMessage,
  Grid,
  GridItem,
  InputProps,
  useMergeRefs,
} from "@chakra-ui/react";
import React, { Ref } from "react";
import { useFormContext } from "react-hook-form";

interface Props extends InputProps {
  name: keyof CustomLinkItemWithoutId;
  label: string;
  helperText: string;
  ref?: Ref<HTMLInputElement>;
}
const InputWithLabelOnLeft = React.forwardRef(function useBase(
  { name, label, helperText, ...props }: Omit<Props, "ref">,
  ref
) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CustomLinkItemWithoutId>();
  const inputValue = register(name);
  const inputRef = useMergeRefs(inputValue.ref, ref);
  return (
    <FormControl isInvalid={Boolean(errors[name])}>
      <Grid
        templateAreas={`". helper"
                            "label input"
                            ". error"`}
        gridTemplateRows="0.5fr 1fr 0.5fr"
        gridTemplateColumns="128px 1fr"
        gap="1"
      >
        <GridItem area="label" alignSelf="center">
          <FormLabel htmlFor={`${name}Input`} my="0">
            {label}
          </FormLabel>
        </GridItem>
        <GridItem area="helper">
          <FormHelperText>{helperText}</FormHelperText>
        </GridItem>
        <GridItem area="input">
          <Input
            id={`${name}Input`}
            type="text"
            name={inputValue.name}
            onChange={inputValue.onChange}
            onBlur={inputValue.onBlur}
            ref={inputRef}
            {...props}
          />
        </GridItem>
        <GridItem area="error">
          <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
        </GridItem>
      </Grid>
    </FormControl>
  );
});
export default React.memo(InputWithLabelOnLeft);
