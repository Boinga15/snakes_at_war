import { Text } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Widget } from "./widget";
import { WidgetButton } from "./widgetElements/button";
import { HelpWidget } from "./helpWidget";
import { Snake } from "../actors/snake";
import { Food } from "../actors/food";

export class MainMenuWidget extends Widget {
    constructor(overseer: Overseer) {
        super(overseer);

        this.addChild(new Text({
            text: "Snakes at War",
            style: {
                fontFamily: "Arial",
                fontSize: 50,
                fill: "#ffffffff"
            },
            x: 500,
            y: 30,
            anchor: 0.5
        }));

        this.addElement(new WidgetButton(this. overseer, 300, 440, {
            label: "Play Game",
            xSize: 400,
            ySize: 40,
            colour: "#b9b9b9ff",
            hoverColour: "#6b6b6bff",
            clickColour: "#464646ff"
        }, () => {
            this.overseer.startGame();
        }));

        this.addElement(new WidgetButton(this. overseer, 300, 500, {
            label: "How to Play",
            xSize: 400,
            ySize: 40,
            colour: "#b9b9b9ff",
            hoverColour: "#6b6b6bff",
            clickColour: "#464646ff"
        }, () => {
            this.overseer.player.roundTimer = 999999;
            this.overseer.level.addActor(new Snake(this.overseer));
            this.overseer.level.addActor(new Food(this.overseer));

            this.overseer.level.widgets = [new HelpWidget(this.overseer)];
            
            this.onDeconstruct();
        }));
    }
}