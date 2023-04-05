import Interactable, { KnownInteractableTypes } from '../Interactable';
import GameSelectionModal from './GamesModal';
import SelectGameModal from './SelectGameModal';

export default class ArcadeArea extends Interactable {
  private _labelText?: Phaser.GameObjects.Text;

  private _defaultGameURL?: string;

  private _isInteracting = false;

  private _game?: string;

  public get defaultGameURL() {
    if (!this.defaultGameURL) {
      return 'No Game URL Found';
    }
    console.log('We are here 16');
    return this._defaultGameURL;
  }

  public get game() {
    if (!this.game) {
      console.log('Here');
      return 'No Game Found';
    }
    console.log('No');
    return this._game;
  }

  addedToScene() {
    super.addedToScene();
    this.setTintFill();
    this.setAlpha(0.3);

    this._game = this.getData('games');
    this._labelText = this.scene.add.text(
      this.x - this.displayWidth / 2,
      this.y - this.displayHeight / 2,
      `Welcome to the Arcade Area`,
      { color: '#FFFFFF', backgroundColor: '#000000' },
    );
    this._labelText.setVisible(false);
    //Might need to revise this.townController.getArcadeAreaController(this);
    this.setDepth(-1);
  }

  overlap(): void {
    if (!this._labelText) {
      throw new Error('Should not be able to overlap with this interactable before added to scene');
    }
    const location = this.townController.ourPlayer.location;
    this._labelText.setX(location.x);
    this._labelText.setY(location.y);
    this._labelText.setVisible(true);
    GameSelectionModal();
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
  }

  getType(): KnownInteractableTypes {
    return 'arcadeArea';
  }
}
