import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import TextField from "../TextField";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import socket from "../../socket";
import { useCallback, useContext, useState } from "react";
import { FriendContext } from "./Home";

function AddFriendModal({ isOpen, onClose }) {
  const friendSchema = Yup.object({
    friendName: Yup.string()
      .required("Username is required")
      .min(6, "Invalid username")
      .max(28, "Invalid username"),
  });
  const [error, setError] = useState("");
  const closeModal = useCallback(() => {
    setError("");
    onClose();
  }, [onClose]);
  const { setFriendList } = useContext(FriendContext);
  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay></ModalOverlay>
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Add Friend</ModalHeader>
        <Formik
          initialValues={{ friendName: "" }}
          onSubmit={(values) => {
            socket.emit(
              "add_friend",
              values.friendName,
              ({ errorMsg, done, newFriend }) => {
                if (done) {
                  setFriendList((prevFriendList) => [
                    newFriend,
                    ...prevFriendList,
                  ]);
                  closeModal();
                  return;
                } else {
                  setError(errorMsg);
                }
              }
            );
          }}
          validationSchema={friendSchema}
        >
          <Form>
            <ModalBody>
              <Heading as="p" color="red.500" textAlign="center" fontSize="md">
                {error}
              </Heading>
              <TextField
                label="Friend's name"
                placeholder="Enter Friend's name"
                autoComplete="off"
                name="friendName"
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  );
}

export default AddFriendModal;
