const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: "MainMenu",
};

export class MainMenu extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const text = this.add
      .text(screenCenterX, screenCenterY, "Play")
      .setOrigin(0.5);
    text.setInteractive();
    text.on("pointerdown", () => this.scene.start("Game"));
  }
}
