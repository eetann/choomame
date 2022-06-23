import type { AppDispatch } from "../../app/store";
import { initLanguages } from "./languagesSlice";
import { Icon } from "@chakra-ui/icons";
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
import { HiExclamation } from "react-icons/hi";
import { useDispatch } from "react-redux";

const LanguagesReset: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Box>
      <Button
        leftIcon={<HiExclamation fontSize="24" />}
        colorScheme="red"
        onClick={onOpen}
      >
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
            <AlertDialogHeader fontSize="3xl">
              Reset Languages?
            </AlertDialogHeader>
            <AlertDialogBody fontSize="lg">
              If you reset Languages, the Languages you added will disappear.
              <br />
              Do you really want to reset?
              <Center my="5" rounded="xl" backgroundColor="black">
                <Icon as={HiExclamation} boxSize="2xs" color="yellow" />
              </Center>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack>
                <Button ref={cancelRef} onClick={onClose}>
                  Not reset.
                </Button>
                <Button
                  leftIcon={<HiExclamation fontSize="24" />}
                  colorScheme="red"
                  onClick={() => {
                    dispatch(initLanguages());
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
export default LanguagesReset;
