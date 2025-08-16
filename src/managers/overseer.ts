// Responsible for overseeing the entire game process - What level is loaded, the state of the game, etc.
import { Application } from "pixi.js";
import { BaseLevel } from "../levels/baseLevel";
import { MainGameLevel } from "../levels/mainGame";

export class Overseer {
    app: Application
    level: BaseLevel

    constructor() {
        // Define variables.
        this.app = new Application();
        this.level = new MainGameLevel(this);
    }

    beginGame(): void {
        (async () => {
            await this.app.init({ background: "#000000", resizeTo: window });

            document.getElementById("pixi-container")!.appendChild(this.app.canvas);

            this.app.ticker.add((time) => {
                this.level.update(time.deltaTime);
            });
        });
    }
}