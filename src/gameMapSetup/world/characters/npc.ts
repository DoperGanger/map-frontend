import { CHARACTER_ASSET_KEYS } from "@/gameMapSetup/assets/asset-keys";
// import { Character } from "./character";
import { getTargetPositionFromGameObjectPositionAndDirection } from "@/gameMapSetup/utils/grid-utils";
import { DIRECTION } from "@/gameMapSetup/common/direction";
import { exhaustiveGuard } from "@/gameMapSetup/utils/guard";

export class NPC {
  protected _scene: Phaser.Scene;
  protected _phaserGameObject: Phaser.GameObjects.Sprite;
  protected _direction: DIRECTION;
  protected _isMoving: boolean;
  protected _targetPosition;
  protected _previousTargetPosition;
  protected _spriteGridMovementFinishedCallback: (() => void) | undefined;
  protected _idleFrameConfig;
  protected _origin;
  protected _collisionLayer;

  constructor(config: any) {
    this._scene = config.scene;
    this._direction = config.direction;
    this._isMoving = false;
    this._targetPosition = { ...config.position };
    this._previousTargetPosition = { ...config.position };
    this._idleFrameConfig = {
      DOWN: 80, //80,
      LEFT: 82,
      UP: 81,
      RIGHT: 82,
      NONE: 80,
    };
    this._spriteGridMovementFinishedCallback =
      config.spriteGridMovementFinishedCallback;
    this._origin = { x: -0.1, y: -0.1 };
    this._collisionLayer = config.collisionLayer;

    this._phaserGameObject = this._scene.add
      .sprite(
        config.position.x,
        config.position.y,
        CHARACTER_ASSET_KEYS.NPC,
        this._getIdleFrame()
      )
      .setOrigin(this._origin.x, this._origin.y)
      .setScale(config.scale || 1);
  }

  moveCharacter(direction: any) {
    if (this._isMoving) {
      return;
    }

    this._phaserGameObject.setScale(1, 1);
    if (direction === DIRECTION.LEFT) {
      this._phaserGameObject.setScale(-1, 1);
      this._phaserGameObject.setOrigin(1.1, -0.1);
    }

    this.moveSprite(direction);

    // if (!idleFrame) {
    //   return;
    // }

    this._direction = direction;
    let animKey;

    switch (this._direction) {
      case DIRECTION.DOWN:
        animKey = "NPC_DOWN";
        break;
      case DIRECTION.UP:
        animKey = "NPC_UP";
        break;
      case DIRECTION.LEFT:
        animKey = "NPC_LEFT";
        break;
      case DIRECTION.RIGHT:
        animKey = "NPC_RIGHT";
        break;
      // if (
      //   !this._phaserGameObject.anims.isPlaying ||
      //   this._phaserGameObject.anims.currentAnim?.key !==
      //     `NPC_${this._direction}`
      // ) {
      //   console.log("NPC is moving");
      //   this._phaserGameObject.anims.play(`NPC_${this._direction}`);
      // }
      // break;
      case DIRECTION.NONE:
        break;
      default:
        // We should never reach this default case
        exhaustiveGuard(this._direction);
    }

    if (animKey) {
      this._phaserGameObject.anims.play(animKey, true);
    }
  }

  stopMovement() {
    this._isMoving = false;

    // Play idle animation based on last direction
    let idleAnimKey = `NPC_${DIRECTION[this._direction]}`; // e.g., "NPC_IDLE_DOWN"
    this._phaserGameObject.anims.play(idleAnimKey, true);
  }

  _getIdleFrame() {
    return this._idleFrameConfig[this._direction];
  }

  get sprite(): Phaser.GameObjects.Sprite {
    return this._phaserGameObject;
  }

  get isMoving(): boolean {
    return this._isMoving;
  }

  get direction(): DIRECTION {
    return this._direction;
  }

  update(time: any) {
    if (this._isMoving) {
      return;
    }
    // stop current animation and show idle frame
    const idleFrame =
      this._phaserGameObject.anims.currentAnim?.frames[1].frame.name;

    this._phaserGameObject.anims.stop();

    if (!idleFrame) {
      return;
    }

    switch (this._direction) {
      case DIRECTION.DOWN:
      case DIRECTION.LEFT:
      case DIRECTION.RIGHT:
      case DIRECTION.UP:
        this._phaserGameObject.setFrame(idleFrame);
        break;
      case DIRECTION.NONE:
        break;
      default:
        // We should never reach this default case
        exhaustiveGuard(this._direction as never);
    }
  }

  protected moveSprite(direction: DIRECTION): void {
    this._direction = direction;
    if (this.isBlockingTile()) {
      return;
    }
    this._isMoving = true;
    this.handleSpriteMovement();
  }

  protected isBlockingTile() {
    if (this._direction === DIRECTION.NONE) {
      return false;
    }

    // Implementation of tile blocking logic
    const targetPosition = { ...this._targetPosition };
    const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(
      targetPosition,
      this._direction
    );

    return this.doesPositionCollideWithCollisionLayer(updatedPosition);
  }

  handleSpriteMovement(): void {
    if (this._direction === DIRECTION.NONE) {
      return;
    }

    const updatedPosition = getTargetPositionFromGameObjectPositionAndDirection(
      this._targetPosition,
      this._direction
    );

    this._previousTargetPosition = { ...this._targetPosition };

    this._targetPosition = updatedPosition;

    this._scene.add.tween({
      delay: 0,
      duration: 600,
      y: { from: this._phaserGameObject.y, to: updatedPosition.y },
      x: { from: this._phaserGameObject.x, to: updatedPosition.x },
      targets: this._phaserGameObject,

      onComplete: () => {
        this._isMoving = false;
        this.stopMovement();
        if (this._spriteGridMovementFinishedCallback) {
          this._spriteGridMovementFinishedCallback();
        }
      },
    });
  }

  doesPositionCollideWithCollisionLayer(position: any) {
    if (!this._collisionLayer) {
      return false;
    }

    const { x, y } = position;

    const tileIndex = x / 16 + (y / 16) * 20;
    const tile = this._collisionLayer.getTileAtWorldXY(x, y, true);

    if (x < 0 || y < 0 || x >= 320 || y >= 320) {
      return true;
    }
    return tile.index !== -1;
  }

  getPosition() {
    return {
      x: this._phaserGameObject.x,
      y: this._phaserGameObject.y,
    };
  }
  getIndex() {
    const x = this._phaserGameObject.x;
    const y = this._phaserGameObject.y;
    return x / 16 + (y / 16) * 20;
  }
}
