// Responsible for overseeing the entire game process - What level is loaded, the state of the game, etc.
import { Application, Graphics } from "pixi.js";
import { BaseLevel } from "../levels/baseLevel";
import { MainGameLevel } from "../levels/mainGame";

export class Overseer {
    app: Application
    level: BaseLevel
    boundingBox: Graphics;

    readonly GAME_WIDTH = 1000;
    readonly GAME_HEIGHT = 1000;

    constructor() {
        // Define variables.
        this.app = new Application();
        this.boundingBox = new Graphics().rect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT).fill("#383838ff");
        this.app.stage.addChild(this.boundingBox);

        this.level = new MainGameLevel(this);
    }

    beginGame(): void {
        (async () => {
            await this.app.init({ background: "#181818ff", resizeTo: window });

            document.getElementById("pixi-container")!.appendChild(this.app.canvas);

            // Add resize listener
            window.addEventListener("resize", () => this.resize());
            this.resize();

            this.app.ticker.add((time) => {
                this.level.update(time.deltaMS / 1000);
            });
        })();
    }

    private resize(): void {
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        // Resize the canvas to fit the window
        this.app.renderer.resize(windowWidth, windowHeight);

        const scaleX = windowWidth / this.GAME_WIDTH;
        const scaleY = windowHeight / this.GAME_HEIGHT;
        const scale = Math.min(scaleX, scaleY);

        // Scale the stage
        this.app.stage.scale.set(scale);

        // Center the stage
        this.app.stage.x = (windowWidth - this.GAME_WIDTH * scale) / 2;
        this.app.stage.y = (windowHeight - this.GAME_HEIGHT * scale) / 2;
    }
}