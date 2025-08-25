import { Graphics } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Actor } from "./actor";
import { Snake } from "./snake";
import { EnemyBullet } from "./bullets";

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
            const currentDistnace = (diffX**2) + (diffY**2);

            if (currentDistnace > this.engageDistance**2 || !(this.x >= 50 && this.x <= 950 - this.size) || !(this.y >= 50 && this.x <= 950 - this.size)) {
                this.x += this.speed * Math.cos(angle) * delta;
                this.y += this.speed * Math.sin(angle) * delta;
            }

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
        super(overseer, x, y, 5, 80, 0, 20, "#770000ff", "#ff0000ff", 2);
    }

    update(delta: number) {
        super.update(delta, 10, 3);
    }
}


export class Gunner extends BaseEnemy {
    nextShot: number = 0

    constructor(overseer: Overseer, x: number, y: number) {
        super(overseer, x, y, 7, 60, 300, 20, "#8f1d1dff", "#ff4949ff", 4);
    }

    update(delta: number) {
        super.update(delta, 9, 2);

        this.nextShot -= delta;

        if (this.nextShot <= 0) {
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

            angle = 180 * (angle / Math.PI)

            let newProjectile = new EnemyBullet(this.overseer, angle, 200, this.x + 10, this.y + 10, 10, "#ff0000ff", 1, false)
            this.nextShot = 1;

            this.overseer.level.addActor(newProjectile);
        }
    }
}


export class Charger extends BaseEnemy {
    constructor(overseer: Overseer, x: number, y: number) {
        super(overseer, x, y, 3, 160, 0, 20, "#a1a1a1ff", "#ffffffff", 1);
    }

    update(delta: number) {
        super.update(delta, 8, 2);
    }

    takeDamage(damage: number, knockback: number, angle: number, knockbackMultiplier: number = 1.5) {
        super.takeDamage(damage, knockback, angle, knockbackMultiplier);
    }
}


export class Blaster extends BaseEnemy {
    nextShot: number = 0

    constructor(overseer: Overseer, x: number, y: number) {
        super(overseer, x, y, 12, 120, 120, 20, "#1d658fff", "#289cdfff", 4);
    }

    update(delta: number) {
        super.update(delta, 9, 2);

        this.nextShot -= delta;

        if (this.nextShot <= 0) {
            // Get Targets
            const targetX: number = this.snakeReference.parts[0].x;
            const targetY: number = this.snakeReference.parts[0].y;

            // Calculate Angle
            const diffX = targetX - this.x;
            const diffY = targetY - this.y;

            // Don't shoot if we're too far away.
            if ((diffX**2) + (diffY**2) > 90000) {
                return;
            }
            
            let angle = 0;

            if (diffX == 0) {
                angle = (diffY >= 0 ? 0 : Math.PI);
            } else {
                angle = Math.atan(diffY / diffX);
            }

            if (diffX <= 0) {
                angle += Math.PI;
            }

            angle = 180 * (angle / Math.PI)

            const angleAdjustments = [-30, -15, 0, 15, 30];

            for (const aAngle of angleAdjustments) {
                let newProjectile = new EnemyBullet(this.overseer, angle + aAngle, 200, this.x + 10, this.y + 10, 10, "#ff0000ff", 1, false)
                this.nextShot = 1.8;

                this.overseer.level.addActor(newProjectile);
            }
        }
    }
}


export class Bulldozer extends BaseEnemy {
    constructor(overseer: Overseer, x: number, y: number) {
        super(overseer, x, y, 50, 50, 0, 40, "#6b0000ff", "#850000ff", 15);
    }

    update(delta: number) {
        super.update(delta, 30, 10);
    }

    takeDamage(damage: number, knockback: number, angle: number, knockbackMultiplier: number = 0.2) {
        super.takeDamage(damage, knockback, angle, knockbackMultiplier);
    }
}


export class Ace extends BaseEnemy {
    nextShot: number = 0

    constructor(overseer: Overseer, x: number, y: number) {
        super(overseer, x, y, 20, 120, 200, 20, "#3e2f69ff", "#6d51bdff", 8);
    }

    update(delta: number) {
        super.update(delta, 9, 2);

        this.nextShot -= delta;

        if (this.nextShot <= 0) {
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

            angle = 180 * (angle / Math.PI)

            let newProjectile = new EnemyBullet(this.overseer, angle, 250, this.x + 10, this.y + 10, 10, "#ff8181ff", 1, true)
            this.nextShot = 0.4;

            this.overseer.level.addActor(newProjectile);
        }
    }
}