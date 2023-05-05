import EventEmitter from 'events';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import TypedEmitter from 'typed-emitter';
import { KartDashArea as KartDashGameModel } from '../types/CoveyTownSocket';
import PlayerController from './PlayerController';

/**
 * Events to be emitted to players.
 *
 */

export type KartDashEvents = {
  occupantsChange: (newOccupants: PlayerController[]) => void;
  viewersChange: (newViewers: PlayerController[]) => void;
  playerOneChange: (newPlayer: PlayerController) => void;
  playerTwoChange: (newPlayer: PlayerController) => void;
  trackOneChange: (newTrackOne: number[][]) => void;
  trackTwoChange: (newTrackTwo: number[][]) => void;
  gameInSessionChange: (newGameInSession: boolean) => void;
};

/**
 * KartDashController manages the local behavior of the KartDashGame area in the frontend,
 * implementing the logic to bridge between the townService's interpretation of the game areas and the
 * frontend's.  The KartDashController emits events when the game area changes.
 */

export default class KartDashController extends (EventEmitter as new () => TypedEmitter<KartDashEvents>) {
  private _occupants: PlayerController[] = [];

  private _id: string;

  private _gameInSession: boolean;

  private _viewers: PlayerController[] = [];

  private _trackOne: number[][];

  private _trackTwo: number[][];

  private _playerOne?: PlayerController;

  private _playerTwo?: PlayerController;

  /**
   * Create a new KartDashController.
   * @param id
   */
  constructor(id: string) {
    super();
    this._id = id;
    this._gameInSession = false;
    this._trackOne = [];
    this._trackTwo = [];
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
   * TrackOne getter.
   */
  get trackOne() {
    return this._trackOne;
  }

  /**
   * TrackOne setter.
   */

  set trackOne(newTrackOne: number[][]) {
    this._trackOne = newTrackOne;
  }

  /**
   * TrackTwo getter.
   */
  get trackTwo() {
    return this._trackTwo;
  }

  /**
   * TrackTwo setter.
   */

  set trackTwo(newTrackTwo: number[][]) {
    this._trackTwo = newTrackTwo;
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
   * A Kart Dash Area is empty if there are no occupants in it.
   */

  isEmpty() {
    return this._occupants.length === 0;
  }

  /**
   * Return a representation of this KartDashController that matches the
   * townService's representation and is suitable for transmitting over the network.
   */

  toKartDashArea(): KartDashGameModel {
    return {
      id: this._id,
      occupantsByID: this.occupants.map(player => player.id),
      viewersByID: this._viewers.map(player => player.id),
      playerOne: this._playerOne?.id,
      playerTwo: this._playerTwo?.id,
      trackOne: this._trackOne,
      trackTwo: this._trackTwo,
      gameInSession: this._gameInSession,
    };
  }

  /**
   * Create a new KartDashController to match a given KartDashGameModel.
   * @param kdAreaModel Game Area to represent
   * @param playerFinder A function that will return a list of PlayerController's
   *  matching a list of Player ID's.
   */

  static fromKartDashGameModel(
    kdAreaModel: KartDashGameModel,
    playerFinder: (playerIDs: string[]) => PlayerController[],
  ): KartDashController {
    const ret = new KartDashController(kdAreaModel.id);
    ret.occupants = playerFinder(kdAreaModel.occupantsByID);
    ret.viewers = playerFinder(kdAreaModel.viewersByID);
    ret.playerOne =
      kdAreaModel.playerOne === undefined ? undefined : playerFinder([kdAreaModel.playerOne]).pop();
    ret.playerTwo =
      kdAreaModel.playerTwo === undefined ? undefined : playerFinder([kdAreaModel.playerTwo]).pop();
    ret.trackOne = kdAreaModel.trackOne;
    ret.trackTwo = kdAreaModel.trackTwo;
    ret.gameInSession = kdAreaModel.gameInSession;
    return ret;
  }

  /**
   * Updates a new KartDashController to match a given KartDashGameModel.
   * @param kdAreaModel Game Area to represent
   * @param playerFinder A function that will return a list of PlayerController's
   *  matching a list of Player ID's.
   */

  updateFromKartDashGameModel(
    kdAreaModel: KartDashGameModel,
    playerFinder: (playerIDs: string[]) => PlayerController[],
  ) {
    this.occupants = playerFinder(kdAreaModel.occupantsByID);
    this.viewers = playerFinder(kdAreaModel.viewersByID);
    this.playerOne =
      kdAreaModel.playerOne === undefined ? undefined : playerFinder([kdAreaModel.playerOne]).pop();
    this.playerTwo =
      kdAreaModel.playerTwo === undefined ? undefined : playerFinder([kdAreaModel.playerTwo]).pop();
    this.trackOne = kdAreaModel.trackOne;
    this.trackTwo = kdAreaModel.trackTwo;
    this.gameInSession = kdAreaModel.gameInSession;
  }
}

/**
 * A react hook to retrieve the occupants of a KartDashController, returning an array of PlayerController.
 *
 * This hook will re-render any components that use it when the set of occupants changes.
 */
export function useKartDashOccupants(area: KartDashController): PlayerController[] {
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
 * A react hook to retrieve the viewers of a KartDashController, returning an array of PlayerController.
 *
 * This hook will re-render any components that use it when the set of viewers changes.
 */
export function useKartDashViewers(area: KartDashController): PlayerController[] {
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
 * A react hook to retrieve playerOne of a KartDashController, returning playerOne.
 * If the game is not in session or playerOne has exited the game, it will return empty.
 *
 * This hook will re-render any components that use it when the set of viewers changes.
 */
export function useKartDashPlayerOne(area: KartDashController): PlayerController | undefined {
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
 * A react hook to retrieve playerTwo of a KartDashController, returning playerTwo.
 * If the game is not in session or playerTwo has exited the game, it will return empty.
 *
 * This hook will re-render any components that use it when the set of viewers changes.
 */
export function useKartDashPlayerTwo(area: KartDashController): PlayerController | undefined {
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
 * A react hook to retrieve the trackOne of a KartDashController.
 *
 * This hook will re-render any components that use it when the trackOne changes.
 */
export function useKartDashTrackOne(area: KartDashController): number[][] {
  const [trackOne, setTrackOne] = useState(area.trackOne);
  useEffect(() => {
    area.addListener('trackOneChange', setTrackOne);
    return () => {
      area.removeListener('trackOneChange', setTrackOne);
    };
  }, [area]);
  return trackOne;
}

/**
 * A react hook to retrieve the trackTwo of a KartDashController.
 *
 * This hook will re-render any components that use it when the trackTwo changes.
 */
export function useKartDashTrackTwo(area: KartDashController): number[][] {
  const [trackTwo, setTrackTwo] = useState(area.trackTwo);
  useEffect(() => {
    area.addListener('trackTwoChange', setTrackTwo);
    return () => {
      area.removeListener('trackTwoChange', setTrackTwo);
    };
  }, [area]);
  return trackTwo;
}

/**
 * A react hook to retrieve the gameInSession of a KartDashController.
 *
 * This hook will re-render any components that use it when the gameInSession changes.
 */
export function useGameInSession(area: KartDashController): boolean {
  const [gameInSession, setGameInSession] = useState(area.gameInSession);
  useEffect(() => {
    area.addListener('gameInSessionChange', setGameInSession);
    return () => {
      area.removeListener('gameInSessionChange', setGameInSession);
    };
  }, [area]);
  return gameInSession;
}
