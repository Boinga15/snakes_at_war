import { Graphics } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Actor } from "./actor";
import { BaseEnemy } from "./enemies";

export class Explosion extends Actor {
    explosionRadius: number
    shrinkRate: number
    damage: number
    knockback: number
    explosionColour: string
    playerAligned: boolean

    explosionGraphic: Graphics

    constructor(overseer: Overseer, x: number, y: number, radius: number, shrinkRate: number, damage: number, knockback: number, explosionColour: string, playerAligned: boolean) {
        super(overseer);

        this.x = x;
        this.y = y;

        this.explosionRadius = radius;
        this.shrinkRate = shrinkRate;
        this.damage = damage;
        this.knockback = knockback;

        this.explosionColour = explosionColour
        this.playerAligned = playerAligned

        this.explosionGraphic = new Graphics().circle(0, 0, this.explosionRadius).fill(explosionColour);
        this.addChild(this.explosionGraphic);
    }

    update(delta: number) {
            if (this.playerAligned) {
            const enemyList: BaseEnemy[] = this.overseer.getActorsOfClass(BaseEnemy);

            for (const enemy of enemyList) {
                const targetPoint = {
                    x: enemy.x + (enemy.size / 2),
                    y: enemy.y + (enemy.size / 2)
                };

                const distance = (this.x - targetPoint.x)**2 + (this.y - targetPoint.y)**2;

                if (distance < this.explosionRadius**2) {
                    const diffX = targetPoint.x - this.x;
                    const diffY = targetPoint.y - this.y;

                    let angle = (diffY >= 0 ? Math.PI * 1.5 : Math.PI * 0.5);

                    if (diffX != 0) {
                        angle = Math.atan(diffY / diffX);

                        if (diffX <= 0) {
                            angle += Math.PI;
                        }
                    }

                    enemy.takeDamage(this.damage * delta, this.knockback * delta, angle);
                }
            }   
        } else {
            
        }

        this.explosionRadius -= this.shrinkRate * delta;

        if (this.explosionRadius <= 0) {
            this.overseer.level.removeActor(this);
            return;
        }

        this.explosionGraphic.clear();
        this.explosionGraphic.circle(0, 0, this.explosionRadius).fill(this.explosionColour);
    }
}