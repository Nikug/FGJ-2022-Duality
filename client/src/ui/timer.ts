import type { GameScene } from "../scenes/main";

import emptyTimerImage from "/assets/timer/emptyTimer.png";
import halfTimerImage from "/assets/timer/halfTimer.png";
import fullTimerImage from "/assets/timer/fullTimer.png";



/* Creates UI Timer
    Usage:
        - create new Timer() in scene constructor
        - call timer.loadImages() in scene preload
        - call timer.addTimer(seconds) whenver needed
        - debug as needed :]

*/
export class Timer {

    private scene: GameScene;
    private timerHeight = 50;
    private activeTimers = 0;

    constructor(scene: GameScene) {
        this.scene = scene;
    }

    public loadImages() {
        this.scene.load.image('emptyTimer', emptyTimerImage);
        this.scene.load.image('halfTimer', halfTimerImage);
        this.scene.load.image('fullTimer', fullTimerImage);
    }

    public addTimer(timeSeconds: number) {
        

        // Making sure scene has been created
        if (this.scene) {
            const timeMS = timeSeconds * 1000;
            const position = this.timerHeight*(this.activeTimers+1)
            this.activeTimers += 1;
            const sceneWidth = this.scene.scale.width
            

            let secondsLeft = timeSeconds;
            let text = this.scene.add.text(sceneWidth-520, position, secondsLeft.toString(), { font: '"Press Start 2P"', fontSize: "28px" });
            const intervalId = setInterval(() => {
                text.destroy()
                secondsLeft -= 1;
                text = this.scene.add.text(sceneWidth-520, position, secondsLeft.toString(), { font: '"Press Start 2P"', fontSize: "28px" });
            }, 1000);
            

            const fullImage = this.scene.add.image(sceneWidth-300, position, 'fullTimer');
                setTimeout(() => {
                    fullImage.destroy()
                    const halfImage = this.scene.add.image(sceneWidth-300, position, 'halfTimer');
                    setTimeout(() => {
                        halfImage.destroy()
                        const emptyImage = this.scene.add.image(sceneWidth-300, position, 'emptyTimer');
                        setTimeout(() => {
                            emptyImage.destroy()
                            this.activeTimers -= 1;
                            clearInterval(intervalId);
                            text.destroy()
                        }, timeMS/3);
                    }, timeMS/3);
                
                }, timeMS/3);
        }
        
    }
}