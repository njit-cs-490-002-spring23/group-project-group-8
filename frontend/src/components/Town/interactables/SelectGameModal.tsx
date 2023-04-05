import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useArcadeAreaController } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';
import { ArcadeArea as ArcadeAreaModel } from '../../../types/CoveyTownSocket';
import ArcadeArea from './ArcadeArea';

export default function SelectGameModal({
  isOpen,
  close,
  arcadeArea,
}: {
  isOpen: boolean;
  close: () => void;
  arcadeArea: ArcadeArea;
}): JSX.Element {
  const coveyTownController = useTownController();
  const arcadeAreaController = useArcadeAreaController(arcadeArea?.name);

  const [game, setGame] = useState<string>(arcadeArea?.game || '');

  useEffect(() => {
    if (isOpen) {
      coveyTownController.pause();
    } else {
      coveyTownController.unPause();
    }
  }, [coveyTownController, isOpen]);

  const closeModal = useCallback(() => {
    coveyTownController.unPause();
    close();
  }, [coveyTownController, close]);

  const toast = useToast();

  const createArcadeArea = useCallback(async () => {
    if (game && arcadeAreaController) {
      const request: ArcadeAreaModel = {
        name: arcadeAreaController.name,
        id: arcadeAreaController.id,
        game: arcadeAreaController.game,
        isPlaying: true,
        elapsedTimeSec: 0,
        score: 0,
        defaultGameURL: arcadeAreaController.defaultGameURL,
      };
      try {
        await coveyTownController.createArcadeArea(request);
        toast({
          title: 'Game set!',
          status: 'success',
        });
        coveyTownController.unPause();
      } catch (err) {
        if (err instanceof Error) {
          toast({
            title: 'Unable to set game URL',
            description: err.toString(),
            status: 'error',
          });
        } else {
          console.trace(err);
          toast({
            title: 'Unexpected Error',
            status: 'error',
          });
        }
      }
    }
  }, [game, coveyTownController, arcadeAreaController, toast]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        closeModal();
        coveyTownController.unPause();
      }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pick a game to play in {arcadeAreaController?.id} </ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={ev => {
            ev.preventDefault();
            createArcadeArea();
          }}>
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel htmlFor='game'>Game URL</FormLabel>
              <Input id='game' name='game' value={game} onChange={e => setGame(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={createArcadeArea}>
              Set game
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
