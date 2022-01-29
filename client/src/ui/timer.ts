import emptyTimerImage from "/assets/timer/emptyTimer.png";
import quarterTimerImage from "/assets/timer/quarterTimer.png";
import halfTimerImage from "/assets/timer/halfTimer.png";
import fullTimerImage from "/assets/timer/fullTimer.png";
import type { GameObjects } from "phaser";

/* Creates UI Timer
    Usage:
        - create new Timer() in scene constructor
        - call timer.loadImages() in scene preload
        - call timer.addTimer(seconds) whenver needed
        - debug as needed :]
*/

export class Timer {
  private scene: Phaser.Scene;
  private timerHeight = 50;
  private activeTimers = 0;
  private timerTexts: Phaser.GameObjects.Text[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public loadImages() {
    this.scene.load.image("emptyTimer", emptyTimerImage);
    this.scene.load.image("quarterTimer", quarterTimerImage);
    this.scene.load.image("halfTimer", halfTimerImage);
    this.scene.load.image("fullTimer", fullTimerImage);
  }

  public async addTimer(timeSeconds: number) {
    // Making sure scene has been created
    if (this.scene) {
      // Init
      const timeMS = timeSeconds * 1000;
      this.activeTimers += 1;

      // Timer order in contrast to other timers
      const position = this.activeTimers;

      // Set countdown
      const intervalId = this.setTimerInterval(position, timeSeconds);

      // Set timer images when appropriate
      await this.setNextTimerImage("fullTimer", timeMS / 2, position);
      await this.setNextTimerImage("halfTimer", timeMS / 4, position);
      await this.setNextTimerImage("quarterTimer", timeMS / 4, position);

      // Cleanup
      this.activeTimers -= 1;
      clearInterval(intervalId);
      this.timerTexts[position].destroy();
    }
  }

  private async setNextTimerImage(imageName: string, time: number, timerOrderNumber: number) {
    const image = this.scene.add.image(this.scene.scale.width - 300, this.timerHeight * timerOrderNumber, imageName);
    await new Promise((resolve) => setTimeout(resolve, time));
    image.destroy();
  }

  private setTimerInterval(timeOrderNumber: number, timeSeconds: number) {
    const timerPosY = timeOrderNumber * 50;
    const timerPosX = this.scene.scale.width - 520;
    let timerText: GameObjects.Text | null = null;

    const intervalId = setInterval(() => {
      if (timerText) {
        timerText.destroy();
      }

      timerText = this.scene.add.text(timerPosX, timerPosY, timeSeconds.toString(), { font: '"Press Start 2P"', fontSize: "28px" });
      this.timerTexts[timeOrderNumber] = timerText;
      timeSeconds -= 1;
    }, 1000);

    return intervalId;
  }
}
