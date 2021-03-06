const dashWav = "/assets/audio/dash.wav";
const jumpWav = "/assets/audio/jump.wav";
const collectWav = "/assets/audio/collect.wav";
const smackWav = "/assets/audio/smack.wav";
const eatWav = "/assets/audio/eat.wav";
const musicMp3 = "/assets/audio/FGJ 2022 Duality.mp3";
const musicOgg = "/assets/audio/FGJ 2022 Duality.ogg";
const menumusicMp3 = "/assets/audio/Squid in town.mp3";
const menumusicOgg = "/assets/audio/Squid in town.ogg";

/* Creates Audio Manager to use in scene
  Initialize AudioManager in scene create()
  - call loadAudio() in scene preload()
  - call addAudio() in scene create()
  - emit events from scene to use
*/

export class AudioManager {
  private scene: Phaser.Scene;
  scores: { player: string; score: number; text: Phaser.GameObjects.Text }[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  loadAudio() {
    this.scene.load.audio("dash", dashWav);
    this.scene.load.audio("collect", collectWav);
    this.scene.load.audio("jump", jumpWav);
    this.scene.load.audio("smack", smackWav);
    this.scene.load.audio("eat", eatWav);
    this.scene.load.audio("music", musicMp3, musicOgg);
    this.scene.load.audio("menumusic", menumusicMp3, menumusicOgg);
  }

  addAudio() {
    const dash = this.scene.sound.add("dash");
    const collect = this.scene.sound.add("collect", { volume: 0.25 });
    const jump = this.scene.sound.add("jump");
    const smack = this.scene.sound.add("smack");
    const eat = this.scene.sound.add("eat");
    const music = this.scene.sound.add("music", { volume: 0.25, loop: true });
    const menumusic = this.scene.sound.add("menumusic", { volume: 0.5, loop: true });

    this.scene.events.on("playCollect", () => {
      collect.play();
    });

    this.scene.events.on("playDash", () => {
      dash.play();
    });

    this.scene.events.on("playJump", () => {
      jump.play();
    });

    this.scene.events.on("playSmack", () => {
      smack.play();
    });
    this.scene.events.on("playEat", () => {
      eat.play();
    });
    this.scene.events.on("playMusic", () => {
      music.play();
    });
    this.scene.events.on("playMenuMusic", () => {
      menumusic.play();
    });
    this.scene.events.on("silence", () => {
      menumusic.stop();
      music.stop();
    });
  }
}
