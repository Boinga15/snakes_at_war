import { Container, Graphics } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Actor } from "./actor";
import { Weapon } from "../data/types";
import { PlayerBullet } from "./bullets";
import {GameOverLevel} from "../levels/gameOverLevel.ts"
import { sound } from "@pixi/sound";

export class Snake extends Actor {
    direction: string
    heldDirection: string

    parts: SnakePart[]
    nextUpdate: number
    sizeAdjustment: number = 0

    snakeMoveTicker: number = 0.1;
    nextShot: number = 0;

    reloadTimer: number = 0;
    isReloading: boolean = false;

    constructor(overseer: Overseer) {
        super(overseer);

        this.direction = "RIGHT";
        this.heldDirection = "RIGHT";
        this.parts = [new SnakePart(overseer, true, 480, 480)];

        this.nextUpdate = this.snakeMoveTicker;
    }
    
    update(delta: number): void {
        // Update parts
        for (const part of this.parts) {
            part.update(delta);

            if (part.degrading && this.sizeAdjustment > 0) {
                part.degrading = false;
                this.sizeAdjustment -= 1;
            }
        }

        // Input handling
        const keyInputs: {key: string, direction: string}[] = [
            {key: "KeyW", direction: "UP"},
            {key: "KeyA", direction: "LEFT"},
            {key: "KeyD", direction: "RIGHT"},
            {key: "KeyS", direction: "DOWN"}
        ]

        const opposingDirections = [
            ["UP", "DOWN"],
            ["LEFT", "RIGHT"]
        ]

        for (const keyInput of keyInputs) {
            if (this.overseer.keys[keyInput.key]) {
                let doChange = true;

                for (const direction of opposingDirections) {
                    if (direction.includes(keyInput.direction) && direction.includes(this.direction)) {
                        doChange = false;
                        continue;
                    }
                }

                if (doChange) {
                    this.heldDirection = keyInput.direction
                }
            }
        }

        // Weapon Switching
        const weaponKeyInputs: {key: string, weapon: Weapon}[] = [
            {key: "Digit1", weapon: "Pistol"},
            {key: "Digit2", weapon: "Machine Gun"},
            {key: "Digit3", weapon: "Rifle"},
            {key: "Digit4", weapon: "Shotgun"},
            {key: "Digit5", weapon: "Pulse Laser"},
            {key: "Digit6", weapon: "Rocket Launcher"}
        ]

        for (const weaponInput of weaponKeyInputs) {
            if (this.overseer.keys[weaponInput.key] && !this.isReloading) {
                const chosenWeapon = this.overseer.player.weapons.find((weapon) => weapon.type == weaponInput.weapon);

                if (chosenWeapon!.unlocked) {
                    this.overseer.player.equippedWeapon = chosenWeapon!.type;
                }
            }
        }

        // Weapon Data
        const weaponData: {type: Weapon, fireDelay: number, reloadTime: number, damage: number, projectileSpeed: number, pierce: number, knockback: number}[] = [
            {type: "Pistol", fireDelay: 0.3, reloadTime: 1, damage: 1, projectileSpeed: 1500, pierce: 0, knockback: 500},
            {type: "Machine Gun", fireDelay: 0.1, reloadTime: 1.5, damage: 0.6, projectileSpeed: 1500, pierce: 0, knockback: 200},
            {type: "Rifle", fireDelay: 0.6, reloadTime: 1.8, damage: 2.2, projectileSpeed: 1500, pierce: 5, knockback: 900},
            {type: "Shotgun", fireDelay: 0.45, reloadTime: 1.6, damage: 1.2, projectileSpeed: 1500, pierce: 1, knockback: 600},
            {type: "Pulse Laser", fireDelay: 0.02, reloadTime: 2, damage: 0.3, projectileSpeed: 1800, pierce: 2, knockback: 80},
            {type: "Rocket Launcher", fireDelay: 0.5, reloadTime: 3, damage: 3, projectileSpeed: 1250, pierce: 0, knockback: 1000}
        ];

        // Handle firing
        this.nextShot -= delta;

        if (this.overseer.keys["Space"] && this.nextShot <= 0 && !this.isReloading) {

            const equippedWeaponIndex = this.overseer.player.weapons.indexOf(this.overseer.player.weapons.find((weapon) => weapon.type == this.overseer.player.equippedWeapon)!);

            if (this.overseer.player.weapons[equippedWeaponIndex].ammo > 0) {
                sound.play("fire", {volume: 0.2});

                this.overseer.player.weapons[equippedWeaponIndex].ammo -= 1;

                const angles: {direction: string, angle: number}[] = [
                    {direction: "UP", angle: 270},
                    {direction: "RIGHT", angle: 0},
                    {direction: "DOWN", angle: 90},
                    {direction: "LEFT", angle: 180}
                ]

                const obtainedWeapon: {type: Weapon, fireDelay: number, reloadTime: number, damage: number, projectileSpeed: number, pierce: number, knockback: number} = weaponData.find((weapon) => weapon.type == this.overseer.player.equippedWeapon)!;
                const weaponUpgrades = this.overseer.player.weapons[equippedWeaponIndex].upgrades;
                this.nextShot = obtainedWeapon.fireDelay;
            
                const angle = angles.find((cAngle) => cAngle.direction == this.direction)!.angle;
                this.overseer.level.addActor(new PlayerBullet(this.overseer, angle, obtainedWeapon.projectileSpeed, this.parts[0].x, this.parts[0].y, 20, "#fbff00ff", obtainedWeapon.damage * (1 + (0.2 * weaponUpgrades.damage)), obtainedWeapon.pierce, obtainedWeapon.knockback * (1 + (0.2 * weaponUpgrades.knockback)), (obtainedWeapon.type === "Rocket Launcher")))

                // Shotgun Behaviour
                if (obtainedWeapon.type == "Shotgun") {
                    const angleAdjustment: number[] = [-20, -10, 10, 20];
                    
                    for (const aAngle of angleAdjustment) {
                        this.overseer.level.addActor(new PlayerBullet(this.overseer, angle + aAngle, obtainedWeapon.projectileSpeed, this.parts[0].x, this.parts[0].y, 20, "#fbff00ff", obtainedWeapon.damage, obtainedWeapon.pierce, obtainedWeapon.knockback, false))
                    }
                }
            }
        }

        // Handle Reloading
        this.reloadTimer -= delta;

        if (this.reloadTimer <= 0 && this.isReloading) {
            this.isReloading = false;

            const equippedWeaponIndex = this.overseer.player.weapons.indexOf(this.overseer.player.weapons.find((weapon) => weapon.type == this.overseer.player.equippedWeapon)!);

            if (this.overseer.player.weapons[equippedWeaponIndex].reserveAmmo <= -1) { // Pistol reloading
                this.overseer.player.weapons[equippedWeaponIndex].ammo = this.overseer.player.weapons[equippedWeaponIndex].maxAmmo;
            } else if (this.overseer.player.weapons[equippedWeaponIndex].maxAmmo - this.overseer.player.weapons[equippedWeaponIndex].ammo > this.overseer.player.weapons[equippedWeaponIndex].reserveAmmo) { // Reloading when you don't have enough ammo.
                this.overseer.player.weapons[equippedWeaponIndex].ammo += this.overseer.player.weapons[equippedWeaponIndex].reserveAmmo;
                this.overseer.player.weapons[equippedWeaponIndex].reserveAmmo = 0
            } else { // Reloading when you have enough ammo.
                this.overseer.player.weapons[equippedWeaponIndex].ammo += this.overseer.player.weapons[equippedWeaponIndex].reserveAmmo -= (this.overseer.player.weapons[equippedWeaponIndex].maxAmmo - this.overseer.player.weapons[equippedWeaponIndex].ammo);
                this.overseer.player.weapons[equippedWeaponIndex].ammo = this.overseer.player.weapons[equippedWeaponIndex].maxAmmo;
            }
        }

        if (this.overseer.keys["KeyR"] && this.reloadTimer <= 0) {
            const equippedWeaponIndex = this.overseer.player.weapons.indexOf(this.overseer.player.weapons.find((weapon) => weapon.type == this.overseer.player.equippedWeapon)!);
            const obtainedWeapon: {type: Weapon, reloadTime: number, damage: number, projectileSpeed: number, pierce: number} = weaponData.find((weapon) => weapon.type == this.overseer.player.equippedWeapon)!;
            if (this.overseer.player.weapons[equippedWeaponIndex].reserveAmmo != 0 && (this.overseer.player.weapons[equippedWeaponIndex].ammo != this.overseer.player.weapons[equippedWeaponIndex].maxAmmo)) {
                this.isReloading = true;
                this.reloadTimer = obtainedWeapon.reloadTime * (1 - (0.1 * this.overseer.player.weapons[equippedWeaponIndex].upgrades.reloadSpeed));
                sound.play("reload", {volume: 0.2});
            }
        }

        // Advance Round
        this.overseer.player.roundTimer -= delta;

        if (this.overseer.player.roundTimer <= 0) {
            this.overseer.player.openShop();
            return;
        }

        // Start handling frame-by-frame movement.
        this.nextUpdate -= delta;

        if (this.nextUpdate > 0) {
            return;
        }

        this.direction = this.heldDirection;

        // All code past this point is only handled when snake moves.
        this.nextUpdate = this.snakeMoveTicker;

        // Movement script.
        let adjustment: number[] = [0, 0];

        switch(this.direction) {
            case "UP":
                adjustment = [0, -1]
                break;

            case "RIGHT":
                adjustment = [1, 0]
                break;

            case "LEFT":
                adjustment = [-1, 0]
                break;

            case "DOWN":
                adjustment = [0, 1]
                break;
        }

        let nextLocation: number[] = [this.parts[0].x + adjustment[0] * 20, this.parts[0].y + adjustment[1] * 20]
        
        for (const id of [0, 1]) {
            if (nextLocation[id] < 0) {
                nextLocation[id] = 980;
            } else if (nextLocation[id] > 980) {
                nextLocation[id] = 0
            }
        }
        
        for (const part of this.parts) {
            const newLoaction: number[] = [part.x, part.y];
            part.x = nextLocation[0];
            part.y = nextLocation[1];
            nextLocation = newLoaction;
        }

        // Growth script
        if (this.sizeAdjustment > 0) {
            this.sizeAdjustment -= 1;

            this.parts.push(new SnakePart(this.overseer, false, nextLocation[0], nextLocation[1]));
        }

        // Check for game overs.
        let degradingAway = false;

        for (const part of this.parts) {
            if (degradingAway) {
                part.degrading = true;
            }

            if (part == this.parts[0]) {
                continue;
            } else if (part.x == this.parts[0].x && part.y == this.parts[0].y) {
                // Start removing every part up to this one.
                part.degrading = true;
                degradingAway = true;
            }
        }

        // Check for degredation.
        if (this.parts[this.parts.length - 1].degrading) {
            this.parts[this.parts.length - 1].removePart();
            this.parts.pop();
        }
    }

