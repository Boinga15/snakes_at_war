import { Container } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Actor } from "../actors/actor";
import { Widget } from "../widgets/widget";

export abstract class BaseLevel {
    overseer: Overseer
    actors: Actor[]
    widgets: Widget[]

    constructor(overseer: Overseer) {
        this.overseer = overseer;
        this.actors = []
        this.widgets = []

        this.onLoad(this.overseer.app.stage);
    }

    update(delta: number): void {
        for (const actor of this.actors) {
            if (actor.unloaded) {
                continue;
            }
            
            actor.update(delta);
        }

        for (const widget of this.widgets) {
            widget.update(delta);
        }
    };

    onLoad(_stage: Container): void {}

    onUnload(_stage: Container): void {
        for (const actor of this.actors) {
            actor.onRemove(_stage);
        }

        for (const widget of this.widgets) {
            widget.onDeconstruct();
            _stage.removeChild(widget);
        }
    }

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