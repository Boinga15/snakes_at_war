import { Container } from "pixi.js";
import { BaseLevel } from "./baseLevel";
import { Snake } from "../actors/snake";
import { Food } from "../actors/food";
import { EnemyManager } from "../actors/enemyManager";

export class MainGameLevel extends BaseLevel {
    update(delta: number): void {
        super.update(delta);
    }

    onLoad(_stage: Container): void {
        this.actors.push(new Food(this.overseer));
        this.actors.push(new Snake(this.overseer));

        this.actors.push(new EnemyManager(this.overseer, [{type: "Runner", cost: 1}], 2, 0.2, 2, 4));
    }

    causeGameOver(): void {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAA")
    }
}