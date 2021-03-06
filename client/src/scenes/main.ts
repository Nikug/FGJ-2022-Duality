import { ANIMATIONS, ONLINE_SPEED_SCALE, RESURRECT_COOLDOWN, TILEMAP } from "../constants";

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
  public resources: Game.ResourceGameObject[] = [];
  private team?: Game.Team;
  public otherPlayers: Game.PlayerSpriteObject[] = [];
  private apiPlayers?: Game.ApiPlayerState[];
  public map?: Phaser.Tilemaps.Tilemap;
  public gameState: Game.GameState;
  private audioManager: AudioManager | undefined;
  public clouds: Phaser.Types.Physics.Arcade.ImageWithDynamicBody[] = [];

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
    this.load.spritesheet(ANIMATIONS.sheets.slaps.coconut, "/assets/kritafiles/tentacle_whip_portal/whip_spritesheet.png", {
      frameWidth: 74,
      frameHeight: 64,
    });
    this.load.spritesheet(ANIMATIONS.sheets.slaps.ananas, "/assets/kritafiles/tentacle_whip_portal/whip_spritesheet.png", {
      frameWidth: 74,
      frameHeight: 64,
    });
    this.audioManager?.loadAudio();
  }

  public create() {
    this.audioManager?.addAudio();
    this.events.emit("playMusic");
    console.log("I am", this.socket?.id);
    const { map, worldLayer } = loadLevel(this);
    this.map = map;
    const randomSpawn = this.getRandomPlayerSpawn();
    this.player = new PlayerObject(this, new Phaser.Math.Vector2(randomSpawn.x, randomSpawn.y), ANIMATIONS.sheets.coconut, this.socket?.id || "", this.socket);
    this.player?.setTeam(this.team ? this.team : "coconut");
    this.generatePlayers();

    this.physics.add.collider(this.player.physicSprite, this.otherPlayers, (me, other) => {
      const upsideDown = this.isUpsideDown();
      const hunter = this.isHunter();

      const otherPlayer = other as Game.PlayerSpriteObject;

      if (hunter) {
        if (this.team !== otherPlayer.team) {
          otherPlayer.disableBody(true, true);
          this.events.emit("playEat");
          setTimeout(() => otherPlayer.enableBody(false, 0, 0, true, true), RESURRECT_COOLDOWN);
          this.socket?.emit("hunt", { hunter: this.socket?.id, hunted: otherPlayer.id });
        }
      }

      if ((!upsideDown && me.body.touching.down && other.body.touching.up) || (upsideDown && me.body.touching.up && other.body.touching.down)) {
        this.player?.resetGroundContact();
      }
    });
    this.physics.add.collider(this.otherPlayers, worldLayer);
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

  private isHunter() {
    const huntModifier = this.gameState.modifiers.find((modifier) => modifier.type === "hunt");
    return this.player?.team === huntModifier?.team;
  }

  public updateResources(resources: Game.Resource[] = []) {
    const oldResources = this.resources;

    for (let i = 0, len = oldResources.length; i < len; i++) {
      const oldResource = oldResources[i];

      oldResource.destroy();
    }

    const resourceObjects: Game.ResourceGameObject[] = [];
    const redTint = 0xff0000;

    for (let i = 0, len = resources.length; i < len; i++) {
      const resource = resources[i];
      const newResourceObject = createResource(this, new Phaser.Math.Vector2(resource.x, resource.y), 0xf5d442, resource.id);
      newResourceObject.anims.play(ANIMATIONS.sheets.resources.basic);
      if (this.isHunter()) newResourceObject.setTint(redTint);
      resourceObjects.push(newResourceObject);
    }

    this.resources = resourceObjects;

    if (!this.player) return;
    this.physics.add.overlap(this.player.physicSprite, this.resources, (pl, resource) => {
      resource.destroy();

      if (!this.player) return;

      const multiplier = this.isHunter() ? -1 : 1;

      collectResource((resource as Game.ResourceGameObject).id, multiplier, this.player.id, this.socket);
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
  }

  public async victory(team: Game.Team) {
    this.events.emit("Victory", team);
    this.events.emit("silence");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    location.reload();
  }

  public async handleHunted(hunter: string, hunted: string) {
    if (!this.player) return;

    this.events.emit("playEat");
    if (this.player.id === hunted) {
      this.player.physicSprite.disableBody(true, true);
      await new Promise((resolve) => setTimeout(resolve, RESURRECT_COOLDOWN));
      const randomSpawn = this.getRandomPlayerSpawn();
      this.player.physicSprite.enableBody(true, randomSpawn.x || 0, randomSpawn.y || 0, true, true);
      return;
    }

    const target = this.otherPlayers.find((player) => player.id === hunted);
    if (target) {
      target.disableBody(true, true);
      await new Promise((resolve) => setTimeout(resolve, RESURRECT_COOLDOWN));
      target.enableBody(false, 0, 0, true, true);
    }
  }
}
