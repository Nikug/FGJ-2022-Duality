import type { Score, Team } from "../../types/types";
import { Scoreboard } from "../ui/scoreboard";
import { Timer } from "../ui/timer";
import { VictoryNotification } from "../ui/victoryNotification";
import gravityEmoji from "/assets/timer/gravityEmoji.png";
import bigsmallEmoji from "/assets/timer/bigsmallEmoji.png";

export class UIScene extends Phaser.Scene {
  timer: Timer | undefined;
  scoreboard: Scoreboard | undefined;
  victoryNotifcation: VictoryNotification | undefined;

  constructor() {
    super({ key: "UIScene", active: false });
    this.timer = new Timer(this);
    this.scoreboard = new Scoreboard(this);
    this.victoryNotifcation = new VictoryNotification(this);
  }

  preload() {
    //this.load.bitmapFont("atari", "assets/fonts/atari-classic.png", "assets/fonts/atari-classic.xml");
    this.load.image("gravityEmoji", gravityEmoji);
    this.load.image("bigsmallEmoji", bigsmallEmoji);
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
