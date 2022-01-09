const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

export class GameScene extends Phaser.Scene {
  private square?: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };

  constructor() {
    super(sceneConfig);
    this.square = undefined;
  }

  public create() {
    this.square = this.add.rectangle(400, 400, 100, 100, 0x00ffff) as any;

    if (this.square) {
      this.physics.add.existing(this.square);
    }
  }

  public update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();

    if (cursorKeys.up.isDown) {
      this.square?.body.setVelocityY(-500);
    } else if (cursorKeys.down.isDown) {
      this.square?.body.setVelocityY(500);
    } else {
      this.square?.body.setVelocityY(0);
    }

    if (cursorKeys.left.isDown) {
      this.square?.body.setVelocityX(-500);
    } else if (cursorKeys.right.isDown) {
      this.square?.body.setVelocityX(500);
    } else {
      this.square?.body.setVelocityX(0);
    }
  }
}
