import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import {
  subscribePhaserEvent,
  unsubscribePhaserEvent,
} from "@/gameMapSetup/events/gameEventCenter";

// Dynamically import the PhaserGame component with SSR disabled
const PhaserGameMap = dynamic(() => import("../components/GameMap"), {
  ssr: false,
  // You can add a loading component here if needed
});

function App() {
  // const { isOpen, onOpen, onClose } = useDisclosure();

  // function travelTrigger() {
  //   console.log("Travel confirmed");
  //   // Implement the travel logic here
  //   onClose(); // Close the modal after confirming the action
  // }

  useEffect(() => {
    const handleCustomEvent = (event: any) => {
      console.log("Received data:", event.detail);
    };

    subscribePhaserEvent("move", handleCustomEvent);

    return () => {
      unsubscribePhaserEvent("move", handleCustomEvent);
    };
  }, []);

  return (
    <div>
      <PhaserGameMap />

      {/* <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>U Sure u want to travel to ___</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel Travel
            </Button>
            <Button colorScheme="blue" onClick={travelTrigger}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </div>
  );
}

export default App;
