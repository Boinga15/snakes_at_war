import { Graphics } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Actor } from "./actor";

abstract class Bullet extends Actor {
    xSpeed: number
    ySpeed: number
    damage: number
    pierceLeft: number

    constructor(overseer: Overseer, angle: number, speed: number, x: number, y: number, damage: number, pierceLeft: number) {
        super(overseer);

        this.xSpeed = speed * Math.cos(angle * Math.PI / 180);
        this.ySpeed = speed * Math.sin(angle * Math.PI / 180);

        this.x = x;
        this.y = y;

        this.damage = damage;
        this.pierceLeft = pierceLeft;
    }

    update(delta: number) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;

        if (this.x > 2000 || this.x < -1000 || this.y > 2000 || this.y < -1000) {
            console.log("TRASH IT")
            this.overseer.level.removeActor(this);
        }
    }
}

export class PlayerBullet extends Bullet {
    constructor(overseer: Overseer, angle: number, speed: number, x: number, y: number, size: number, colour: string, damage: number, pierceLeft: number) {
        super(overseer, angle, speed, x, y, damage, pierceLeft);

        const graphics = new Graphics().rect(0, 0, size, size).fill(colour);
        this.addChild(graphics);
    }
}