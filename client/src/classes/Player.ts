import Phaser from "phaser";
import type { Socket } from "socket.io-client";
import { PLAYER_GRAVITY, PLAYER_SIZES } from "../constants";
import type { GameScene } from "../scenes/main";
import type { PlayerSpriteObject, Team, PlayerStats } from "../../types/types";
import { pushPlayer, throttleUpdate } from "../util/socketUtils";
import { getSheet } from "../util/characterUtils";

export class PlayerObject {
  public id: string;
  public physicSprite: PlayerSpriteObject;
  private stats: PlayerStats;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private scene: GameScene;
  private socket?: Socket;
  private disabledTime = 0;
  private canPush = true;
  private timeFromGroundContact = 0;
  private timeFromDash = 0;
  private canMove = true;
  public team: Team;
  private keyQ: Phaser.Input.Keyboard.Key;
  private keyW: Phaser.Input.Keyboard.Key;

  constructor(scene: GameScene, position: Phaser.Math.Vector2, key: string, id: string, socket?: Socket) {
    this.scene = scene;
    this.physicSprite = scene.physics.add.sprite(position.x, position.y, key) as PlayerSpriteObject;
    this.physicSprite.body.setGravityY(PLAYER_GRAVITY);
    this.id = id;
    this.socket = socket;
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.team = "coconut";
    this.keyQ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.stats = PLAYER_SIZES.big;
    this.setStats(PLAYER_SIZES.big);
  }

  public resetGroundContact = () => (this.timeFromGroundContact = this.stats.canJumpDuration);

  public setTeam = (team: Team) => {
    console.log("setting my team to", team);
    this.team = team;
    this.physicSprite.setTexture(getSheet(team));
  };

  public setGravity = (direction: "down" | "up") => {
    if (direction === "down") {
      this.physicSprite.body.setGravityY(PLAYER_GRAVITY);
    } else {
      this.physicSprite.body.setGravityY(-PLAYER_GRAVITY);
    }
  };

  public checkMovement() {
    if (!this.cursorKeys) return;
    if (!this.physicSprite) return;
    if (!this.canMove) return;

    if (this.cursorKeys.left.isDown) {
      this.physicSprite.body.setVelocityX(-this.stats.movementSpeed);
    } else if (this.cursorKeys.right.isDown) {
      this.physicSprite.body.setVelocityX(this.stats.movementSpeed);
    } else {
      this.physicSprite.body.setVelocityX(0);
    }

    if (this.keyW.isDown && this.canPush) {
      this.canPush = false;
      this.pushPlayers();
      setTimeout(() => {
        this.canPush = true;
      }, this.stats.canPushTimeout);
    }
  }
  private pushPlayers() {
    const pos = this.physicSprite.body.position;

    if (pos) {
      this.scene.otherPlayers.forEach((pl) => {
        const pl_pos = pl.body.position;
        if (pl_pos.distance(pos) < this.stats.pushDistance) {
          pushPlayer(pl.id, new Phaser.Math.Vector2(pl_pos.x - pos.x, pl_pos.y - pos.y).normalize(), this.socket);
          this.scene.events.emit("playSmack");
        }
      });
    }
  }

  public getPushed(direction: Phaser.Math.Vector2) {
    this.canMove = false;

    this.physicSprite.body.setVelocityX(direction.x * this.stats.pushPower);
    this.physicSprite.body.setVelocityY(direction.y * this.stats.pushPower);
    this.disabledTime = this.stats.pushTimeout;
    this.scene.events.emit("playSmack");
  }

  public setStats(stats: PlayerStats) {
    this.stats = stats;
    this.physicSprite.setScale(stats.sizeScale);
  }

  public checkJump(delta: number, isUpsideDown: boolean) {
    if (!this.cursorKeys) return;
    if (!this.physicSprite) return;
    if (!this.canMove) return;

    if ((!isUpsideDown && this.physicSprite.body.onFloor()) || (isUpsideDown && this.physicSprite.body.onCeiling())) {
      this.timeFromGroundContact = this.stats.canJumpDuration;
    } else if (this.timeFromGroundContact > 0) {
      this.timeFromGroundContact -= delta;
    }

    if ((this.cursorKeys.up.isDown || this.cursorKeys.down.isDown) && this.timeFromGroundContact > 0) {
      this.physicSprite.body.setVelocityY(isUpsideDown ? this.stats.jumpVelocity : -this.stats.jumpVelocity);
      this.scene.events.emit("playJump");

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
        this.physicSprite.body.setVelocityX(-this.stats.dashVelocity);
      } else {
        this.physicSprite.body.setVelocityX(this.stats.dashVelocity);
      }
      this.canMove = false;
      this.disabledTime = this.stats.dashCantMoveDuration;
      this.timeFromDash = this.stats.dashTimeout;
      this.scene.events.emit("playDash");
    }
  }

  public checkActions(delta: number, isUpsideDown: boolean) {
    this.checkMovement();
    if (this.disabledTime > 0) {
      this.disabledTime -= delta;
    } else if (!this.canMove) {
      this.canMove = true;
    }
    this.checkJump(delta, isUpsideDown);
    this.checkDash(delta);
    throttleUpdate({
      x: this.physicSprite.body.position.x,
      y: this.physicSprite.body.position.y,
      socket: this.socket,
    });
  }
}
