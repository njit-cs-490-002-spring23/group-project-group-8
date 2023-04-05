import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import Player from '../lib/Player';
import { BoundingBox, TownEmitter, ArcadeArea as ArcadeAreaModel } from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';

// Add Function to add players to Arcade Area

export default class ArcadeArea extends InteractableArea {
  private _name: string | undefined;

  private _game: string | undefined;

  private _elapsedTimeSec: number;

  private _isPlaying: boolean;

  private _score: number;

  private _defaultGameURL: string | undefined;

  public get name() {
    return this._name;
  }

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

  public get defaultGameURL() {
    return this._defaultGameURL;
  }

  /**
   * Creates a new Arcade Area
   * @param arcadeArea model containing this area's starting state
   * @param coordinates the bounding box that defines this viewing area
   * @param townEmitter a broadcast emitter that can be used to emit updates to players
   */
  public constructor(
    { name, id, isPlaying, elapsedTimeSec: progress, game, score, defaultGameURL }: ArcadeAreaModel,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(id, coordinates, townEmitter);
    this._name = name;
    this._game = game;
    this._elapsedTimeSec = progress;
    this._isPlaying = isPlaying;
    this._score = score;
    this._defaultGameURL = defaultGameURL;
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
  public updateModel({ name, isPlaying, elapsedTimeSec: progress, game, score }: ArcadeAreaModel) {
    this._game = game;
    this._isPlaying = isPlaying;
    this._elapsedTimeSec = progress;
    this._score = score;
    this._name = name;
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
      defaultGameURL: this._defaultGameURL,
      name: this._name,
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
      { isPlaying: false, id: name, score: 0, elapsedTimeSec: 0, defaultGameURL: '', name: '' },
      rect,
      townEmitter,
    );
  }
}

// Must have arcadeModel setup in CoveyTownSocket!!!!