    takeDamage(damage: number) {
        let currentIndex = this.parts.length - 1;
        let damageLeft = damage;

        while (currentIndex >= 0 && damageLeft > 0) {
            if (!this.parts[currentIndex].degrading) {
                damageLeft--;
                this.parts[currentIndex].degrading = true;
            }

            currentIndex--;
        }
    }

    onRemove(stage: Container) {
        for (const part of this.parts) {
            part.onRemove(stage);
        }

        super.onRemove(stage)
    }
}

class SnakePart extends Actor {
    isHead: boolean
    graphics: Graphics
    degrading: boolean

    constructor(overseer: Overseer, isHead: boolean, x: number, y: number) {
        super(overseer);

        this.isHead = isHead;
        this.degrading = false;

        this.x = x;
        this.y = y

        this.graphics = new Graphics().rect(0, 0, 20, 20).fill("#00ff22ff");

        if (!this.isHead) {
            this.graphics = new Graphics().rect(0, 0, 20, 20).fill("#00a116ff");
        } else {
            this.graphics = new Graphics().rect(0, 0, 20, 20).fill("#00ff22ff");
        }

        this.addChild(this.graphics);
    }
    
    update(delta: number): void {
        if (this.degrading) {
            this.graphics.clear();
            this.graphics.rect(0, 0, 20, 20),
            this.graphics.fill("#ff0000ff");
        } else if (!this.isHead) {
            this.graphics.clear();
            this.graphics.rect(0, 0, 20, 20),
            this.graphics.fill("#00a116ff");
        } else {
            this.graphics.clear();
            this.graphics.rect(0, 0, 20, 20),
            this.graphics.fill("#00ff22ff");
        }
    }

    removePart() {
        if (this.isHead) {
            this.overseer.loadLevel(GameOverLevel);
        } else {
            this.onRemove(this.overseer.app.stage);
        }
    }
}