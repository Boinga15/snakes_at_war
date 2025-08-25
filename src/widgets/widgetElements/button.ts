import { Graphics, Text } from "pixi.js";
import { Overseer } from "../../managers/overseer";
import { BaseElementWidget } from "./baseWidgetElement";
import { sound } from "@pixi/sound";

export class WidgetButton extends BaseElementWidget {
    label: string
    colour: string
    hoverColour: string
    clickColour: string

    xSize: number
    ySize: number

    onClick: ((...args: []) => any) | undefined
    onHold: ((...args: []) => any) | undefined
    onReleased: ((...args: []) => any) | undefined

    beingClicked: boolean = true;

    private background: Graphics;
    private text: Text;

    constructor(overseer: Overseer, x: number, y: number, settings: {
        label: string,
        xSize: number,
        ySize: number,
        colour: string,
        hoverColour: string,
        clickColour: string
    }, onClick: ((...args: any[]) => any) | undefined = undefined,
       onHold: ((...args: any[]) => any) | undefined = undefined,
       onReleased: ((...args: any[]) => any) | undefined = undefined) {
        super(overseer);

        this.x = x;
        this.y = y;

        this.xSize = settings.xSize;
        this.ySize = settings.ySize;

        this.label = settings.label;
        this.colour = settings.colour;
        this.hoverColour = settings.hoverColour;
        this.clickColour = settings.clickColour;

        this.onClick = onClick;
        this.onHold = onHold;
        this.onReleased = onReleased;

        // Setup graphics
        this.background = new Graphics();
        this.addChild(this.background);

        this.text = new Text({text: this.label, style: {
            fontFamily: "Arial",
            fontSize: 16,
            fill: 0xffffff,
            align: "center",
        }});

        this.text.anchor.set(0.5);
        this.text.x = this.xSize / 2;
        this.text.y = this.ySize / 2;
        this.addChild(this.text);

        this.redraw(this.colour);
    }

    private redraw(colour: string) {
        this.background.clear();
        this.background.rect(0, 0, this.xSize, this.ySize);
        this.background.fill(colour);

        this.text.text = this.label; // ensure label updates
    }

    update(delta: number) {
        let currentColour = this.colour;

        if (this.overseer.getPointCollision(
            { x: this.x, y: this.y, xSize: this.xSize, ySize: this.ySize },
            this.overseer.mousePos
        )) {
            
            if (this.overseer.mouseDown) {
                currentColour = this.clickColour;

                if (this.beingClicked) {
                    this.onHold?.();
                } else {
                    this.onClick?.();
                    sound.play("click", {volume: 0.1});
                    this.beingClicked = true;
                }
            } else {
                currentColour = this.hoverColour;

                if (this.beingClicked) {
                    this.onReleased?.();
                    this.beingClicked = false;
                }
            }
        } else {
            if (this.beingClicked) {
                this.onReleased?.();
                this.beingClicked = false;
            }
        }

        this.redraw(currentColour);
    }
}