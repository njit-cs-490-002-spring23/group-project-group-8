import { EventEmitter } from 'events';
import TypedEventEmitter from 'typed-emitter';
import { ArcadeArea as ArcadeAreaModel } from '../types/CoveyTownSocket';

/**
 * The events that an ArcadeAreaController can emit
 */
export type ArcadeAreaEvents = {
  /**
   * A gameChange event indicates that the start/pause state has changed.
   * Listeners are passed the new state in the parameter 'isPlaying'
   */
  startGame: (inSession: boolean) => void;
  /**
   * A progressChange event indicates that the progress of the game has changed, either
   * due to the user quitting the game, or the end has naturally come to an end.
   * Listeners are passed the new game time elapsed in seconds and the new score.
   */
  progressChange: (elapsedTimeSec: number) => void;
  /**
   * A gameChange event indicates that the game selected for this Arcade Area has changed.
   * Listeners are passed the new game, which is either a string (the URL to a game), or
   * the value 'undefined' to indicate that there is no game set.
   */
  gameChange: (game: string | undefined) => void;
  /**
   * A scoreChange event indicates that the score  for this Arcade Area has changed.
   * Listeners are passed the new game, which is a number, or
   * the value 'undefined' to indicate that there is no score set.
   */

  scoreChange: (score: number) => void;
};

/**
 * An ArcadeAreaController manages the state for an ArcadeArea in the frontend app, serving as a bridge between the game
 * that is in session in the user's browser and the backend TownService, ensuring that all users playing the game
 * are synchronized.
 */
export default class ArcadeAreaController extends (EventEmitter as new () => TypedEventEmitter<ArcadeAreaEvents>) {
  private _model: ArcadeAreaModel;

  //private _name: string | undefined;

  //defaultGameURL: string | undefined;

  /**
   * Constructs a new ArcadeAreaController, initialized with the state of the
   * provided ArcadeAreaModel.
   *
   * @param arcadeAreaModel The arcade area model that this controller should represent
   */
  constructor(arcadeAreaModel: ArcadeAreaModel) {
    super();
    this._model = arcadeAreaModel;
  }

  /**
   * The ID of the arcade area represented by this arcade area controller
   * This property is read-only: once an ArcadeAreaController is created, it will always be
   * tied to the same viewing area ID
   */
  public get id() {
    return this._model.id;
  }

  /**
   * The URL of the game assigned to this arcade area, or undefined if there is none.
   *
   * Changing this value will emit a 'gameChange' event to listerners
   */
  public set game(game: string | undefined) {
    if (this._model.game != game) {
      this._model.game = game;
      this.emit('gameChange', game);
    }
  }

  /**
   * The playback position of the game, in seconds (a floating point number)
   */
  public get elapsedTimeSec() {
    return this._model.elapsedTimeSec;
  }

  /**
   * The progress position of the game, in seconds (a floating point number)
   *
   * Changing this value will emit a 'progressChange' event to listeners
   */
  public set elapsedTimeSec(elapsedTimeSec: number) {
    if (this._model.elapsedTimeSec != elapsedTimeSec) {
      this._model.elapsedTimeSec = elapsedTimeSec;
      this.emit('progressChange', elapsedTimeSec);
    }
  }

  /**
   * The playback position of the game, in seconds (a floating point number)
   */
  public get score() {
    return this._model.score;
  }

  /**
   * The progress position of the game, in seconds (a floating point number)
   *
   * Changing this value will emit a 'progressChange' event to listeners
   */
  public set score(score: number) {
    if (this._model.score != score) {
      this._model.score = score;
      this.emit('scoreChange', score);
    }
  }

  /**
   * The start/pause state - true indicating that the video is being played, false indicating
   * that the game is paused.
   */
  public get inSession() {
    return this._model.inSession;
  }

  /**
   * The start/pause state - true indicating that the video is being played, false indicating
   * that the game is paused.
   *
   * Changing this value will emit a 'startChange' event to listeners
   */
  public set inSession(inSession: boolean) {
    if (this._model.inSession != inSession) {
      this._model.inSession = inSession;
      this.emit('startGame', inSession);
    }
  }

  /**
   * @returns ArcadeAreaModel that represents the current state of this ArcadeAreaController
   */
  public arcadeAreaModel(): ArcadeAreaModel {
    return this._model;
  }

  /**
   * Applies uodates to this arcade area controller's model, setting the fields
   * isPlaying, elapsedTimeSec and game from the updateModel
   *
   * @param updateModel
   */
  public updateFrom(updateModel: ArcadeAreaModel): void {
    this.inSession = updateModel.inSession;
    this.elapsedTimeSec = updateModel.elapsedTimeSec;
    this.game = updateModel.game;
    this.score = updateModel.score;
  }
}
