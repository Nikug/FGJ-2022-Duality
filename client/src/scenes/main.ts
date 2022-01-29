import { ANIMATIONS, ONLINE_SPEED_SCALE, TILEMAP } from "../constants";

import type * as Game from "../../types/types";
import type { Socket } from "socket.io-client";
import { createPlayer, createResource } from "../util/gameUtils";
import { socket } from "..";
import { loadLevel } from "../util/sceneUtils";
import { animationController, createAllAnimations } from "../util/characterUtils";
import { PlayerObject } from "../classes/Player";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  public player?: PlayerObject;
  private socket?: Socket;
  private resources: Game.ResourceGameObject[] = [];
  public otherPlayers: Game.PlayerSpriteObject[] = [];
  public map?: Phaser.Tilemaps.Tilemap;

  constructor() {
    super(sceneConfig);
    this.player = undefined;
    this.socket = socket;
    this.map = undefined;
  }

  public preload() {
    this.load.image("ground", "assets/platform.png");
    this.load.image(TILEMAP.tilesets.purple.key, "/assets/sprites/Project Mute Tileset V3.png");
    this.load.image(TILEMAP.tilesets.yellow.key, "/assets/sprites/Project Mute Tileset V1.png");
    this.load.image(TILEMAP.tilesets.gray.key, "/assets/sprites/Project Mute Tileset V2.png");
    this.load.tilemapTiledJSON("map", "/assets/maps/map.json");
    this.load.spritesheet(ANIMATIONS.sheets.blue, "/assets/kritafiles/player_blue/player_blue_spritesheet.png", { frameWidth: 14, frameHeight: 14 });
    this.load.spritesheet(ANIMATIONS.sheets.green, "/assets/kritafiles/player_green/player_green_spritesheet.png", { frameWidth: 14, frameHeight: 14 });
  }

  public create() {
    this.player = new PlayerObject(this, new Phaser.Math.Vector2(128, 64), ANIMATIONS.sheets.blue, this.socket?.id || "", this.socket);
    this.physics.add.collider(this.player.physicSprite, this.otherPlayers, (me, other) => {
      if (me.body.touching.down && other.body.touching.up) {
        this.player?.resetGroundContact();
      }
    });

    this.map = loadLevel(this);
    createAllAnimations(this);

    const mainCamera = this.cameras.main;
    mainCamera.setZoom(2, 2);
    mainCamera.startFollow(this.player.physicSprite);
    mainCamera.setLerp(0.05, 0.05);
    mainCamera.roundPixels = true;

    if (this.otherPlayers.length === 0) {
      socket.emit("initResources");
    }
  }

  public initPlayers(players: Game.ApiPlayerState[]) {
    for (const player of players) {
      if (player.id === this.socket?.id) continue;
      this.addPlayer(player);
    }
  }

  public addPlayer(newPlayer: Game.ApiPlayerState) {
    const newPlayerObject = createPlayer(this, new Phaser.Math.Vector2(newPlayer.x, newPlayer.y), ANIMATIONS.sheets.green, newPlayer.id);
    this.otherPlayers.push(newPlayerObject);
  }

  public getPushed(direction: Phaser.Math.Vector2) {
    if (!this.player) return;
    this.player.getPushed(direction);
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

  public update(time: number, delta: number) {
    if (!this.player) return;
    animationController(this);
    this.player.checkActions(delta);
  }

  public updateResources(resources: Game.Resource[] = []) {
    const oldResources = this.resources;

    for (let i = 0, len = oldResources.length; i < len; i++) {
      const oldResource = oldResources[i];

      oldResource.destroy();
    }

    const resourceObjects: Game.ResourceGameObject[] = [];

    for (let i = 0, len = resources.length; i < len; i++) {
      const resource = resources[i];
      const newResourceObject = createResource(this, new Phaser.Math.Vector2(resource.x, resource.y), 0xf5d442, resource.id);
      resourceObjects.push(newResourceObject);
    }

    this.resources = resourceObjects;
  }

  public sendResourceLocations(socket: Socket) {
    const resourceLayer = this.map?.getObjectLayer(TILEMAP.spawns.resource);
    const resourceObjects = resourceLayer?.objects;

    const resourceLocations = resourceObjects?.map((resourceObj) => {
      const { x, y, type, id } = resourceObj;

      return { x, y, type, id: id.toString() };
    });

    socket.emit("sendResourceLocations", resourceLocations);
  }
}
