import { Graphics } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Actor } from "./actor";
import { BaseEnemy } from "./enemies";
import { Explosion } from "./explosion";
import { Snake } from "./snake";

abstract class Bullet extends Actor {
    xSpeed: number
    ySpeed: number
    bulletAngle: number
    damage: number
    pierceLeft: number
    hitEnemies: BaseEnemy[] = []

    constructor(overseer: Overseer, angle: number, speed: number, x: number, y: number, damage: number, pierceLeft: number) {
        super(overseer);

        this.xSpeed = speed * Math.cos(angle * Math.PI / 180);
        this.ySpeed = speed * Math.sin(angle * Math.PI / 180);
        this.bulletAngle = angle;

        this.x = x;
        this.y = y;

        this.damage = damage;
        this.pierceLeft = pierceLeft;
    }

    update(delta: number) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;

        if (this.x > 2000 || this.x < -1000 || this.y > 2000 || this.y < -1000) {
            this.overseer.level.removeActor(this);
        }
    }
}

export class PlayerBullet extends Bullet {
    size: number
    knockback: number
    isRocket: boolean

    constructor(overseer: Overseer, angle: number, speed: number, x: number, y: number, size: number, colour: string, damage: number, pierceLeft: number, knockback: number, isRocket: boolean) {
        super(overseer, angle, speed, x, y, damage, pierceLeft);

        this.knockback = knockback
        this.isRocket = isRocket

        const graphics = new Graphics().rect(0, 0, size, size).fill(colour);
        this.addChild(graphics);

        this.size = size;
    }

    update(delta: number) {
        // Check for enemy collisions
        let movementUpdate = 0;
        let totalMovementUpdates = 10;

        while (movementUpdate < totalMovementUpdates) {
            this.x += this.xSpeed * delta / totalMovementUpdates;
            this.y += this.ySpeed * delta / totalMovementUpdates;

            movementUpdate++;

            const enemyList: BaseEnemy[] = this.overseer.getActorsOfClass(BaseEnemy);

            for (const enemy of enemyList) {
                if (!this.hitEnemies.includes(enemy) && this.overseer.getRectCollision({x: this.x, y: this.y, xSize: this.size, ySize: this.size}, {x: enemy.x, y: enemy.y, xSize: enemy.size, ySize: enemy.size})) {
                    this.hitEnemies.push(enemy);
                    enemy.takeDamage(this.damage, this.knockback, Math.PI * this.bulletAngle / 180);
                    this.pierceLeft -= 1;

                    // Impact Particles
                    const particleLocation: {x: number, y: number} = {
                        x: this.x + ((enemy.x - this.x) / 2) + this.size,
                        y: this.y + ((enemy.y - this.y) / 2) + this.size
                    }

                    this.overseer.createParticles(particleLocation, 5, 5, "#ffa600ff", 1000, Math.PI + ((this.bulletAngle / 180) * Math.PI), 0.2);

                    if (this.pierceLeft < 0) {
                        if (this.isRocket) {
                            this.overseer.level.addActor(new Explosion(this.overseer, this.x + (this.size / 2), this.y + (this.size / 2), 200, 400, this.damage * 5, 2200, "#ffc400ff", true));
                        }

                        this.overseer.level.removeActor(this);
                        return;
                    }
                }
            }
        }

        if (this.x > 2000 || this.x < -1000 || this.y > 2000 || this.y < -1000) {
            this.overseer.level.removeActor(this);
        }
    }
}

export class EnemyBullet extends Bullet {
    size: number
    penetrating: boolean

    constructor(overseer: Overseer, angle: number, speed: number, x: number, y: number, size: number, colour: string, damage: number, penetrating: boolean = false) {
        super(overseer, angle, speed, x, y, damage, 0);

        const graphics = new Graphics().rect(0, 0, size, size).fill(colour);
        this.addChild(graphics);

        this.penetrating = penetrating;
        this.size = size;
    }

    update(delta: number) {
        // Check for player collisions
        let movementUpdate = 0;
        let totalMovementUpdates = 10;

        while (movementUpdate < totalMovementUpdates) {
            this.x += this.xSpeed * delta / totalMovementUpdates;
            this.y += this.ySpeed * delta / totalMovementUpdates;

            movementUpdate++;

            const parts = this.overseer.getActorOfClass(Snake)!.parts;

            for (const part of parts) {
                if (this.overseer.getRectCollision({x: part.x, y: part.y, xSize: 20, ySize: 20}, {x: this.x, y: this.y, xSize: this.size, ySize: this.size})) {
                    if (part == parts[0]) {
                        this.overseer.getActorOfClass(Snake)!.takeDamage(this.damage);
                        this.overseer.level.removeActor(this);
                        return;
                    } else if (!this.penetrating) {
                        this.overseer.level.removeActor(this);
                        return;
                    }
                }
            }
        }

        if (this.x > 2000 || this.x < -1000 || this.y > 2000 || this.y < -1000) {
            this.overseer.level.removeActor(this);
        }
    }
}