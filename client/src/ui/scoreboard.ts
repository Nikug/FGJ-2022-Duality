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
  private headerStyle: Phaser.Types.GameObjects.Text.TextStyle = { fontFamily: "Impact", fontSize: "20px", color: "white" };
  private scoreStyle: Phaser.Types.GameObjects.Text.TextStyle = { fontFamily: "Impact", fontSize: "14px", color: "white" };
  private backgroundColor: number = this.hColor("#af0098");

  scores: { player: string; score: number; text: Phaser.GameObjects.Text }[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public addScoreBoard() {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(this.backgroundColor, 0.9);
    graphics.fillRoundedRect(this.scoreBoardX, this.scoreBoardY, 200, 80, 16);
    this.scene.add.text(this.scoreBoardX + this.scoreBoardMarginX + 55, this.scoreBoardY, `SCORES`, this.headerStyle).setResolution(10);
    //this.scene.add.text(400, 8, "Phaser 3 pixelArt: true", { font: "16px Courier", color: "#00ff00" }).setOrigin(0.5, 0).setScale(3);
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

  private getScoreText(score: number, player: string) {
    return this.scene.add.text(
      this.scoreBoardX + this.scoreBoardMarginX,
      this.scoreBoardY + 30 + this.scores.length * this.scoreBoardMarginY,
      `Player: ${player}, Score: ${score}`,
      this.scoreStyle,
    );
  }
}
