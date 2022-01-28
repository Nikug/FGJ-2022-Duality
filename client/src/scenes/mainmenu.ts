import {
  JUMP_VELOCITY,
  MOVEMENT_SPEED,
  ONLINE_SPEED_SCALE,
  PLAYER_GRAVITY,
} from "../constants";

import type * as Game from "../../types/types";
import type { Socket } from "socket.io-client";
import { createRectangle } from "../util/gameUtils";
import { socket } from "..";
import { throttleUpdate } from "../util/socketUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: "MainMenu",
};

export class MainMenu extends Phaser.Scene {
  public player?: Game.PhysicsRectangle;
  private socket?: Socket;
  private otherPlayers: Game.PlayerGameObject[] = [];
  private cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;

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
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const button = this.add
      .image(screenCenterX, screenCenterY, "button")
      .setOrigin(0.5);
    button.setInteractive();
    button.on("pointerdown", () => this.scene.start("Game"));

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player = createRectangle(
      this,
      new Phaser.Math.Vector2(128, 64),
      0x00ff00,
      this.socket?.id || "",
    );

    this.player.body.setGravityY(PLAYER_GRAVITY);
    this.physics.add.collider(this.player, this.otherPlayers);

    // const mainCamera = this.cameras.main;
    // mainCamera.setZoom(2, 2);
    // mainCamera.startFollow(this.player);
    // mainCamera.setLerp(0.1, 0.1);
  }

  public initPlayers(players: Game.ApiPlayerState[]) {
    for (const player of players) {
      if (player.id === this.socket?.id) continue;
      this.addPlayer(player);
    }
  }

  public addPlayer(newPlayer: Game.ApiPlayerState) {
    const newPlayerObject = createRectangle(
      this,
      new Phaser.Math.Vector2(newPlayer.x, newPlayer.y),
      0xff00ff,
      newPlayer.id,
    );
    this.otherPlayers.push(newPlayerObject);
  }

  public removePlayer(id: string) {
    const index = this.otherPlayers.findIndex((player) => player.id === id);
    if (index < 0) return;

    const playerToRemove = this.otherPlayers.splice(index, 1);
    playerToRemove[0].destroy();
  }

  public updatePlayers = (players: Game.ApiPlayerState[]) => {
    for (const player of players) {
      if (player.id === this.socket?.id) continue;
      if (player.x == null || player.y == null) continue;

      const gameObject = this.otherPlayers.find(
        (otherPlayer) => otherPlayer.id === player.id,
      );

      if (!gameObject) continue;

      const difference = gameObject.body.position.clone().subtract({
        x: player.x,
        y: player.y,
      });
      difference.scale(ONLINE_SPEED_SCALE);
      gameObject.body.setVelocity(-difference.x, -difference.y);
    }
  };

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

    throttleUpdate({
      x: this.player.body.position.x,
      y: this.player.body.position.y,
      socket: this.socket,
    });
  }
}
