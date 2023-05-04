import {
  Container,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useInteractable } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';
import TestGame from './testgame/testGame';
import PlayersInGameList from './testgame/testGamePlayerList';

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
            <ModalFooter>
              <PlayersInGameList />
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
