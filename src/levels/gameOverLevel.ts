import { Container } from "pixi.js";
import { BaseLevel } from "./baseLevel";
import { GameOverWidget } from "../widgets/gameOverWidget";

export class GameOverLevel extends BaseLevel {
    update(delta: number): void {
        super.update(delta);
    }

    onLoad(_stage: Container) {
        this.widgets.push(new GameOverWidget(this.overseer));
    }
}