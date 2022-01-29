import scoreboardImage from "/assets/scoreboard/scoreboard.png";

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
  scores: { player: string; score: number; text: Phaser.GameObjects.Text }[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public loadImages() {
    this.scene.load.image("scoreboard", scoreboardImage);
  }

  public addScoreBoard() {
    this.scene.add.image(250, 200, "scoreboard");
  }

  public addScore(player: string, score: number) {
    // If player not in list
    if (!this.scores.some((item) => item.player === player)) {
      console.log("Push");
      this.scores.push({
        player: player,
        score: score,
        text: this.scene.add.text(125, 200 + this.scores.length * 50, `Player: ${player}, Score: ${score}`),
      });
    } else {
      for (let i = 0; i < this.scores.length; i++) {
        if (this.scores[i].player === player) {
          this.scores[i].score += score;
          this.scores[i].text.destroy();
          this.scores[i].text = this.scene.add.text(125, 200 + i * 50, `Player: ${player}, Score: ${this.scores[i].score}`);
        }
      }
    }
  }
}
