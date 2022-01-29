import { playerCount, startGame } from "../util/socketUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: "MainMenu",
};

export class MainMenu extends Phaser.Scene {
  private playerCountText: Phaser.GameObjects.Text | undefined;
  private playerUpdateInterval?: NodeJS.Timer;

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    this.load.image("button", "/assets/tempButton.png");
  }

  public create() {
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const playButton = this.add.image(screenCenterX, screenCenterY, "button").setOrigin(0.5);
    playButton.setInteractive();
    playButton.on("pointerdown", () => startGame());

    this.playerCountText = this.add
      .text(screenCenterX * 1.5, screenCenterY / 2, "Player count:1", {
        font: "20px",
        color: "#000000",
      })
      .setOrigin(0.5);

    this.playerUpdateInterval = setInterval(() => {
      playerCount();
    }, 500);
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
    this.scene.start("Game");
  }
}
