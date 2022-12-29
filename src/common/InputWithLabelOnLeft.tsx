import { CustomLinkWithoutId } from "../features/customLink/customLinkSchema";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  FormErrorMessage,
  Grid,
  GridItem,
  InputProps,
} from "@chakra-ui/react";
import React from "react";
import { useFormContext } from "react-hook-form";

interface Props extends InputProps {
  name: keyof CustomLinkWithoutId;
  label: string;
  helperText: string;
}
const InputWithLabelOnLeft = ({ name, label, helperText, ...props }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CustomLinkWithoutId>();
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
            {...register(name)}
            {...props}
          />
        </GridItem>
        <GridItem area="error">
          <FormErrorMessage>{errors[name]?.message}</FormErrorMessage>
        </GridItem>
      </Grid>
    </FormControl>
  );
};
export default React.memo(InputWithLabelOnLeft);
