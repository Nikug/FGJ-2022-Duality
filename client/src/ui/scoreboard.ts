/* Creates UI Scoreboard
    Usage:
        - create new Timer() in scene constructor
        - call timer.loadImages() in scene preload
        - call timer.addScoreBoard() in create
        - call timer.addScore(player, score) whenever needed
        - debug as needed :]
*/
export class Scoreboard {
  private scene: Phaser.Scene;
  private scoreBoardX = 32;
  private scoreBoardY = 32;
  private scoreBoardMarginX = 10;
  private scoreBoardMarginY = 20;
  private backgroundColor: number = this.hColor("#331523");

  scores: { player: string; score: number; text: Phaser.GameObjects.BitmapText }[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public addScoreBoard() {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(this.backgroundColor, 0.9);
    graphics.fillRoundedRect(this.scoreBoardX, this.scoreBoardY, 250, 80, 16);
    this.scene.add.bitmapText(this.scoreBoardX + this.scoreBoardMarginX + 65, this.scoreBoardY + 5, "uifont", "SCORES").setScale(0.25);
  }

  public addScore(player: string, score: number) {
    // If player not in list
    if (!this.scores.some((item) => item.player === player)) {
      console.log("Push");
      this.scores.push({
        player: player,
        score: score,
        text: this.getScoreText(score, player),
      });
    } else {
      for (let i = 0; i < this.scores.length; i++) {
        if (this.scores[i].player === player) {
          this.scores[i].score += score;
          this.scores[i].text.destroy();
          this.scores[i].text = this.getScoreText(score, player);
        }
      }
    }
  }
  private hColor(hexColor: string) {
    return Phaser.Display.Color.HexStringToColor(hexColor).color;
  }

  private getScoreText(score: number, team: string) {
    return this.scene.add
      .bitmapText(this.scoreBoardX + this.scoreBoardMarginX, this.scoreBoardY + 30 + this.scores.length * this.scoreBoardMarginY, "uifont", `${team}: ${score}`)
      .setScale(0.25);
  }
}
