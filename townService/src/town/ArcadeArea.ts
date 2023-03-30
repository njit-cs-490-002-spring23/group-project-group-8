import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import Player from '../lib/Player';
import { BoundingBox, TownEmitter, ArcadeArea as ArcadeAreaModel } from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';

// Add Function to add players to Arcade Area

export default class ArcadeArea extends InteractableArea {
  private _game?: string;

  private _elapsedTimeSec: number;

  private _isPlaying!: boolean;

  private _score!: number;

  public get game() {
    return this._game;
  }

  public get elapsedTimeSec() {
    return this._elapsedTimeSec;
  }

  public get isPlaying() {
    return this._isPlaying;
  }

  public get score() {
    return this._score;
  }

  /**
   * Creates a new Arcade Area
   * @param arcadeArea model containing this area's starting state
   * @param coordinates the bounding box that defines this viewing area
   * @param townEmitter a broadcast emitter that can be used to emit updates to players
   */
  public constructor(
    { id, isPlaying, elapsedTimeSec: progress, game, score }: ArcadeAreaModel,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(id, coordinates, townEmitter);
    this._game = game;
    this._elapsedTimeSec = progress;
    this._isPlaying = isPlaying;
    this._score = score;
  }

  /**
   * Removes a player from this arcade area.
   *
   * When the last player leaves, this method clears the game of this area and
   * emits that update to all of the players.
   *
   * @param player
   */
  public remove(player: Player): void {
    super.remove(player);
    if (this._occupants.length === 0) {
      this._game = undefined;
      this._emitAreaChanged();
    }
  }

  /**
   * Updates the state of this ArcadeArea, setting the game, isPlaying and progress, score properties
   *
   * @param arcadeArea updated model
   */
  public updateModel({ isPlaying, elapsedTimeSec: progress, game, score }: ArcadeAreaModel) {
    this._game = game;
    this._isPlaying = isPlaying;
    this._elapsedTimeSec = progress;
    this._score = score;
  }

  /**
   * Convert this ArcadeArea instance to a simple ArcadeModel suitable for
   * tranporting over a socket to a client.
   */
  public toModel(): ArcadeAreaModel {
    return {
      id: this.id,
      game: this._game,
      isPlaying: this._isPlaying,
      elapsedTimeSec: this._elapsedTimeSec,
      score: this._score,
    };
  }

  /**
   * Creates a new ArcadeArea object that will represent an Arcade Area object in the town map.
   * @param mapObject An ITiledMapObject that represents a rectangle in which this arcade area exists.
   * @param townEmitter An emitter that can be used by this arcade area to broadcast updates to players in the town
   * @returns
   */
  public static fromMapObject(mapObject: ITiledMapObject, townEmitter: TownEmitter): ArcadeArea {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed arcade area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new ArcadeArea(
      { isPlaying: false, id: name, score: 0, elapsedTimeSec: 0 },
      rect,
      townEmitter,
    );
  }
}

// Must have arcadeModel setup in CoveyTownSocket!!!!
