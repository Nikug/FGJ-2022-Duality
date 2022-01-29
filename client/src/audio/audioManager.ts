const dashWav = "/assets/audio/dash.wav";
const jumpWav = "/assets/audio/jump.wav";
const collectWav = "/assets/audio/collect.wav";
const smackWav = "/assets/audio/smack.wav";
const musicMp3 = "/assets/audio/FGJ 2022 Duality.mp3";

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
    this.scene.load.audio("music", musicMp3);
  }

  addAudio() {
    const dash = this.scene.sound.add("dash");
    const collect = this.scene.sound.add("collect", { volume: 0.25 });
    const jump = this.scene.sound.add("jump");
    const smack = this.scene.sound.add("smack");
    const music = this.scene.sound.add("music", { volume: 0.25, loop: true });

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
    this.scene.events.on("create", () => {
      music.play();
    });
  }
}
