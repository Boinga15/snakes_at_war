import { Graphics } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Actor } from "./actor";
import { Snake } from "./snake";
import { Player } from "../objects/player";
import { Weapon } from "../data/types";

export class Food extends Actor {
    graphics: Graphics
    playerReference: Player

    constructor(overseer: Overseer) {
        super(overseer);

        this.x = Math.floor(Math.random() * 49) * 20;
        this.y = Math.floor(Math.random() * 49) * 20;

        this.graphics = new Graphics().rect(0, 0, 20, 20).fill("#ff0077ff");
        this.addChild(this.graphics);

        this.playerReference = this.overseer.player;
    }

    update(delta: number): void {
        if (this.playerReference == undefined) {
            this.playerReference = this.overseer.player;
        }

        const snakeRef = this.overseer.getActorOfClass(Snake) as Snake;

        if (snakeRef == undefined) {
            return;
        }

        if (snakeRef.parts[0].x == this.x && snakeRef.parts[0].y == this.y) {
            this.x = Math.floor(Math.random() * 49) * 20;
            this.y = Math.floor(Math.random() * 49) * 20;

            snakeRef.sizeAdjustment += 3;

            this.playerReference.gold += 25 + (5 * this.playerReference.generalUpgrades.goldIncome);
            const weaponList: Weapon[] = ["Machine Gun", "Pulse Laser", "Rifle", "Rocket Launcher", "Shotgun"];

            for (const weapon of weaponList) {
                let weaponRef = this.playerReference.weapons.find((cWeapon) => cWeapon.type == weapon)!;
                const idx = this.playerReference.weapons.indexOf(weaponRef);
                this.playerReference.weapons[idx].reserveAmmo = Math.min(weaponRef.maxReserveAmmo, weaponRef.reserveAmmo + Math.floor(weaponRef.maxReserveAmmo * (0.02 * (this.playerReference.generalUpgrades.ammoGathering + 1))));
            }
        }
    }
}