// Responsible for overseeing the entire game process - What level is loaded, the state of the game, etc.
import { Application, Graphics, Rectangle } from "pixi.js";
import { BaseLevel } from "../levels/baseLevel";
import { MainGameLevel } from "../levels/mainGame";
import { Actor } from "../actors/actor";
import { Player } from "../objects/player";
import { Widget } from "../widgets/widget";
import { GameWidget } from "../widgets/gameWidget";
import { UpgradeAreaLevel } from "../levels/upgradeArea";
import { MainMenuLevel } from "../levels/mainMenuLevel";
import { Particle } from "../actors/particle";

// Used for get actors of class.
type ActorConstructor<T extends Actor = Actor> = new (...args: any[]) => T;
type LevelConstructor<T extends BaseLevel = BaseLevel> = new (...args: any[]) => T;

export class Overseer {
    app: Application
    level: BaseLevel
    boundingBox: Graphics;

    mousePos: {x: number, y: number}
    mouseDown: boolean = false;

    player: Player;

    keys: Record<string, boolean> = {};

    readonly GAME_WIDTH = 1000;
    readonly GAME_HEIGHT = 1000;

    constructor() {
        // Define variables.
        this.app = new Application();
        this.boundingBox = new Graphics().rect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT).fill("#383838ff");
        this.app.stage.addChild(this.boundingBox);

        this.mousePos = {x: 0, y: 0};

        this.player = new Player(this);
        this.level = new MainMenuLevel(this);
    }

    loadLevel<T extends BaseLevel>(targetClass: LevelConstructor<T>): void {
        this.level.onUnload(this.app.stage);
        this.level = new targetClass(this);
    }

    startGame() {
        this.player = new Player(this);
        this.loadLevel(MainGameLevel);

        this.player.startRound();
    }

    beginGame(): void {
        (async () => {
            await this.app.init({ background: "#181818ff", resizeTo: window });

            this.app.stage.eventMode = "static";
            this.app.stage.hitArea = new Rectangle(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

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

            window.addEventListener("mousedown", (_e) => {
                this.mouseDown = true;
            });

            // Clear the flag when the mouse button is released
            window.addEventListener("mouseup", (_e) => {
                this.mouseDown = false;
            });

            // Prevent arrow keys from scrolling the page.
            window.addEventListener("keydown", (e) => {
                if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
                    e.preventDefault();
                }
            });

            window.addEventListener("mousemove", (e) => {
                this.mousePos = {
                    x: (e.screenX - this.app.stage.x) / this.app.stage.scale.x,
                    y: (e.screenY - this.app.stage.y) / this.app.stage.scale.y
                }
            })


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

        this.app.stage.hitArea = new Rectangle(0, 0, scale, scale);


        // Create a mask the size of the logical game area
        const mask = new Graphics().rect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT).fill(0xffffff);

        // Assign mask to stage
        this.app.stage.mask = mask;

        // Add mask to stage so Pixi can use it
        this.app.stage.addChild(mask);
    }

    // Helper functions.
    getActorsOfClass<T extends Actor>(targetClass: ActorConstructor<T>): T[] {
        return this.level.actors.filter((actor): actor is T => (actor instanceof targetClass));
    }

    getActorOfClass<T extends Actor>(targetClass: ActorConstructor<T>): T | undefined {
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

    getPointCollision(rect: {x: number, y: number, xSize: number, ySize: number}, point: {x: number, y: number}): boolean {
        const difference = {
            x: point.x - rect.x,
            y: point.y - rect.y
        };

        if (difference.x < 0 || difference.y < 0) {
            return false;
        }

        return (difference.x <= rect.xSize && difference.y <= rect.ySize);
    }

    getRectCollision(rect1: {x: number, y: number, xSize: number, ySize: number}, rect2: {x: number, y: number, xSize: number, ySize: number}): boolean {
        return (rect1.x + rect1.xSize > rect2.x && rect1.x < rect2.x + rect2.xSize && rect1.y + rect1.ySize > rect2.y && rect1.y < rect2.y + rect2.ySize);
    }

    createParticles(point: {x: number, y: number}, count: number, size: number, colour: string, speed: number, angle: number, lifetime: number) {
        let cParticle = 0;

        while(cParticle < count) {
            cParticle++;

            let newParticle = new Particle(this, angle + ((Math.random() * (Math.PI / 9)) - (Math.PI / 18)), (speed * 0.5 + (speed * Math.random())), colour, size, lifetime);
            newParticle.x = point.x;
            newParticle.y = point.y;

            this.level.addActor(newParticle);
        }
    }
}