import {
  CAN_JUMP_DURATION,
  CAN_PUSH_TIMEOUT_DURATION,
  DASH_CANT_MOVE_DURATION,
  DASH_TIMEOUT_DURATION,
  DASH_VELOCITY,
  JUMP_VELOCITY,
  MOVEMENT_SPEED,
  ONLINE_SPEED_SCALE,
  PLAYER_GRAVITY,
  PLAYER_PUSH_DISTANCE,
  PLAYER_PUSH_POWER,
  PUSH_TIMEOUT_DURATION,
  TILEMAP,
} from "../constants";

import type * as Game from "../../types/types";
import type { Socket } from "socket.io-client";
import { createRectangle } from "../util/gameUtils";
import { socket } from "..";
import { loadLevel } from "../util/sceneUtils";
import { addModifier, pushPlayer, throttleUpdate } from "../util/socketUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  public player?: Game.PhysicsRectangle;
  private socket?: Socket;
  private otherPlayers: Game.PlayerGameObject[] = [];
  public map?: Phaser.Tilemaps.Tilemap;

  private cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
  private canMove = true;
  private disabledTime = 0;
  private canPush = true;
  private timeFromGroundContact = 0;
  private timeFromDash = 0;

  constructor() {
    super(sceneConfig);
    this.player = undefined;
    this.socket = socket;
    this.cursorKeys = undefined;
    this.map = undefined;
  }

  public preload() {
    this.load.image("ground", "assets/platform.png");
    this.load.image(TILEMAP.tilesets.purple.key, "/assets/sprites/Project Mute Tileset V3.png");
    this.load.image(TILEMAP.tilesets.yellow.key, "/assets/sprites/Project Mute Tileset V1.png");
    this.load.image(TILEMAP.tilesets.gray.key, "/assets/sprites/Project Mute Tileset V2.png");
    this.load.tilemapTiledJSON("map", "/assets/maps/map.json");
  }

  public create() {
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player = createRectangle(this, new Phaser.Math.Vector2(128, 64), 0x00ff00, this.socket?.id || "");

    this.player.body.setGravityY(PLAYER_GRAVITY);
    this.physics.add.collider(this.player, this.otherPlayers);

    this.map = loadLevel(this);

    const mainCamera = this.cameras.main;
    mainCamera.setZoom(2, 2);
    mainCamera.startFollow(this.player);
    mainCamera.setLerp(0.05, 0.05);
    mainCamera.roundPixels = true;
  }

  public initPlayers(players: Game.ApiPlayerState[]) {
    for (const player of players) {
      if (player.id === this.socket?.id) continue;
      this.addPlayer(player);
    }
  }

  public addPlayer(newPlayer: Game.ApiPlayerState) {
    const newPlayerObject = createRectangle(this, new Phaser.Math.Vector2(newPlayer.x, newPlayer.y), 0xff00ff, newPlayer.id);
    this.otherPlayers.push(newPlayerObject);
  }

  private pushPlayers() {
    const pos = this.player?.body.position;
    if (pos) {
      this.otherPlayers.forEach((pl) => {
        const pl_pos = pl.body.position;
        if (pl_pos.distance(pos) < PLAYER_PUSH_DISTANCE) {
          pushPlayer(pl.id, new Phaser.Math.Vector2(pl_pos.x - pos.x, pl_pos.y - pos.y).normalize(), this.socket);
        }
      });
    }
  }

  public getPushed(direction: Phaser.Math.Vector2) {
    this.canMove = false;

    if (this.player) {
      this.player.body.setVelocityX(direction.x * PLAYER_PUSH_POWER);
      this.player.body.setVelocityY(direction.y * PLAYER_PUSH_POWER);
    }
    this.disabledTime = PUSH_TIMEOUT_DURATION;
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

      const gameObject = this.otherPlayers.find((otherPlayer) => otherPlayer.id === player.id);

      if (!gameObject) continue;

      const difference = gameObject.body.position.clone().subtract({
        x: player.x,
        y: player.y,
      });
      difference.scale(ONLINE_SPEED_SCALE);
      gameObject.body.setVelocity(-difference.x, -difference.y);
    }
  };

  public checkMovement() {
    if (!this.cursorKeys) return;
    if (!this.player) return;
    if (!this.canMove) return;

    if (this.cursorKeys.left.isDown) {
      this.player.body.setVelocityX(-MOVEMENT_SPEED);
    } else if (this.cursorKeys.right.isDown) {
      this.player.body.setVelocityX(MOVEMENT_SPEED);
    } else {
      this.player.body.setVelocityX(0);
    }

    if (this.cursorKeys.space.isDown && this.canPush) {
      this.canPush = false;
      this.pushPlayers();
      setTimeout(() => {
        this.canPush = true;
      }, CAN_PUSH_TIMEOUT_DURATION);
    }
  }

  public checkJump(delta: number) {
    if (!this.cursorKeys) return;
    if (!this.player) return;
    if (!this.canMove) return;

    if (this.player.body.onFloor()) {
      this.timeFromGroundContact = CAN_JUMP_DURATION;
    } else if (this.timeFromGroundContact > 0) {
      this.timeFromGroundContact -= delta;
    }

    if (this.cursorKeys.up.isDown && this.timeFromGroundContact > 0) {
      this.player.body.setVelocityY(-JUMP_VELOCITY);

      if (this.socket) {
        addModifier("New Modifier", 5, this.socket);
      }

      this.timeFromGroundContact = 0;
    }
  }
  public checkDash(delta: number) {
    if (!this.cursorKeys) return;
    if (!this.player) return;
    if (!this.canMove) return;

    if (this.timeFromDash > 0) {
      this.timeFromDash -= delta;
    }

    if (this.cursorKeys.shift.isDown && this.timeFromDash <= 0) {
      if (this.player.body.velocity.x < 0) {
        this.player.body.setVelocityX(-DASH_VELOCITY);
      } else {
        this.player.body.setVelocityX(DASH_VELOCITY);
      }
      this.canMove = false;
      this.disabledTime = DASH_CANT_MOVE_DURATION;
      this.timeFromDash = DASH_TIMEOUT_DURATION;
    }
  }

  public update(time: number, delta: number) {
    if (!this.player) return;
    if (this.disabledTime > 0) {
      this.disabledTime -= delta;
    } else if (!this.canMove) {
      this.canMove = true;
    }
    this.checkMovement();
    this.checkJump(delta);
    this.checkDash(delta);

    throttleUpdate({
      x: this.player.body.position.x,
      y: this.player.body.position.y,
      socket: this.socket,
    });
  }

  public sendResourceLocations(socket: Socket) {
    const resourceLocations = this.map?.findObject("ResourceSpawn", (obj) => obj);
    console.log({ resourceLocations });

    // placeholder
    // const resourceLocations = [
    //   {
    //     x: 120,
    //     y: 120,
    //   },
    //   {
    //     x: 110,
    //     y: 90,
    //   },
    //   {
    //     x: 234,
    //     y: 213,
    //   },
    // ];

    socket.emit("sendResourceLocations", resourceLocations);
  }
}
