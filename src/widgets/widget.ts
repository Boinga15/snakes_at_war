import { Container } from "pixi.js";
import { Overseer } from "../managers/overseer";

export abstract class Widget extends Container {
    overseer: Overseer

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

    abstract update(delta: number): void;
}