import { Text } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Widget } from "./widget";
import { WidgetButton } from "./widgetElements/button";

export class GameOverWidget extends Widget {
    constructor(overseer: Overseer) {
        super(overseer);

        this.addChild(new Text({
            text: "Game Over",
            style: {
                fontFamily: "Arial",
                fontSize: 50,
                fill: "#ff0000ff"
            },
            x: 500,
            y: 30,
            anchor: 0.5
        }));

        this.addElement(new WidgetButton(this. overseer, 300, 440, {
            label: "Try Again",
            xSize: 400,
            ySize: 40,
            colour: "#b9b9b9ff",
            hoverColour: "#6b6b6bff",
            clickColour: "#464646ff"
        }, () => {
            this.overseer.startGame();
        }));

        this.addChild(new Text({
            text: "Final Round: " + this.overseer.player.round,
            style: {
                fontFamily: "Arial",
                fontSize: 20,
                fill: "#ffffffff"
            },
            x: 500,
            y: 600,
            anchor: 0.5
        }));
    }
}