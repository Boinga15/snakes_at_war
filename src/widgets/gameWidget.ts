import { Text } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Widget } from "./widget";
import { Snake } from "../actors/snake";
import { Player } from "../objects/player";

export class GameWidget extends Widget {
    weaponText: Text
    reloadText: Text
    goldText: Text
    roundText: Text

    snakeReference: Snake
    playerReference: Player

    constructor(overseer: Overseer) {
        super(overseer);

        this.weaponText = new Text({
            text: "Test",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#ffffffff"
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

        this.goldText = new Text({
            text: "",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#f1e428ff"
            },
            x: 10,
            y: 50
        });

        this.roundText = new Text({
            text: "",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#00af35ff"
            },
            x: 10,
            y: 70
        });

        this.addChild(this.weaponText);
        this.addChild(this.reloadText);
        this.addChild(this.goldText);
        this.addChild(this.roundText);

        this.snakeReference = this.overseer.getActorOfClass(Snake) as Snake;
        this.playerReference = this.overseer.player;
    }

    update(delta: number) {
        super.update(delta);

        // Update weapon text.
        const obtainedWeapon = this.playerReference.weapons.find((weapon) => weapon.type == this.playerReference.equippedWeapon)!
        this.weaponText.text = obtainedWeapon.type + ": " + obtainedWeapon.ammo + " | " + obtainedWeapon.maxAmmo + " (" + (obtainedWeapon.reserveAmmo == -1 ? "INF" : obtainedWeapon.reserveAmmo + " | " + obtainedWeapon.maxReserveAmmo) + ")"

        // Update reload text.
        this.reloadText.text = (this.snakeReference.isReloading ? "RELOADING (" + this.snakeReference.reloadTimer.toFixed(2) + ")" : "");

        // Update  gold text.
        this.goldText.text = "Gold: " + this.playerReference.gold;

        // Update round text
        this.roundText.text = "Round Time: " + Math.floor(this.playerReference.roundTimer * 10) / 10;
    }
}