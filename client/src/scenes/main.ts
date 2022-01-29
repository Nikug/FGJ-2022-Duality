import { ANIMATIONS, ONLINE_SPEED_SCALE, TILEMAP } from "../constants";

import type * as Game from "../../types/types";
import type { Socket } from "socket.io-client";
import { applyModifiers, createPlayer, createResource, oppositeTeam } from "../util/gameUtils";
import { socket } from "..";
import { loadLevel } from "../util/sceneUtils";
import { animationController, createAllAnimations } from "../util/characterUtils";
import { PlayerObject } from "../classes/Player";
import getRandomNumber from "../util/getRandomNumber";
import { collectResource } from "../util/socketUtils";
import { AudioManager } from "../audio/audioManager";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  public player?: PlayerObject;
  private socket?: Socket;
  private resources: Game.ResourceGameObject[] = [];
  private team?: Game.Team;
  public otherPlayers: Game.PlayerSpriteObject[] = [];
  private apiPlayers?: Game.ApiPlayerState[];
  public map?: Phaser.Tilemaps.Tilemap;
  public gameState: Game.GameState;
  private audioManager: AudioManager | undefined;

  constructor() {
    super(sceneConfig);
    this.player = undefined;
    this.socket = socket;
    this.map = undefined;
    this.gameState = { modifiers: [] };
    this.audioManager = new AudioManager(this);
  }

  public preload() {
    this.load.image("ground", "assets/platform.png");
    this.load.image("clouds", "/assets/kritafiles/clous_squid.png");
    this.load.image("clouds2", "/assets/kritafiles/clous_squid_2.png");
    this.load.image(TILEMAP.tilesets.purple.key, "/assets/sprites/Project Mute Tileset V3.png");
    this.load.image(TILEMAP.tilesets.yellow.key, "/assets/sprites/Project Mute Tileset V1.png");
    this.load.image(TILEMAP.tilesets.gray.key, "/assets/sprites/Project Mute Tileset V2.png");
    this.load.tilemapTiledJSON("map", "/assets/maps/map.json");
    this.load.spritesheet(ANIMATIONS.sheets.coconut, "/assets/kritafiles/player_blue/player_blue_spritesheet.png", { frameWidth: 14, frameHeight: 14 });
    this.load.spritesheet(ANIMATIONS.sheets.ananas, "/assets/kritafiles/player_green/player_green_spritesheet.png", { frameWidth: 14, frameHeight: 14 });
    this.load.spritesheet(ANIMATIONS.sheets.resources.basic, "/assets/kritafiles/resource/resource_basic_spritesheet.png", { frameWidth: 12, frameHeight: 12 });
    this.load.spritesheet(ANIMATIONS.sheets.slaps.coconut, "/assets/kritafiles/whip_demo_2/whip_sprite_sheet_demo.png", { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet(ANIMATIONS.sheets.slaps.ananas, "assets/kritafiles/whip_demo_2/whip_sprite_sheet_demo.png", { frameWidth: 64, frameHeight: 64 });
    this.audioManager?.loadAudio();
  }

  public create() {
    this.audioManager?.addAudio();
    console.log("I am", this.socket?.id);
    const { map, worldLayer } = loadLevel(this);
    this.map = map;
    const randomSpawn = this.getRandomPlayerSpawn();
    this.player = new PlayerObject(this, new Phaser.Math.Vector2(randomSpawn.x, randomSpawn.y), ANIMATIONS.sheets.coconut, this.socket?.id || "", this.socket);
    this.player?.setTeam(this.team ? this.team : "coconut");
    this.generatePlayers();
    this.physics.add.collider(this.player.physicSprite, this.otherPlayers, (me, other) => {
      const upsideDown = this.isUpsideDown();
      if ((!upsideDown && me.body.touching.down && other.body.touching.up) || (upsideDown && me.body.touching.up && other.body.touching.down)) {
        this.player?.resetGroundContact();
      }
    });
    this.physics.add.collider(this.player.physicSprite, worldLayer);
    this.cameras.main.startFollow(this.player.physicSprite);

    createAllAnimations(this);

    const mainCamera = this.cameras.main;
    mainCamera.setZoom(2, 2);
    mainCamera.setLerp(0.05, 0.05);
    mainCamera.roundPixels = true;
  }

  public initPlayers(players: Game.ApiPlayerState[]) {
    const pl = players.find((play) => play.id === this.socket?.id);
    this.team = pl?.team;
    this.apiPlayers = players;
  }
  private generatePlayers() {
    if (!this.apiPlayers) return;
    for (const player of this.apiPlayers) {
      if (player.id === this.socket?.id) {
        this.team = player.team;
        continue;
      }
      this.addPlayer(player);
    }
  }

  public addPlayer(newPlayer: Game.ApiPlayerState) {
    if (this.otherPlayers.some((player) => player.id === newPlayer.id)) return;
    const newPlayerObject = createPlayer(this, newPlayer);
    this.otherPlayers.push(newPlayerObject);
  }

  public getPushed(slapperId: string, targetId: string, direction: Phaser.Math.Vector2) {
    if (!this.player) return;
    this.player.getPushed(slapperId, targetId, direction);
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
    this.player.checkActions(delta, this.isUpsideDown());
  }

  private isUpsideDown() {
    const gravityModifier = this.gameState.modifiers.find((modifier) => modifier.type === "gravity");
    return this.player?.team === gravityModifier?.team;
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
      newResourceObject.anims.play(ANIMATIONS.sheets.resources.basic);
      resourceObjects.push(newResourceObject);
    }

    this.resources = resourceObjects;

    if (!this.player) return;
    this.physics.add.overlap(this.player.physicSprite, this.resources, (pl, resource) => {
      resource.destroy();

      if (!this.player) return;

      collectResource((resource as Game.ResourceGameObject).id, this.player.id, this.socket);
      this.events.emit("playCollect");
    });
  }

  public sendResourceLocations(socket: Socket) {
    (async () => {
      while (!this.map)
        // define the condition as you like
        await new Promise((resolve) => setTimeout(resolve, 100));
      const resourceLayer = this.map?.getObjectLayer(TILEMAP.spawns.resource);
      const resourceObjects = resourceLayer?.objects;

      const resourceLocations = resourceObjects?.map((resourceObj) => {
        const { x, y, type, id } = resourceObj;

        return { x, y, type, id: id.toString() };
      });

      socket.emit("sendResourceLocations", resourceLocations);
    })();
  }

  public setModifiers(modifiers: Game.Modifier[]) {
    const oldModifiers = [...this.gameState.modifiers];
    this.gameState.modifiers = modifiers;
    applyModifiers(this, modifiers, oldModifiers);
  }

  public reverseModifierTeam(type: string) {
    this.gameState.modifiers = this.gameState.modifiers.map((modifier) =>
      modifier.type === type ? { ...modifier, team: oppositeTeam(modifier.team) } : modifier,
    );
  }

  public getRandomPlayerSpawn() {
    // (async () => {
    //   while (!this.map) await new Promise((resolve) => setTimeout(resolve, 100));
    const playerSpawnLayer = this.map?.getObjectLayer(TILEMAP.spawns.player);
    const playerSpawnsObjects = playerSpawnLayer?.objects;
    const playerSpawnLocations = playerSpawnsObjects?.map((playerSpawnObj) => {
      const { x, y, type, id } = playerSpawnObj;
      return { x, y, type, id: id.toString() };
    });
    if (!playerSpawnLocations) {
      return { x: 128, y: 64 };
    }
    const randomSpawn = playerSpawnLocations[getRandomNumber(0, playerSpawnLocations.length)];
    return randomSpawn;
    // })();
  }
}
