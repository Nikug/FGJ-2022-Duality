import type { Team } from "../../types/types";

export class VictoryNotification {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public async showVictory(team: Team) {
    const victoryRectangle = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      this.scene.scale.width,
      this.scene.scale.height,
      0o000000,
      0.65,
    );
    const victoryText = this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height / 2, team + " wins!");

    await new Promise((resolve) => setTimeout(resolve, 5000));

    victoryRectangle.destroy();
    victoryText.destroy();
  }
}
