import type { Team } from "../../types/types";

/* Creates UI Timer
    Usage:
        - create new Timer() in scene constructor
        - call timer.loadImages() in scene preload
        - call timer.addTimer(seconds) whenver needed
        - debug as needed :]
*/
export class Timer {
  private scene: Phaser.Scene;
  private timerHeight = 25;
  private timerFrameSize = 4;
  private timerWidth = 300;
  private timerOffsetX = 300;
  private timerOffsetY = 100;
  private timerPaddingY = 35;
  private activeTimers = 0;
  private blueColor = this.hColor("#3264a8");
  private greenColor = this.hColor("#4ea832");
  private frameColor = this.hColor("#000000");

  private timerObjects: {
    blueRect: Phaser.GameObjects.Rectangle;
    greenRect: Phaser.GameObjects.Rectangle;
    frameRect: Phaser.GameObjects.Rectangle;
    emojiLeft: Phaser.GameObjects.Image;
    emojiRight: Phaser.GameObjects.Image;
  }[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public async addTimer(timeSeconds: number, team: Team, type: string) {
    // Making sure scene has been created
    if (this.scene) {
      // Init
      const position = this.activeTimers;
      this.activeTimers += 1;

      // Fuck interval, for loop wins
      let emojiLeftName, emojiRightName, animationRightName, animationLeftName;
      if (type === "gravity") {
        emojiLeftName = "upsideDownNormalSheet";
        emojiRightName = "upsideDownUpsideDownSheet";
        animationLeftName = "upsideDownNormal";
        animationRightName = "upsideDownUpsideDown";
      } else if (type === "bigsmall") {
        emojiLeftName = "bigSheet";
        emojiRightName = "smallSheet";
        animationLeftName = "big";
        animationRightName = "small";
      } else if (type === "hunt") {
        emojiLeftName = "hunterSheet";
        emojiRightName = "preySheet";
        animationLeftName = "hunter";
        animationRightName = "prey";
      } else {
        // Default
        emojiLeftName = "bigSheet";
        emojiRightName = "smallSheet";
        animationLeftName = "big";
        animationRightName = "small";
      }

      const newFrame = this.createTimerFrame(team, position, emojiLeftName, emojiRightName, animationRightName, animationLeftName);

      if (team === "ananas") {
        await this.setTimer(timeSeconds, position, newFrame.greenRect, this.greenColor);
        await this.setTimer(timeSeconds, position, newFrame.blueRect, this.blueColor);
      } else if (team === "coconut") {
        await this.setTimer(timeSeconds, position, newFrame.blueRect, this.blueColor);
        await this.setTimer(timeSeconds, position, newFrame.greenRect, this.greenColor);
      }

      // Cleanup
      newFrame.greenRect.destroy();
      newFrame.blueRect.destroy();
      newFrame.frameRect.destroy();
      newFrame.emojiLeft.destroy();
      newFrame.emojiRight.destroy();

      this.activeTimers = this.activeTimers - 1;
    }
  }

  private createTimerFrame(team: Team, position: number, emojiLeftName: string, emojiRightName: string, animationLeftName: string, animationRightName: string) {
    // This just gets one in front of other, could use just another func for it aaa
    let blueRect, greenRect;
    if (team === "ananas") {
      greenRect = this.scene.add.rectangle(
        this.scene.scale.width - this.timerOffsetX,
        this.timerOffsetY + position * this.timerPaddingY,
        this.timerWidth,
        this.timerHeight,
        this.greenColor,
      );
      blueRect = this.scene.add.rectangle(
        this.scene.scale.width - this.timerOffsetX,
        this.timerOffsetY + position * this.timerPaddingY,
        this.timerWidth,
        this.timerHeight,
        this.blueColor,
      );
    } else {
      blueRect = this.scene.add.rectangle(
        this.scene.scale.width - this.timerOffsetX,
        this.timerOffsetY + position * this.timerPaddingY,
        this.timerWidth,
        this.timerHeight,
        this.blueColor,
      );
      greenRect = this.scene.add.rectangle(
        this.scene.scale.width - this.timerOffsetX,
        this.timerOffsetY + position * this.timerPaddingY,
        this.timerWidth,
        this.timerHeight,
        this.greenColor,
      );
    }

    const frameRect = this.scene.add.rectangle(
      this.scene.scale.width - this.timerOffsetX,
      this.timerOffsetY + position * this.timerPaddingY,
      this.timerWidth,
      this.timerHeight + this.timerFrameSize,
    );
    frameRect.setStrokeStyle(this.timerFrameSize, this.frameColor);

    const emojiLeft = this.scene.add.sprite(
      this.scene.scale.width - this.timerOffsetX - this.timerWidth / 2 - 16 - this.timerFrameSize,
      this.timerOffsetY + position * this.timerPaddingY,
      emojiLeftName,
    );
    emojiLeft.play(animationLeftName);
    const emojiRight = this.scene.add.sprite(
      this.scene.scale.width - this.timerOffsetX + this.timerWidth / 2 + 16 + this.timerFrameSize,
      this.timerOffsetY + position * this.timerPaddingY,
      emojiRightName,
    );
    emojiRight.play(animationRightName);

    /*
    const emojiLeft = this.scene.add.image(
      // 16 = half emoji size
      this.scene.scale.width - this.timerOffsetX - this.timerWidth / 2 - 16 - this.timerFrameSize,
      this.timerOffsetY + position * this.timerPaddingY,
      emojiName,
      "__BASE",
    );
    const emojiRight = this.scene.add.image(
      // 16 = half emoji size
      this.scene.scale.width - this.timerOffsetX + this.timerWidth / 2 + 16 + this.timerFrameSize,
      this.timerOffsetY + position * this.timerPaddingY,
      emojiName,
      "__BASE",
    );
    */
    frameRect.setStrokeStyle(this.timerFrameSize, this.frameColor);

    return { blueRect: blueRect, greenRect: greenRect, frameRect: frameRect, emojiLeft: emojiLeft, emojiRight: emojiRight };
  }

  private hColor(hexColor: string) {
    return Phaser.Display.Color.HexStringToColor(hexColor).color;
  }

  private async setTimer(timeSeconds: number, timerOrderIndex: number, currentBar: Phaser.GameObjects.Rectangle, currentBarColor: number) {
    let barWidth = this.timerWidth;
    const halfTime = Math.floor(timeSeconds / 2);

    currentBar.destroy();
    for (let i = 1; i < halfTime + 1; i++) {
      currentBar = this.scene.add.rectangle(
        this.scene.scale.width - this.timerWidth,
        this.timerOffsetY + timerOrderIndex * this.timerPaddingY,
        barWidth,
        this.timerHeight,
        currentBarColor,
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      barWidth = this.timerWidth - (i / halfTime) * this.timerWidth;
      currentBar.destroy();
    }
  }
}
