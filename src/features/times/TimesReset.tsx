import type { AppDispatch } from "../../app/store";
import { initTimes } from "./timesSlice";
import { WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  HStack,
  Center,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";

const TimesReset: React.VFC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Box>
      <Button leftIcon={<WarningTwoIcon />} colorScheme="red" onClick={onOpen}>
        Reset
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        size="lg"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="3xl">Reset Time?</AlertDialogHeader>
            <AlertDialogBody fontSize="lg">
              If you reset Time, the Time you added will disappear.
              <br />
              Do you really want to reset?
              <Center>
                <WarningTwoIcon boxSize="xs" color="red" />
              </Center>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack>
                <Button ref={cancelRef} onClick={onClose}>
                  Not reset.
                </Button>
                <Button
                  leftIcon={<WarningTwoIcon />}
                  colorScheme="red"
                  onClick={() => {
                    dispatch(initTimes());
                    onClose();
                  }}
                >
                  Yes, reset.
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
export default TimesReset;
