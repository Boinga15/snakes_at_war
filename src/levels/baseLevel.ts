import { Container } from "pixi.js";
import { Overseer } from "../managers/overseer";

export abstract class BaseLevel {
    overseer: Overseer

    constructor(overseer: Overseer) {
        this.overseer = overseer;
    }

    abstract update(delta: number): void;

    onLoad(_stage: Container): void {}
    onUnload(_stage: Container): void {}
}