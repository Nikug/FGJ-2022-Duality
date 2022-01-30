import { AudioManager } from "../audio/audioManager";
import { playerCount, startGame } from "../util/socketUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: "MainMenu",
};

export class MainMenu extends Phaser.Scene {
  private playerUpdateInterval?: NodeJS.Timer;
  private playerCountText: Phaser.GameObjects.BitmapText | undefined;
  private buttonBackground = this.hColor("#331523");
  private audioManager: AudioManager | undefined;

  constructor() {
    super(sceneConfig);
    this.audioManager = new AudioManager(this);
  }

  public preload() {
    this.load.image("button", "/assets/tempButton.png");
    this.audioManager?.loadAudio();
    this.load.bitmapFont("atari", "assets/fonts/atari-classic2.png", "assets/fonts/atari-classic2.xml");
  }

  public create() {
    const playButton = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 300, 100, this.buttonBackground);
    playButton.setInteractive({ useHandCursor: true });
    playButton.on("pointerdown", () => startGame());
    this.add.bitmapText(this.scale.width / 2 - 128, this.scale.height / 2 - 30, "atari", "PLAY").setScale(1);
    this.playerCountText = this.add.bitmapText(this.scale.width / 2 - 220, this.scale.height / 2 + 100, "atari", "Getting other players..").setScale(0.5);

    this.playerUpdateInterval = setInterval(() => {
      playerCount();
    }, 500);
    this.audioManager?.addAudio();
    this.events.emit("playMenuMusic");
  }

  public shutdown() {
    if (this.playerUpdateInterval) {
      clearInterval(this.playerUpdateInterval);
    }
  }

  public setPlayerCount(playerCount: integer) {
    this.playerCountText?.setText("Player count:" + playerCount);
  }

  public startGameForEveryone() {
    this.events.emit("silence");
    this.scene.start("Game");
    this.scene.start("UIScene");
  }

  private hColor(hexColor: string) {
    return Phaser.Display.Color.HexStringToColor(hexColor).color;
  }
}
