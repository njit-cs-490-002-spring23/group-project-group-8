import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  Container,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useInteractable } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';
import TestGame from './testgame/testGame';

export default function PaddlePartyModal(): JSX.Element {
  const newPaddlePartyGame = useInteractable('paddlePartyArea');
  const coveyTownController = useTownController();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (newPaddlePartyGame !== undefined) {
      setIsOpen(true);
    }
  }, [newPaddlePartyGame]);

  const toast = useToast();

  const onOpen = () => {
    toast({
      title: 'New Match Started!',
      status: 'success',
    });
  };

  const onClose = () => {
    if (newPaddlePartyGame) {
      coveyTownController.interactEnd(newPaddlePartyGame);
    }
    setIsOpen(false);
  };

  /**
   * TO-DO add const for paddle controls, score, end of match.
   */

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW='2xl'>
          <ModalHeader>Paddle Party</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Container maxW='7xl' h='700px'>
              <TestGame />
            </Container>
            <ModalFooter>Game Goes Here</ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
