import { Container } from "pixi.js";
import { BaseLevel } from "./baseLevel";
import { MainMenuWidget } from "../widgets/mainMenuWidget";

export class MainMenuLevel extends BaseLevel {
    update(delta: number): void {
        super.update(delta);
    }

    onLoad(_stage: Container) {
        this.widgets.push(new MainMenuWidget(this.overseer));
    }
}