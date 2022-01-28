import { MOVEMENT_SPEED, ONLINE_SPEED_SCALE } from "../constants";

import type * as Game from "../../types/types";
import type { Socket } from "socket.io-client";
import { createRectangle } from "../util/gameUtils";
import { socket } from "..";
import { throttleUpdate } from "../util/socketUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  private player?: Game.PhysicsRectangle;
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
    this.load.image("tiles", "/assets/sprites/Project Mute Tileset V3.png");
    this.load.tilemapTiledJSON("map", "/assets/maps/map.json");
  }

  public create() {
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player = createRectangle(
      this,
      new Phaser.Math.Vector2(
        this.scale.displaySize.width / 2,
        this.scale.displaySize.height / 2,
      ),
      0x00ff00,
      this.socket?.id || "",
    );

    const map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16,
    });
    const tileset = map.addTilesetImage("Project Mute Tileset V3", "tiles");
    map.createLayer("World", tileset);

    const mainCamera = this.cameras.main;
    mainCamera.setZoom(4, 4);
    mainCamera.startFollow(this.player);
    mainCamera.setLerp(0.1, 0.1);
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

    const inputVector = new Phaser.Math.Vector2();

    if (this.cursorKeys.up.isDown) {
      inputVector.y = -1;
    } else if (this.cursorKeys.down.isDown) {
      inputVector.y = 1;
    } else {
      inputVector.y = 0;
    }

    if (this.cursorKeys.left.isDown) {
      inputVector.x = -1;
    } else if (this.cursorKeys.right.isDown) {
      inputVector.x = 1;
    } else {
      inputVector.x = 0;
    }

    inputVector.normalize();
    inputVector.scale(MOVEMENT_SPEED);

    this.player.body.setVelocity(inputVector.x, inputVector.y);

    throttleUpdate({
      x: this.player.body.position.x,
      y: this.player.body.position.y,
      socket: this.socket,
    });
  }
}
