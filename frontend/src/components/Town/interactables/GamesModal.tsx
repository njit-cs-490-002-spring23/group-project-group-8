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

export default function GameSelectionModal() {
  console.log('New Modal Component');
}
