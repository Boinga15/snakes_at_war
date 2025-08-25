import { Text } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Widget } from "./widget";
import { WidgetButton } from "./widgetElements/button";
import { MainMenuWidget } from "./mainMenuWidget";
import { BaseEnemy, Dummy } from "../actors/enemies";
import { Player } from "../objects/player";
import { Snake } from "../actors/snake";

export class HelpWidget extends Widget {
    weaponText: Text
    reloadText: Text
    playerReference: Player
    snakeReference: Snake

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

        // Tutorial Text
        this.addChild(new Text({
            text: "W, A, S, D: Change Direction",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#ffffffff"
            },
            x: 10,
            y: 70
        }));

        this.addChild(new Text({
            text: "Space: Fire",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#ffffffff"
            },
            x: 10,
            y: 90
        }));

        this.addChild(new Text({
            text: "R: Reload",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#ffffffff"
            },
            x: 10,
            y: 110
        }));

        this.addChild(new Text({
            text: "1 - 6: Change Weapons",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#ffffffff"
            },
            x: 10,
            y: 130
        }));

        this.addChild(new Text({
            text: "Eating food gives length, gold, and ammo.",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#ffffffff"
            },
            x: 10,
            y: 170
        }));

        this.addChild(new Text({
            text: "Use gold to unlock weapons and upgrades.",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#ffffffff"
            },
            x: 10,
            y: 190
        }));

        this.addChild(new Text({
            text: "Don't let enemies attack your head.",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#ffffffff"
            },
            x: 10,
            y: 230
        }));

        this.addChild(new Text({
            text: "You can use your tail to block enemies.",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#ffffffff"
            },
            x: 10,
            y: 250
        }));

        this.addChild(new Text({
            text: "Killing enemies lets you eat them for length.",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#ffffffff"
            },
            x: 10,
            y: 270
        }));

        this.addChild(new Text({
            text: "Survive as many rounds as you can.",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#ffffffff"
            },
            x: 10,
            y: 290
        }));


        this.addElement(new WidgetButton(this. overseer, 300, 950, {
            label: "Back",
            xSize: 400,
            ySize: 40,
            colour: "#b9b9b9ff",
            hoverColour: "#6b6b6bff",
            clickColour: "#464646ff"
        }, () => {
            this.overseer.level.widgets = [new MainMenuWidget(this.overseer)];

            for (const actor of this.overseer.level.actors) {
                this.overseer.level.removeActor(actor);
            }

            this.onDeconstruct();
        }));

        this.addChild(this.weaponText);
        this.addChild(this.reloadText);

        this.snakeReference = this.overseer.getActorOfClass(Snake) as Snake;
        this.playerReference = this.overseer.player;

        for (let weapon of this.playerReference.weapons) {
            weapon.unlocked = true;
        }
    }

    update(delta: number) {
        super.update(delta);

        // Spawning the dummy enemy (and ensuring there's only one)
        if(this.overseer.getActorsOfClass(BaseEnemy).length <= 0 && this.overseer.level.widgets.includes(this)) {
            this.overseer.level.addActor(new Dummy(this.overseer, 1000, 1000));
        }

        // Infinite time and Ammo text
        this.overseer.player.roundTimer = 9999999

        const obtainedWeapon = this.playerReference.weapons.find((weapon) => weapon.type == this.playerReference.equippedWeapon)!
        this.weaponText.text = obtainedWeapon.type + ": " + obtainedWeapon.ammo + " | " + obtainedWeapon.maxAmmo + " (" + (obtainedWeapon.reserveAmmo == -1 ? "INF" : obtainedWeapon.reserveAmmo + " | " + obtainedWeapon.maxReserveAmmo) + ")"
        this.reloadText.text = (this.snakeReference.isReloading ? "RELOADING (" + this.snakeReference.reloadTimer.toFixed(2) + ")" : "");
    }
}