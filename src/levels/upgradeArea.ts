import { Container } from "pixi.js";
import { BaseLevel } from "./baseLevel";
import { UpgradeWidget } from "../widgets/upgradeWidget";

export class UpgradeAreaLevel extends BaseLevel {
    update(delta: number): void {
        super.update(delta);
    }

    onLoad(_stage: Container): void {
        this.widgets.push(new UpgradeWidget(this.overseer));
    }
}