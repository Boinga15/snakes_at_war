import { Text } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Widget } from "./widget";
import { Snake } from "../actors/snake";
import { Player } from "../objects/player";

export class GameWidget extends Widget {
    weaponText: Text
    reloadText: Text

    snakeReference: Snake
    playerReference: Player

    constructor(overseer: Overseer) {
        super(overseer);

        this.weaponText = new Text({
            text: "Test",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#d8d8d8ff"
            },
            x: 10,
            y: 10
        });

        this.reloadText = new Text({
            text: "",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#e0e0e0ff"
            },
            x: 10,
            y: 30
        });

        this.addChild(this.weaponText);
        this.addChild(this.reloadText);

        this.snakeReference = this.overseer.getActorOfClass(Snake) as Snake;
        this.playerReference = this.overseer.player;
    }

    update(delta: number) {
        // Update weapon text.
        const obtainedWeapon = this.playerReference.weapons.find((weapon) => weapon.type == this.playerReference.equippedWeapon)!
        this.weaponText.text = obtainedWeapon.type + ": " + obtainedWeapon.ammo + " | " + obtainedWeapon.maxAmmo + " (" + (obtainedWeapon.reserveAmmo == -1 ? "INF" : obtainedWeapon.reserveAmmo + " | " + obtainedWeapon.maxReserveAmmo) + ")"

        // Update reload text.
        this.reloadText.text = (this.snakeReference.isReloading ? "RELOADING (" + this.snakeReference.reloadTimer.toFixed(2) + ")" : "")
    }
}