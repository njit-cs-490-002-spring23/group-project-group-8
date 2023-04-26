import PaddlePartyController from '../../../classes/PaddlePartyController';
import TownController from '../../../classes/TownController';
import { BoundingBox } from '../../../types/CoveyTownSocket';
import Interactable, { KnownInteractableTypes } from '../Interactable';
import TownGameScene from '../TownGameScene';

export default class PaddlePartyArea extends Interactable {
  private _playerOneName?: Phaser.GameObjects.Text;

  private _playerTwoName?: Phaser.GameObjects.Text;

  private _paddleOneValue?: Phaser.GameObjects.Text;

  private _paddleTwoValue?: Phaser.GameObjects.Text;

  private _paddlePartyArea?: PaddlePartyController;

  private _townController?: TownController;

  private _gameInSession?: Phaser.GameObjects.Text;

  constructor(scene: TownGameScene) {
    super(scene);
    this._townController = scene.coveyTownController;
    this.setTintFill();
    this.setAlpha(0.3);
    this._townController.addListener('paddlePartyAreasChanged', this._updatePaddlePartyAreas);
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

  private get _paddleOneValueText() {
    const ret = this._paddleOneValue;
    if (!ret) {
      throw new Error('Expected board 1 to be defined');
    }
    return ret;
  }

  private get _paddleTwoValueText() {
    const ret = this._paddleTwoValue;
    if (!ret) {
      throw new Error('Expected track two to be defined');
    }
    return ret;
  }

  getType(): KnownInteractableTypes {
    return 'paddlePartyArea';
  }

  removedFromScene(): void {}

  addedToScene(): void {
    super.addedToScene();
    this.scene.add.text(
      this.x - this.displayWidth / 1.92,
      this.y - this.displayHeight / 1,
      this.name,
      { color: '#FFFFFF', backgroundColor: '#000000' },
    );
    this._gameInSession = this.scene.add.text(
      this.x - this.displayWidth / 1.87,
      this.y + this.displayHeight / 4,
      '(No match)',
      { color: '#000000' },
    );
    this._updatePaddlePartyAreas();
  }

  private _updatePaddlePartyAreas = (areas: PaddlePartyController[] = []): void => {
    const area = areas.find(a => a.id === this.id);
    if (area) {
      this._paddlePartyArea = area;
      this._playerOneNameText.setText(area.playerOne?.userName ?? '(No Player One)');
      this._playerTwoNameText.setText(area.playerTwo?.userName ?? '(No Player Two)');
      this._paddleOneValueText.setText(area.paddleOne?.toString() ?? '(No Track One)');
      this._paddleTwoValueText.setText(area.paddleTwo?.toString() ?? '(No Track Two)');
    }
  };

  getBoundingBox(): BoundingBox {
    const { x, y, width, height } = this.getBounds();
    return { x, y, width, height };
  }
}
