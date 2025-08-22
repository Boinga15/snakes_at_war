import { Container } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { BaseElementWidget } from "./widgetElements/baseWidgetElement";

export abstract class Widget extends Container {
    overseer: Overseer
    subWidgets: BaseElementWidget[] = []

    constructor (overseer: Overseer) {
        super();

        this.x = 0;
        this.y = 0;
        this.zIndex = 10;

        this.overseer = overseer;

        this.onConstruct();
    }

    onConstruct() {
        this.overseer.app.stage.addChild(this);
    }

    onDeconstruct() {
        this.overseer.app.stage.removeChild(this);
    }

    addElement(element: BaseElementWidget) {
        this.subWidgets.push(element);
        element.addToParent(this);
    }

    removeElement(element: BaseElementWidget) {
        if (this.subWidgets.includes(element)) {
            element.removeFromParent();
            this.subWidgets = this.subWidgets.filter((widget) => widget != element);
        }
    }

    update(delta: number) {
        for (const widgetPart of this.subWidgets) {
            widgetPart.update(delta);
        }
    }
}