import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import Player from '../lib/Player';
import {
  BoundingBox,
  Interactable,
  KartDash as KartDashModel,
  TownEmitter,
} from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';

export default class KartDashArea extends InteractableArea {
  public gameInSession: boolean;

  public viewers: Player[];

  public trackOne: number[][];

  public trackTwo: number[][];

  public playerOne?: Player;

  public playerTwo?: Player;

  /* This game modal activates when a player walks into area */
  public get isActive(): boolean {
    return this._occupants.length > 0;
  }

  public get viewersByID(): string[] {
    return this.viewers.map(player => player.id);
  }

  /**
   * Create a new KartDashArea
   * @param coordinates: bounding box that defines this game area
   * @param coordinates: a broadcast emitter that can be used to emit updates to players
   * @param kartDashAreaModel: model containing this areas game and its ID
   */

  public constructor({ id }: KartDashModel, coordinates: BoundingBox, townEmitter: TownEmitter) {
    super(id, coordinates, townEmitter);
    this.gameInSession = false;
    this.viewers = [];
    this.trackOne = this.createTrack();
    this.trackTwo = this.createTrack();
  }

  public toModel(): KartDashModel {
    return {
      id: this.id,
      occupantsByID: this.occupantsByID,
      gameInSession: this.gameInSession,
      viewersByID: this.viewersByID,
      trackOne: this.trackOne,
      trackTwo: this.trackTwo,
      playerOne: this.playerOne?.id,
      playerTwo: this.playerTwo?.id,
    };
  }

  /**
   * Removes a player from this game area.
   *
   * Extends the base behavior of InteractableAea to set the game of this game area to undefined and
   * emit an update to other players in the town when the last player leaves.
   *
   * @param player
   *
   */
  public remove(player: Player) {
    super.remove(player);

    if (this.playerOne?.id === player.id) {
      this.playerOne = undefined;
    } else if (this.playerTwo?.id === player.id) {
      this.playerTwo = undefined;
    } else {
      this.viewers.filter(p => p.id !== player.id);
    }

    if (this.gameInSession && (this.playerOne === undefined || this.playerTwo === undefined)) {
      this.gameInSession = false;
      this.trackOne = this.createTrack();
      this.trackTwo = this.createTrack();
      this._emitAreaChanged();
    }
  }

  /**
   * Adds player to the list of players in a gamiing session.
   */

  public add(player: Player): void {
    super.add(player);
    if (this.playerOne === undefined) {
      this.playerOne = player;
    } else if (this.playerTwo === undefined) {
      this.playerTwo = player;
    } else {
      this.viewers.push(player);
    }
  }

  /**
   * Starts a game when PlayerOne and PlayerTwo are both defined.
   * The game must not be already running.
   *
   * @returns true if the game has already started, false if the game has not started.
   */

  public startRace(): void {
    if (this.playerTwo === undefined || this.playerTwo === undefined || this.gameInSession) {
      // eslint-disable-next-line no-useless-return
      return;
      // eslint-disable-next-line no-else-return
    } else {
      this.gameInSession = true;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  createTrack(): number[][] {
    const track: number[][] = [];
    for (let i = 0; i < 3; i++) {
      track.push([0, 0, 0]);
    }
    return track;
  }
}
