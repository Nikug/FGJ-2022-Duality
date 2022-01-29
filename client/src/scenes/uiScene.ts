import type { Score, Team } from "../../types/types";
import { Scoreboard } from "../ui/scoreboard";
import { Timer } from "../ui/timer";
import { VictoryNotification } from "../ui/victoryNotification";

export class UIScene extends Phaser.Scene {
  timer: Timer | undefined;
  scoreboard: Scoreboard | undefined;
  victoryNotifcation: VictoryNotification | undefined;

  constructor() {
    super({ key: "UIScene", active: true });
    this.timer = new Timer(this);
    this.scoreboard = new Scoreboard(this);
    this.victoryNotifcation = new VictoryNotification(this);
  }

  preload() {
    this.load.bitmapFont("atari", "assets/fonts/atari-classic.png", "assets/fonts/atari-classic.xml");
  }
  create() {
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
      (seconds: number, team: Team) => {
        this.timer?.addTimer(seconds, team);
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
