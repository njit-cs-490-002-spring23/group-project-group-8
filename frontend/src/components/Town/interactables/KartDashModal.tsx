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
import { Canvas } from '@react-three/fiber';
import React, { useEffect, useState } from 'react';
import { useInteractable } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';
import PlayersInGameList from './gameStats/gamePlayerList';
import { Scene } from './kartdash/src/Scene';

export default function KartDashModal(): JSX.Element {
  const newKartDashGame = useInteractable('kartDashArea');
  const coveyTownController = useTownController();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (newKartDashGame !== undefined) {
      setIsOpen(true);
    }
  }, [newKartDashGame]);

  const toast = useToast();

  const onOpen = () => {
    toast({
      title: 'Kart Dash Started!',
      status: 'success',
    });
  };

  const onClose = () => {
    if (newKartDashGame) {
      coveyTownController.interactEnd(newKartDashGame);
    }
    setIsOpen(false);
  };

  /**
   * TO-DO add const for kart controls, score, finish line.
   */

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW='7xl' h='800px'>
          <ModalHeader>Kart Dash</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Container maxW='7xl' h='650px'>
              <Canvas>
                <Scene />
              </Canvas>
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
