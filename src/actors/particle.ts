import { Graphics } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Actor } from "./actor";

export class Particle extends Actor {
    projectileAngle: number
    speed: number
    colour: string
    size: number
    lifetime: number

    xSpeed: number
    ySpeed: number

    constructor(overseer: Overseer, angle: number, speed: number, colour: string, size: number, lifetime: number) {
        super(overseer);

        this.projectileAngle = angle;
        this.speed = speed;
        this.colour = colour;
        this.size = size;
        this.lifetime = lifetime;

        this.xSpeed = speed * Math.cos(angle);
        this.ySpeed = speed * Math.sin(angle);

        this.addChild(new Graphics().rect(-(size / 2), -(size / 2), size, size).fill(this.colour));
    }

    update(delta: number) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;

        this.lifetime -= delta;

        if (this.lifetime <= 0) {
            this.overseer.level.removeActor(this);
        }
    }
}