import Phaser from "phaser";
import type { Socket } from "socket.io-client";
import {
  CAN_JUMP_DURATION,
  CAN_PUSH_TIMEOUT_DURATION,
  DASH_CANT_MOVE_DURATION,
  DASH_TIMEOUT_DURATION,
  DASH_VELOCITY,
  JUMP_VELOCITY,
  MOVEMENT_SPEED,
  PLAYER_GRAVITY,
  PLAYER_PUSH_DISTANCE,
  PLAYER_PUSH_POWER,
  PUSH_TIMEOUT_DURATION,
} from "../constants";
import type { GameScene } from "../scenes/main";
import type { PlayerSpriteObject } from "../../types/types";
import { addModifier, pushPlayer, throttleUpdate } from "../util/socketUtils";

export class PlayerObject {
  public id: string;
  public physicSprite: PlayerSpriteObject;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private scene: GameScene;
  private socket?: Socket;
  private disabledTime = 0;
  private canPush = true;
  private timeFromGroundContact = 0;
  private timeFromDash = 0;
  private canMove = true;
  private keyQ: Phaser.Input.Keyboard.Key;
  private keyW: Phaser.Input.Keyboard.Key;

  constructor(scene: GameScene, position: Phaser.Math.Vector2, key: string, id: string, socket?: Socket) {
    this.scene = scene;
    this.physicSprite = scene.physics.add.sprite(position.x, position.y, key) as PlayerSpriteObject;
    this.physicSprite.body.setGravityY(PLAYER_GRAVITY);
    this.id = id;
    this.socket = socket;
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.keyQ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  }

  public resetGroundContact = () => (this.timeFromGroundContact = CAN_JUMP_DURATION);

  public checkMovement() {
    if (!this.cursorKeys) return;
    if (!this.physicSprite) return;
    if (!this.canMove) return;

    if (this.cursorKeys.left.isDown) {
      this.physicSprite.body.setVelocityX(-MOVEMENT_SPEED);
    } else if (this.cursorKeys.right.isDown) {
      this.physicSprite.body.setVelocityX(MOVEMENT_SPEED);
    } else {
      this.physicSprite.body.setVelocityX(0);
    }

    if (this.keyW.isDown && this.canPush) {
      this.canPush = false;
      this.pushPlayers();
      setTimeout(() => {
        this.canPush = true;
      }, CAN_PUSH_TIMEOUT_DURATION);
    }
  }
  private pushPlayers() {
    const pos = this.physicSprite.body.position;

    if (pos) {
      this.scene.otherPlayers.forEach((pl) => {
        const pl_pos = pl.body.position;
        if (pl_pos.distance(pos) < PLAYER_PUSH_DISTANCE) {
          pushPlayer(pl.id, new Phaser.Math.Vector2(pl_pos.x - pos.x, pl_pos.y - pos.y).normalize(), this.socket);
        }
      });
    }
  }

  public getPushed(direction: Phaser.Math.Vector2) {
    this.canMove = false;

    this.physicSprite.body.setVelocityX(direction.x * PLAYER_PUSH_POWER);
    this.physicSprite.body.setVelocityY(direction.y * PLAYER_PUSH_POWER);
    this.disabledTime = PUSH_TIMEOUT_DURATION;
  }

  public checkJump(delta: number) {
    if (!this.cursorKeys) return;
    if (!this.physicSprite) return;
    if (!this.canMove) return;

    if (this.physicSprite.body.onFloor()) {
      this.timeFromGroundContact = CAN_JUMP_DURATION;
    } else if (this.timeFromGroundContact > 0) {
      this.timeFromGroundContact -= delta;
    }

    if (this.cursorKeys.up.isDown && this.timeFromGroundContact > 0) {
      this.physicSprite.body.setVelocityY(-JUMP_VELOCITY);

      if (this.socket) {
        addModifier("New Modifier", 5, this.socket);
      }

      this.timeFromGroundContact = 0;
    }
  }
  public checkDash(delta: number) {
    if (!this.cursorKeys) return;
    if (!this.physicSprite) return;
    if (!this.canMove) return;

    if (this.timeFromDash > 0) {
      this.timeFromDash -= delta;
    }

    if (this.keyQ.isDown && this.timeFromDash <= 0) {
      if (this.physicSprite.body.velocity.x < 0) {
        this.physicSprite.body.setVelocityX(-DASH_VELOCITY);
      } else {
        this.physicSprite.body.setVelocityX(DASH_VELOCITY);
      }
      this.canMove = false;
      this.disabledTime = DASH_CANT_MOVE_DURATION;
      this.timeFromDash = DASH_TIMEOUT_DURATION;
    }
  }

  public checkActions(delta: number) {
    this.checkMovement();
    if (this.disabledTime > 0) {
      this.disabledTime -= delta;
    } else if (!this.canMove) {
      this.canMove = true;
    }
    this.checkJump(delta);
    this.checkDash(delta);
    throttleUpdate({
      x: this.physicSprite.body.position.x,
      y: this.physicSprite.body.position.y,
      socket: this.socket,
    });
  }
}
