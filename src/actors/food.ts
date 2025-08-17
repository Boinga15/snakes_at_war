import { Graphics } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Actor } from "./actor";
import { Snake } from "./snake";

export class Food extends Actor {
    graphics: Graphics

    constructor(overseer: Overseer) {
        super(overseer);

        this.x = Math.floor(Math.random() * 49) * 20;
        this.y = Math.floor(Math.random() * 49) * 20;

        this.graphics = new Graphics().rect(0, 0, 20, 20).fill("#ff0077ff");
        this.addChild(this.graphics);
    }

    update(delta: number): void {
        const snakeRef = this.overseer.getActorOfClass(Snake) as Snake;

        if (snakeRef == undefined) {
            return;
        }

        if (snakeRef.parts[0].x == this.x && snakeRef.parts[0].y == this.y) {
            this.x = Math.floor(Math.random() * 49) * 20;
            this.y = Math.floor(Math.random() * 49) * 20;

            snakeRef.sizeAdjustment += 3;
        }
    }
}