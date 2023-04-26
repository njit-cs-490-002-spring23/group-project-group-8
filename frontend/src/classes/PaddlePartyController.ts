import EventEmitter from 'events';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import TypedEmitter from 'typed-emitter';
import { PaddlePartyArea as PaddlePartyGameModel } from '../types/CoveyTownSocket';
import PlayerController from './PlayerController';

/**
 * Events to be emitted to players.
 *
 */

export type PaddlePartyEvents = {
  occupantsChange: (newOccupants: PlayerController[]) => void;
  viewersChange: (newViewers: PlayerController[]) => void;
  playerOneChange: (newPlayer: PlayerController) => void;
  playerTwoChange: (newPlayer: PlayerController) => void;
  paddleOneChange: (newPaddleOne: number[][]) => void;
  paddleTwoChange: (newPaddleTwo: number[][]) => void;
  gameInSessionChange: (newGameInSession: boolean) => void;
};

/**
 * PaddlePartyController manages the local behavior of the PaddlePartyGame area in the frontend,
 * implementing the logic to bridge between the townService's interpretation of the game areas and the
 * frontend's.  The PaddlePartyController emits events when the game area changes.
 */

export default class PaddlePartyController extends (EventEmitter as new () => TypedEmitter<PaddlePartyEvents>) {
  private _occupants: PlayerController[] = [];

  private _id: string;

  private _gameInSession: boolean;

  private _viewers: PlayerController[] = [];

  private _paddleOne: number[][];

  private _paddleTwo: number[][];

  private _playerOne?: PlayerController;

  private _playerTwo?: PlayerController;

  /**
   * Create a new PaddlePartyController.
   * @param id
   */
  constructor(id: string) {
    super();
    this._id = id;
    this._gameInSession = false;
    this._paddleOne = [];
    this._paddleTwo = [];
  }

  /**
   * The ID of this kart dash game area (read only)
   */

  get id() {
    return this._id;
  }

  /**
   * The list of game viewers in this kart dash area.  Changing the set of the occupants
   * will emit an viewersChange event.
   */

  set viewers(newViewers: PlayerController[]) {
    if (
      newViewers.length !== this._occupants.length ||
      _.xor(newViewers, this._viewers).length > 0
    ) {
      this.emit('viewersChange', newViewers);
      this._viewers = newViewers;
    }
  }

  get viewers() {
    return this._viewers;
  }

  /**
   * The list of occupants in this Kart Dash Area.  Changing the set of occupants
   * will emit an occupantsChange event
   */

  set occupants(newOccupants: PlayerController[]) {
    if (
      newOccupants.length !== this._occupants.length ||
      _.xor(newOccupants, this._occupants).length > 0
    ) {
      this.emit('occupantsChange', newOccupants);
      this._occupants = newOccupants;
    }
  }

  get occupants() {
    return this._occupants;
  }

  /**
   * PlayerOne getter.
   */
  get playerOne(): PlayerController | undefined {
    return this._playerOne;
  }

  /**
   * PlayerOne setter.
   */

  set playerOne(newPlayer: PlayerController | undefined) {
    this._playerOne = newPlayer;
  }

  /**
   * PlayerTwo getter.
   */
  get playerTwo(): PlayerController | undefined {
    return this._playerTwo;
  }

  /**
   * PlayerTwo setter.
   */

  set playerTwo(newPlayer: PlayerController | undefined) {
    this._playerTwo = newPlayer;
  }

  /**
   * PaddleOne getter.
   */
  get paddleOne() {
    return this._paddleOne;
  }

  /**
   * PaddleOne setter.
   */

  set paddleOne(newPaddleOne: number[][]) {
    this._paddleOne = newPaddleOne;
  }

  /**
   * PaddleTwo getter.
   */
  get paddleTwo() {
    return this._paddleTwo;
  }

  /**
   * PaddleTwo setter.
   */

  set paddleTwo(newPaddleTwo: number[][]) {
    this._paddleTwo = newPaddleTwo;
  }

  /**
   * Check if the game is in session.
   */

  get gameInSession() {
    return this._gameInSession;
  }

  set gameInSession(newGameInSession: boolean) {
    this._gameInSession = newGameInSession;
  }

  /**
   * A Paddle Party Area is empty if there are no occupants in it.
   */

  isEmpty() {
    return this._occupants.length === 0;
  }

  /**
   * Return a representation of this PaddlePartyController that matches the
   * townService's representation and is suitable for transmitting over the network.
   */

  toPaddlePartyArea(): PaddlePartyGameModel {
    return {
      id: this._id,
      occupantsByID: this.occupants.map(player => player.id),
      viewersByID: this._viewers.map(player => player.id),
      playerOne: this._playerOne?.id,
      playerTwo: this._playerTwo?.id,
      paddleOne: this._paddleOne,
      paddleTwo: this._paddleTwo,
      gameInSession: this._gameInSession,
    };
  }

  /**
   * Create a new PaddlePartyController to match a given PaddlePartyGameModel.
   * @param ppAreaModel Game Area to represent
   * @param playerFinder A function that will return a list of PlayerController's
   *  matching a list of Player ID's.
   */

