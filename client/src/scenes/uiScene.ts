import type { Score, Team } from "../../types/types";
import { Scoreboard } from "../ui/scoreboard";
import { Timer } from "../ui/timer";
import { VictoryNotification } from "../ui/victoryNotification";
export class UIScene extends Phaser.Scene {
  timer: Timer | undefined;
  scoreboard: Scoreboard | undefined;
  victoryNotifcation: VictoryNotification | undefined;
  public WIN_POINTS: number;

  constructor() {
    super({ key: "UIScene", active: false });
    this.timer = new Timer(this);
    this.scoreboard = new Scoreboard(this);
    this.victoryNotifcation = new VictoryNotification(this);
    this.WIN_POINTS = 500;
  }

  public init(data: { WIN_POINTS: number }) {
    this.WIN_POINTS = data.WIN_POINTS;
  }

  preload() {
    this.load.spritesheet("smallSheet", "/assets/kritafiles/small_icon/small_spritesheet.png", { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet("bigSheet", "/assets/kritafiles/big_icon/big_spritesheet.png", { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet("upsideDownNormalSheet", "/assets/kritafiles/upsidedown_normal/upsidedown_normal_spritesheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("upsideDownUpsideDownSheet", "/assets/kritafiles/upsidedown_upsidedown/upsidedown_upsidedown_spritesheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("hunterSheet", "/assets/kritafiles/hunter_icon/hunter_spritesheet.png", { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet("preySheet", "/assets/kritafiles/prey_icon/prey_spritesheet.png", { frameWidth: 32, frameHeight: 32 });
  }
  create() {
    this.anims.create({
      key: "small",
      frames: this.anims.generateFrameNumbers("smallSheet", { frames: [0, 1] }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: "big",
      frames: this.anims.generateFrameNumbers("bigSheet", { frames: [0, 1] }),
      frameRate: 4,
      repeat: -1,
    });
    this.anims.create({
      key: "hunter",
      frames: this.anims.generateFrameNumbers("hunterSheet", { frames: [0, 1] }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "prey",
      frames: this.anims.generateFrameNumbers("preySheet", { frames: [0, 1] }),
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "upsideDownNormal",
      frames: this.anims.generateFrameNumbers("upsideDownNormalSheet", { frames: [0, 1] }),
      frameRate: 4,
      repeat: -1,
    });
    this.anims.create({
      key: "upsideDownUpsideDown",
      frames: this.anims.generateFrameNumbers("upsideDownUpsideDownSheet", { frames: [0, 1] }),
      frameRate: 4,
      repeat: -1,
    });
    this.scoreboard?.addScoreBoard();

    const mainGame = this.scene.get("Game");

    mainGame.events.on(
      "addScore",
      (Score: Score) => {
        this.scoreboard?.addScore(Score);
      },
      this,
    );

    mainGame.events.on(
      "addTimer",
      (seconds: number, team: Team, type: string) => {
        this.timer?.addTimer(seconds, team, type);
      },
      this,
    );

    mainGame.events.on(
      "Victory",
      (team: Team) => {
        this.victoryNotifcation?.showVictory(team);
      },
      this,
    );
  }
}
