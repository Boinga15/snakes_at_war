import { Graphics } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Actor } from "./actor";

export class Snake extends Actor {
    direction: string
    parts: SnakePart[]

    constructor(overseer: Overseer) {
        super(overseer);

        this.direction = "RIGHT";
        this.parts = [new SnakePart(overseer, true)];
    }
    
    update(delta: number): void {

    }
}

class SnakePart extends Actor {
    isHead: boolean

    constructor(overseer: Overseer, isHead: boolean) {
        super(overseer);

        this.isHead = isHead;

        const graphics = new Graphics().rect(50, 50, 100, 100).fill(0xff0000);
        this.addChild(graphics);
    }
    
    update(delta: number): void {

    }
}