  static fromPaddlePArtyGameModel(
    ppAreaModel: PaddlePartyGameModel,
    playerFinder: (playerIDs: string[]) => PlayerController[],
  ): PaddlePartyController {
    const ret = new PaddlePartyController(ppAreaModel.id);
    ret.occupants = playerFinder(ppAreaModel.occupantsByID);
    ret.viewers = playerFinder(ppAreaModel.viewersByID);
    ret.playerOne =
      ppAreaModel.playerOne === undefined ? undefined : playerFinder([ppAreaModel.playerOne]).pop();
    ret.playerTwo =
      ppAreaModel.playerTwo === undefined ? undefined : playerFinder([ppAreaModel.playerTwo]).pop();
    ret.paddleOne = ppAreaModel.paddleOne;
    ret.paddleTwo = ppAreaModel.paddleTwo;
    ret.gameInSession = ppAreaModel.gameInSession;
    return ret;
  }

  /**
   * Updates a new PaddlePArtyController to match a given PaddlePartyGameModel.
   * @param ppAreaModel Game Area to represent
   * @param playerFinder A function that will return a list of PlayerController's
   *  matching a list of Player ID's.
   */

  updateFromPaddlePartyGameModel(
    ppAreaModel: PaddlePartyGameModel,
    playerFinder: (playerIDs: string[]) => PlayerController[],
  ) {
    this.occupants = playerFinder(ppAreaModel.occupantsByID);
    this.viewers = playerFinder(ppAreaModel.viewersByID);
    this.playerOne =
      ppAreaModel.playerOne === undefined ? undefined : playerFinder([ppAreaModel.playerOne]).pop();
    this.playerTwo =
      ppAreaModel.playerTwo === undefined ? undefined : playerFinder([ppAreaModel.playerTwo]).pop();
    this.paddleOne = ppAreaModel.paddleOne;
    this.paddleTwo = ppAreaModel.paddleTwo;
    this.gameInSession = ppAreaModel.gameInSession;
  }
}

/**
 * A react hook to retrieve the occupants of a KartDashController, returning an array of PlayerController.
 *
 * This hook will re-render any components that use it when the set of occupants changes.
 */
export function usePaddlePartyOccupants(area: PaddlePartyController): PlayerController[] {
  const [occupants, setOccupants] = useState(area.occupants);
  useEffect(() => {
    area.addListener('occupantsChange', setOccupants);
    return () => {
      area.removeListener('occupantsChange', setOccupants);
    };
  }, [area]);
  return occupants;
}

/**
 * A react hook to retrieve the viewers of a PaddlePArtyController, returning an array of PlayerController.
 *
 * This hook will re-render any components that use it when the set of viewers changes.
 */
export function usePaddlePartyViewers(area: PaddlePartyController): PlayerController[] {
  const [viewers, setViewers] = useState(area.viewers);
  useEffect(() => {
    area.addListener('viewersChange', setViewers);
    return () => {
      area.removeListener('viewersChange', setViewers);
    };
  }, [area]);
  return viewers;
}

/**
 * A react hook to retrieve playerOne of a PaddlePartyController, returning playerOne.
 * If the game is not in session or playerOne has exited the game, it will return empty.
 *
 * This hook will re-render any components that use it when the set of viewers changes.
 */
export function usePaddlePartyPlayerOne(area: PaddlePartyController): PlayerController | undefined {
  const [playerOne, setPlayerOne] = useState(area.playerOne);
  useEffect(() => {
    area.addListener('playerOneChange', setPlayerOne);
    return () => {
      area.removeListener('playerOneChange', setPlayerOne);
    };
  }, [area]);
  return playerOne;
}

/**
 * A react hook to retrieve playerTwo of a PaddlePartyController, returning playerTwo.
 * If the game is not in session or playerTwo has exited the game, it will return empty.
 *
 * This hook will re-render any components that use it when the set of viewers changes.
 */
export function usePaddlePartyPlayerTwo(area: PaddlePartyController): PlayerController | undefined {
  const [playerTwo, setPlayerTwo] = useState(area.playerTwo);
  useEffect(() => {
    area.addListener('playerTwoChange', setPlayerTwo);
    return () => {
      area.removeListener('playerTwoChange', setPlayerTwo);
    };
  }, [area]);
  return playerTwo;
}

/**
 * A react hook to retrieve the paddleOne of a PaddlePartyController.
 *
 * This hook will re-render any components that use it when the paddleOne changes.
 */
export function usePaddlePartyPaddleOne(area: PaddlePartyController): number[][] {
  const [paddleOne, setPaddleOne] = useState(area.paddleOne);
  useEffect(() => {
    area.addListener('paddleOneChange', setPaddleOne);
    return () => {
      area.removeListener('paddleOneChange', setPaddleOne);
    };
  }, [area]);
  return paddleOne;
}

/**
 * A react hook to retrieve the paddleTwo of a PaddlePartyController.
 *
 * This hook will re-render any components that use it when the trackTwo changes.
 */
export function usePaddlePartyPaddleTwo(area: PaddlePartyController): number[][] {
  const [paddleTwo, setPaddleTwo] = useState(area.paddleTwo);
  useEffect(() => {
    area.addListener('paddleTwoChange', setPaddleTwo);
    return () => {
      area.removeListener('paddleTwoChange', setPaddleTwo);
    };
  }, [area]);
  return paddleTwo;
}

/**
 * A react hook to retrieve the gameInSession of a PaddlePartyController.
 *
 * This hook will re-render any components that use it when the gameInSession changes.
 */
export function useGameInSession(area: PaddlePartyController): boolean {
  const [gameInSession, setGameInSession] = useState(area.gameInSession);
  useEffect(() => {
    area.addListener('gameInSessionChange', setGameInSession);
    return () => {
      area.removeListener('gameInSessionChange', setGameInSession);
    };
  }, [area]);
  return gameInSession;
}
