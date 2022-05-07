import type { AppDispatch } from "../../app/store";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";

const TimesReset: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Box>
      <Button leftIcon={<WarningTwoIcon />} colorScheme="red">
        Reset
      </Button>
    </Box>
  );
};
export default TimesReset;
