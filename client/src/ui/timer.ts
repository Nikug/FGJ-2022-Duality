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
  private timerWidth = 300;
  private activeTimers = 0;
  private timerTexts: Phaser.GameObjects.Text[] = [];
  private blueColor = this.hColor("#3264a8");
  private greenColor = this.hColor("#4ea832");
  private frameColor = this.hColor("#000000");

  private timerObjects: { blueRect: Phaser.GameObjects.Rectangle; greenRect: Phaser.GameObjects.Rectangle; frameRect: Phaser.GameObjects.Rectangle }[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public async addTimer(timeSeconds: number) {
    // Making sure scene has been created
    if (this.scene) {
      this.createTimerFrame();

      // Init
      const position = this.activeTimers;
      this.activeTimers += 1;

      // Fuck interval, for loop wins
      await this.setTimer(timeSeconds, position, this.timerObjects[position].greenRect, this.greenColor);
      await this.setTimer(timeSeconds, position, this.timerObjects[position].blueRect, this.blueColor);

      // Cleanup
      this.timerObjects[position].greenRect?.destroy();
      this.timerObjects[position].blueRect?.destroy();
      this.timerObjects[position].frameRect?.destroy();
      this.timerObjects.splice(position, 1);
      this.activeTimers -= 1;
    }
  }

  private setTimerInterval(currentTimerIndex: number, timeMS: number) {
    const totalTimeMS = timeMS;
    const intervalFreq = 500;
    const intervalId = setInterval(() => {
      // First half of timer
      if (timeMS >= 0) {
        console.log(timeMS);
        timeMS -= intervalFreq * 2;
        this.timerObjects[currentTimerIndex].greenRect?.destroy();
        this.timerObjects[currentTimerIndex].greenRect = this.scene.add.rectangle(
          this.scene.scale.width - this.timerWidth,
          100 + currentTimerIndex * 30,
          timeMS * (this.timerWidth / totalTimeMS),
          25,
          this.greenColor,
        );
        // Second half of timer
      } else {
        console.log(timeMS);
        timeMS -= intervalFreq * 2;
        this.timerObjects[currentTimerIndex].blueRect?.destroy();
        this.timerObjects[currentTimerIndex].blueRect = this.scene.add.rectangle(
          this.scene.scale.width - this.timerWidth,
          100 + currentTimerIndex * 30,
          -1 * timeMS * (this.timerWidth / totalTimeMS),
          25,
          this.blueColor,
        );
      }
    }, intervalFreq);

    return intervalId;
  }

  private createTimerFrame() {
    const blueRect = this.scene.add.rectangle(this.scene.scale.width - 300, 100, 300, 25, this.blueColor);
    const greenRect = this.scene.add.rectangle(this.scene.scale.width - 300, 100, 300, 25, this.greenColor);
    const frameRect = this.scene.add.rectangle(this.scene.scale.width - 300, 100, 300, 29);
    frameRect.setStrokeStyle(4, this.frameColor);

    this.timerObjects.push({ blueRect: blueRect, greenRect: greenRect, frameRect: frameRect });
  }

  private hColor(hexColor: string) {
    return Phaser.Display.Color.HexStringToColor(hexColor).color;
  }

  private async setTimer(timeSeconds: number, timerOrderIndex: number, currentBar: Phaser.GameObjects.Rectangle, currentBarColor: number) {
    let barWidth = this.timerWidth;

    currentBar.destroy();
    for (let i = 0; i < timeSeconds / 2; i++) {
      currentBar = this.scene.add.rectangle(this.scene.scale.width - this.timerWidth, 100 + timerOrderIndex * 30, -1 * barWidth, 25, currentBarColor);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      barWidth = this.timerWidth / ((i + 2 / timeSeconds) * timeSeconds);
      currentBar.destroy();
    }
  }
}
