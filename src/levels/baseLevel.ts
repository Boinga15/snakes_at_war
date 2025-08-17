import { Container } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Actor } from "../actors/actor";

export abstract class BaseLevel {
    overseer: Overseer
    actors: Actor[]

    constructor(overseer: Overseer) {
        this.overseer = overseer;
        this.actors = []

        this.onLoad(this.overseer.app.stage);
    }

    update(delta: number): void {
        for (const actor of this.actors) {
            actor.update(delta);
        }
    };

    onLoad(_stage: Container): void {}
    onUnload(_stage: Container): void {}

    addActor(actor: Actor): void {
        this.actors.push(actor);
    }

    removeActor(actor: Actor): boolean {
        if (this.actors.includes(actor)) {
            this.actors = this.actors.filter((cActor) => cActor != actor);
            actor.onRemove(this.overseer.app.stage);
            return true;
        }

        return false;
    }
}