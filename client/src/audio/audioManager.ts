import jungleOGG from "/assets/audio/public_assets_audio_jungle.ogg";
import jungleMP3 from "/assets/audio/public_assets_audio_jungle.mp3";

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
    this.scene.load.audio("jungle", jungleOGG, jungleMP3);
  }

  addAudio() {
    const jungle = this.scene.sound.add("jungle");

    this.scene.events.on("playJungle", () => {
      console.log("event");
      jungle.play();
    });
  }
}
