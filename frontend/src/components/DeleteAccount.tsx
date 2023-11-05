import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import userService from "../service/userService";
import { useDisclosure } from "@chakra-ui/react";
import React from "react";
import { useCookies } from "react-cookie";

export default function AlertDelete(props: any) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [, , removeCookies] = useCookies();

  return (
    <>
      <AlertDialog
        isOpen={props.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={props.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={props.onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  userService.deleteUserInfo();
                  removeCookies("token");
                  window.location.href = "/";
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
