import type { Score } from "../../types/types";
import type { UIScene } from "../scenes/uiScene";

/* Creates UI Scoreboard
    Usage:
      - I dont even know at this point
        - debug as needed :]
*/
export class Scoreboard {
  private scene: UIScene;
  private scoreBoardX = 32;
  private scoreBoardY = 32;
  private scoreBoardMarginX = 10;
  private scoreBoardMarginY = 20;
  private backgroundColor: number = this.hColor("#331523");
  private scoresText1: Phaser.GameObjects.BitmapText | undefined;
  private scoresText2: Phaser.GameObjects.BitmapText | undefined;

  scores: { player: string; score: number; text: Phaser.GameObjects.BitmapText }[] = [];

  constructor(scene: UIScene) {
    this.scene = scene;
  }

  public addScoreBoard() {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(this.backgroundColor, 0.9);
    graphics.fillRoundedRect(this.scoreBoardX, this.scoreBoardY, 250, 100, 16);
    this.scene.add.bitmapText(this.scoreBoardX + this.scoreBoardMarginX + 65, this.scoreBoardY + 5, "atari", "SCORES").setScale(0.25);
    this.scoresText1 = this.scene.add.bitmapText(this.scoreBoardX + this.scoreBoardMarginX, this.scoreBoardY + 30, "atari", `Ananas: 0`).setScale(0.25);
    this.scoresText2 = this.scene.add
      .bitmapText(this.scoreBoardX + this.scoreBoardMarginX, this.scoreBoardY + 30 + this.scoreBoardMarginY, "atari", `Coconut: 0`)
      .setScale(0.25);
    this.scene.add
      // Magical numbers to put text in right place. I know. Magic is cool right? And if that's not your thing, call it a science.
      .bitmapText(this.scoreBoardX - 65 + this.scoreBoardMarginX + 65, this.scoreBoardY + 100 - 15, "atari", `FIRST TO ${this.scene.WIN_POINTS} WINS!`)
      .setScale(0.2);
  }

  public addScore(Score: Score) {
    this.scoresText1?.setText(`Ananas: ${Score.ananas}`);
    this.scoresText2?.setText(`Coconut: ${Score.coconut}`);
  }
  private hColor(hexColor: string) {
    return Phaser.Display.Color.HexStringToColor(hexColor).color;
  }
}
