import { Overseer } from "../managers/overseer";

export abstract class Object {
    overseer: Overseer

    constructor(overseer: Overseer) {
        this.overseer = overseer
    }
}