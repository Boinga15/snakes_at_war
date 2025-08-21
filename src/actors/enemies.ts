import { Graphics } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Actor } from "./actor";
import { Snake } from "./snake";

export class BaseEnemy extends Actor {
    health: number;
    maxHealth: number;
    speed: number;
    engageDistance: number;
    snakeReference: Snake

    size: number
    colourHigh: string
    colourLow: string

    damageDelay: number = 0
    disappearTimer: number = 10

    knockbackVelocity: number[] = [0, 0]

    consumeAmount: number

    upperSquare: Graphics
    lowerSquare: Graphics

    constructor(overseer: Overseer, x: number, y: number, health: number, speed: number, engageDistance: number, size: number, colourLow: string, colourHigh: string, consumeAmount: number) {
        super(overseer);

        this.x = x;
        this.y = y;

        this.maxHealth = health;
        this.health = health;
        this.speed = speed;
        this.engageDistance = engageDistance;

        this.size = size;
        this.colourHigh = colourHigh;
        this.colourLow = colourLow;

        this.consumeAmount = consumeAmount;

        this.upperSquare = new Graphics().rect(0, 0, size, size).fill(colourHigh);
        this.lowerSquare = new Graphics().rect(0, 0, size, size).fill(colourLow);

        this.addChild(this.lowerSquare);
        this.addChild(this.upperSquare);

        this.snakeReference = this.overseer.getActorOfClass(Snake) as Snake;
    }

    update(delta: number, friction: number = 400, contactDamage: number = 3) {
        if (this.health > 0) {
            // Get Targets
            const targetX: number = this.snakeReference.parts[0].x;
            const targetY: number = this.snakeReference.parts[0].y;

            // Calculate Angle
            const diffX = targetX - this.x;
            const diffY = targetY - this.y;
            
            let angle = 0;

            if (diffX == 0) {
                angle = (diffY >= 0 ? 0 : Math.PI);
            } else {
                angle = Math.atan(diffY / diffX);
            }

            if (diffX <= 0) {
                angle += Math.PI;
            }
        
            // Handle Movement
            this.x += this.speed * Math.cos(angle) * delta;
            this.y += this.speed * Math.sin(angle) * delta;

            // Damage Snake
            this.damageDelay -= delta;

            let currentIndex = 0;

            while (currentIndex < this.snakeReference.parts.length) {
                if (this.overseer.getRectCollision({x: this.x, y: this.y, xSize: this.size, ySize: this.size}, {x: this.snakeReference.parts[currentIndex].x, y: this.snakeReference.parts[currentIndex].y, xSize: 20, ySize: 20})) {
                    if (currentIndex == 0 && this.damageDelay <= 0) {
                        this.snakeReference.takeDamage(contactDamage);
                        this.damageDelay = 0.5;
                    }
                    
                    this.takeDamage(0, (currentIndex == 0 ? 1200 : 400), angle + Math.PI);
                }

                currentIndex++;
            }
        } else {
            if (this.overseer.getRectCollision({x: this.x, y: this.y, xSize: this.size, ySize: this.size}, {x: this.snakeReference.parts[0].x, y: this.snakeReference.parts[0].y, xSize: 20, ySize: 20})) {
                this.overseer.level.removeActor(this);
                this.snakeReference.sizeAdjustment += this.consumeAmount;
                return
            }

            this.disappearTimer -= delta;

            if (this.disappearTimer <= 0) {
                this.overseer.level.removeActor(this);
                return
            }
        }

        // Handle Graphics
        this.upperSquare.clear();
        this.upperSquare.rect((this.size / 2) * (1 - (this.health / this.maxHealth)), (this.size / 2) * (1 - (this.health / this.maxHealth)), this.size * ((this.health / this.maxHealth)), this.size * ((this.health / this.maxHealth)));
        this.upperSquare.fill(this.colourHigh);

        // Add Knockback
        this.x += this.knockbackVelocity[0] * delta;
        this.y += this.knockbackVelocity[1] * delta;

        for (const idx of [0, 1]) {
            this.knockbackVelocity[idx] -= (this.knockbackVelocity[idx] * friction * delta)
        }
    }

    takeDamage(damage: number, knockback: number, angle: number, knockbackMultiplier: number = 1) {
        this.health -= damage;

        this.knockbackVelocity[0] += knockback * Math.cos(angle) * knockbackMultiplier;
        this.knockbackVelocity[1] += knockback * Math.sin(angle) * knockbackMultiplier;
    }
}


export class Runner extends BaseEnemy {
    constructor(overseer: Overseer, x: number, y: number) {
        super(overseer, x, y, 5, 80, -1, 20, "#770000ff", "#ff0000ff", 2);
    }

    update(delta: number) {
        super.update(delta, 10, 3);
    }
}