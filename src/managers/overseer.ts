// Responsible for overseeing the entire game process - What level is loaded, the state of the game, etc.
import { Application, Graphics } from "pixi.js";
import { BaseLevel } from "../levels/baseLevel";
import { MainGameLevel } from "../levels/mainGame";
import { Actor } from "../actors/actor";
import { Player } from "../objects/player";
import { Widget } from "../widgets/widget";
import { GameWidget } from "../widgets/gameWidget";

export class Overseer {
    app: Application
    level: BaseLevel
    boundingBox: Graphics;

    player: Player;

    keys: Record<string, boolean> = {};

    readonly GAME_WIDTH = 1000;
    readonly GAME_HEIGHT = 1000;

    constructor() {
        // Define variables.
        this.app = new Application();
        this.boundingBox = new Graphics().rect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT).fill("#383838ff");
        this.app.stage.addChild(this.boundingBox);
        
        this.level = new MainGameLevel(this);
        this.player = new Player(this);

        this.level.widgets.push(new GameWidget(this));
    }

    beginGame(): void {
        (async () => {
            await this.app.init({ background: "#181818ff", resizeTo: window });

            document.getElementById("pixi-container")!.appendChild(this.app.canvas);

            // Add resize listener
            window.addEventListener("resize", () => this.resize());
            this.resize();

            // Add key listeners.
            window.addEventListener("keydown", (e) => {
                this.keys[e.code] = true;
            });

            window.addEventListener("keyup", (e) => {
                this.keys[e.code] = false;
            });

            // Prevent arrow keys from scrolling the page.
            window.addEventListener("keydown", (e) => {
                if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
                    e.preventDefault();
                }
            });


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

    // Helper functions.
    getActorsOfClass(targetClass: typeof Actor): Actor[] {
        return this.level.actors.filter((actor) => (actor instanceof targetClass));
    }

    getActorOfClass(targetClass: typeof Actor): Actor | undefined {
        for (const actor of this.level.actors) {
            if (actor instanceof targetClass) {
                return actor;
            }
        }

        return undefined;
    }

    getWidgetsOfClass(targetClass: typeof Widget): Widget[] {
        return this.level.widgets.filter((widget) => (widget instanceof targetClass));
    }

    getWidgetOfClass(targetClass: typeof Widget): Widget | undefined {
        for (const widget of this.level.widgets) {
            if (widget instanceof targetClass) {
                return widget;
            }
        }

        return undefined;
    }
}