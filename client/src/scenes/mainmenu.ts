import { playerCount, startGame } from "../util/socketUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: "MainMenu",
};

export class MainMenu extends Phaser.Scene {
  private playerCountText: Phaser.GameObjects.BitmapText | undefined;
  private buttonBackground = this.hColor("#331523");

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    this.load.image("button", "/assets/tempButton.png");
    this.load.bitmapFont("atari2", "assets/fonts/atari-classic.png", "assets/fonts/atari-classic.xml");
  }

  public create() {
    const playButton = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 300, 100, this.buttonBackground);
    playButton.setInteractive({ useHandCursor: true });
    playButton.on("pointerdown", () => startGame());

    this.add.bitmapText(this.scale.width / 2 - 128, this.scale.height / 2 - 30, "atari2", "PLAY").setScale(1);
    this.playerCountText = this.add.bitmapText(this.scale.width / 2 - 220, this.scale.height / 2 + 100, "atari2", "Getting other players..").setScale(0.5);
  }

  public setPlayerCount(playerCount: integer) {
    this.playerCountText?.setText("Player count:" + playerCount);
  }

  public startGameForEveryone() {
    this.scene.start("Game");
  }

  public update() {
    playerCount();
  }
  private hColor(hexColor: string) {
    return Phaser.Display.Color.HexStringToColor(hexColor).color;
  }
}
