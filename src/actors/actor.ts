import { Container } from "pixi.js";
import { Overseer } from "../managers/overseer";

export abstract class Actor extends Container {
    overseer: Overseer

    constructor(overseer: Overseer) {
        super();
        this.overseer = overseer;
    }

    abstract update(delta: number): void;

    onAdd(stage: Container): void {
        stage.addChild(this);
    }

    onRemove(stage: Container): void {
        stage.removeChild(this);
        this.destroy({ children: true });
    }
}