import { Container } from "pixi.js";
import { BaseLevel } from "./baseLevel";
import { Snake } from "../actors/snake";
import { Food } from "../actors/food";

export class MainGameLevel extends BaseLevel {
    update(delta: number): void {
        super.update(delta);
    }

    onLoad(_stage: Container): void {
        this.actors.push(new Food(this.overseer));
        this.actors.push(new Snake(this.overseer));
    }

    causeGameOver(): void {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAA")
    }
}