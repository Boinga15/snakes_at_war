import { Container } from "pixi.js";
import { Overseer } from "../../managers/overseer";
import { Widget } from "../widget";

export abstract class BaseElementWidget extends Container {
    widgetParent: Widget | undefined = undefined;
    overseer: Overseer
    
    constructor(overseer: Overseer) {
        super();
        this.overseer = overseer;
    }

    abstract update(delta: number): void;

    addToParent(parent: Widget) {
        parent.addChild(this);
        this.widgetParent = parent;
    }

    removeFromParent() {
        if (this.widgetParent != undefined) {
            this.widgetParent.removeChild(this);
        }
    }
}