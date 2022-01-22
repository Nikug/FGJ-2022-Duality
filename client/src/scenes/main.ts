import type { Game } from "../../types/types";
import type { Socket } from "socket.io-client";
import { socket } from "..";
import { throttleUpdate } from "../util/socketUtils";

type PhysicsRectangle = Phaser.GameObjects.Rectangle & {
  body: Phaser.Physics.Arcade.Body;
};

interface PlayerGameObject extends PhysicsRectangle {
  id: string;
}

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  private player?: PhysicsRectangle;
  private socket?: Socket;
  private otherPlayers: PlayerGameObject[] = [];

  constructor() {
    super(sceneConfig);
    this.player = undefined;
    this.socket = socket;
  }

  public initPlayers(players: Game.ApiPlayerState[]) {
    for (const player of players) {
      if (player.id === this.socket?.id) continue;
      const newPlayerObject = this.add.rectangle(
        player.x,
        player.y,
        100,
        100,
        0xff00ff,
      ) as PlayerGameObject;
      newPlayerObject.id = player.id;
      this.physics.add.existing(newPlayerObject);
      this.otherPlayers.push(newPlayerObject);
    }
  }

  public addPlayer(newPlayer: Game.ApiPlayerState) {
    const newPlayerObject = this.add.rectangle(
      newPlayer.x,
      newPlayer.y,
      100,
      100,
      0xff00ff,
    ) as PlayerGameObject;
    newPlayerObject.id = newPlayer.id;
    this.physics.add.existing(newPlayerObject);
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

      gameObject.setPosition(player.x, player.y);
    }
  };

  public create() {
    this.player = this.add.rectangle(400, 400, 100, 100, 0x00ffff) as any;

    if (this.player) {
      this.physics.add.existing(this.player);
    }
  }

  public update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();

    if (cursorKeys.up.isDown) {
      this.player?.body.setVelocityY(-500);
    } else if (cursorKeys.down.isDown) {
      this.player?.body.setVelocityY(500);
    } else {
      this.player?.body.setVelocityY(0);
    }

    if (cursorKeys.left.isDown) {
      this.player?.body.setVelocityX(-500);
    } else if (cursorKeys.right.isDown) {
      this.player?.body.setVelocityX(500);
    } else {
      this.player?.body.setVelocityX(0);
    }

    throttleUpdate({
      x: this.player?.body.position.x,
      y: this.player?.body.position.y,
      socket: this.socket,
    });
  }
}
