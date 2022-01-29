import { JUMP_VELOCITY, MOVEMENT_SPEED, ONLINE_SPEED_SCALE, PLAYER_GRAVITY } from "../constants";

import type * as Game from "../../types/types";
import type { Socket } from "socket.io-client";
import { createRectangle } from "../util/gameUtils";
import { socket } from "..";
import { playerCount, throttleUpdate } from "../util/socketUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: "MainMenu",
};

export class MainMenu extends Phaser.Scene {
  public player?: Game.PhysicsRectangle;
  private socket?: Socket;
  private otherPlayers: Game.PlayerGameObject[] = [];
  private cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
  private playerCountText: Phaser.GameObjects.Text | undefined;

  constructor() {
    super(sceneConfig);
    this.player = undefined;
    this.socket = socket;
    this.cursorKeys = undefined;
  }

  public preload() {
    this.load.image("button", "/assets/tempButton.png");
  }

  public create() {
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const playButton = this.add.image(screenCenterX, screenCenterY, "button").setOrigin(0.5);
    playButton.setInteractive();
    playButton.on("pointerdown", () => this.scene.start("Game"));

    this.playerCountText = this.add
      .text(screenCenterX * 1.5, screenCenterY / 2, "Player count:1", {
        font: "20px",
        color: "#000000",
      })
      .setOrigin(0.5);

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player = createRectangle(this, new Phaser.Math.Vector2(128, 64), 0x00ff00, this.socket?.id || "");

    this.player.body.setGravityY(PLAYER_GRAVITY);
    this.physics.add.collider(this.player, this.otherPlayers);
  }

  public setPlayerCount(playerCount: integer) {
    this.playerCountText?.setText("Player count:" + playerCount);
  }

  public update() {
    if (!this.cursorKeys) return;
    if (!this.player) return;

    if (this.cursorKeys.left.isDown) {
      this.player.body.setVelocityX(-MOVEMENT_SPEED);
    } else if (this.cursorKeys.right.isDown) {
      this.player.body.setVelocityX(MOVEMENT_SPEED);
    } else {
      this.player.body.setVelocityX(0);
    }

    if (this.cursorKeys.up.isDown && this.player.body.onFloor()) {
      this.player.body.setVelocityY(-JUMP_VELOCITY);
    }
    playerCount();
    throttleUpdate({
      x: this.player.body.position.x,
      y: this.player.body.position.y,
      socket: this.socket,
    });
  }
}
