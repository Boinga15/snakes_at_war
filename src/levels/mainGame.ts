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
        
    }

    causeGameOver(): void {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAA")
    }
}