import KartDashController from '../../../classes/KartDashController';
import PlayerController from '../../../classes/PlayerController';
import TownController, { usePlayers } from '../../../classes/TownController';
import { BoundingBox } from '../../../types/CoveyTownSocket';
import Interactable, { KnownInteractableTypes } from '../Interactable';
import TownGameScene from '../TownGameScene';
import PlayersInGameList from './testgame/testGamePlayerList';

export default class KartDashArea extends Interactable {
  private _labelText?: Phaser.GameObjects.Text;

  private _isInteracting = false;

  private _playerOneName?: Phaser.GameObjects.Text;

  private _playerTwoName?: Phaser.GameObjects.Text;

  private _trackOneValue?: Phaser.GameObjects.Text;

  private _trackTwoValue?: Phaser.GameObjects.Text;

  private _kartDashArea?: KartDashController;

  private _gameInSession?: Phaser.GameObjects.Text;

  private _townController: TownController;

  private _playersInGameNames!: PlayerController;

  constructor(scene: TownGameScene) {
    super(scene);
    this._townController = scene.coveyTownController;
    this.setTintFill();
    this.setAlpha(0.3);
    this._townController.addListener('kartDashAreasChanged', this._updateKartDashAreas);
  }

  private get _playersInGame() {
    const playersInGameNames = this._playersInGameNames;
    if (!playersInGameNames) {
      throw new Error('If empty player array push to player 1 and 2');
    }
    return playersInGameNames;
  }

  private get _playerOneNameText() {
    const ret = this._playerOneName;
    if (!ret) {
      throw new Error('Expected player one to be defined');
    }
    return ret;
  }

  private get _playerTwoNameText() {
    const ret = this._playerTwoName;
    if (!ret) {
      throw new Error('Expected player two to be defined');
    }

    return ret;
  }

  private get _trackOneValueText() {
    const ret = this._trackOneValue;
    if (!ret) {
      throw new Error('Expected track one to be defined');
    }
    return ret;
  }

  private get _trackTwoValueText() {
    const ret = this._trackTwoValue;
    if (!ret) {
      throw new Error('Expected track two to be defined');
    }
    return ret;
  }

  getType(): KnownInteractableTypes {
    return 'kartDashArea';
  }

  overlapExit(): void {
    this._labelText?.setVisible(false);
    if (this._isInteracting) {
      this.townController.interactableEmitter.emit('endInteraction', this);
      this._isInteracting = false;
    }
  }

  interact(): void {
    this._labelText?.setVisible(false);
    this._isInteracting = true;
    console.log(PlayerController.arguments);
  }

  removedFromScene(): void {}

  addedToScene(): void {
    super.addedToScene();
    this.scene.add.text(
      this.x - this.displayWidth / 8,
      this.y - this.displayHeight / 4,
      this.name,
      { color: '#FFFFFF', backgroundColor: '#000000' },
    );
    this._gameInSession = this.scene.add.text(
      this.x - this.displayWidth / 2.5,
      this.y + this.displayHeight / 14,
      '(No game in session)',
      { color: '#000000' },
    );
    this._updateKartDashAreas();
  }

  private _updateKartDashAreas = (areas: KartDashController[] = []): void => {
    const area = areas.find(a => a.id === this.id);
    if (area) {
      this._kartDashArea = area;
      this._playerOneNameText.setText(area.playerOne?.userName ?? '(No Player One)');
      this._playerTwoNameText.setText(area.playerTwo?.userName ?? '(No Player Two)');
      this._trackOneValueText.setText(area.trackOne?.toString() ?? '(No Track One)');
      this._trackTwoValueText.setText(area.trackTwo?.toString() ?? '(No Track Two)');
      console.log(this._playersInGame);
    }
  };

  getBoundingBox(): BoundingBox {
    const { x, y, width, height } = this.getBounds();
    return { x, y, width, height };
  }
}
