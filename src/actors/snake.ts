import { Graphics } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Actor } from "./actor";

export class Snake extends Actor {
    direction: string
    parts: SnakePart[]
    nextUpdate: number
    sizeAdjustment: number = 0

    snakeMoveTicker: number = 0.1;

    constructor(overseer: Overseer) {
        super(overseer);

        this.direction = "RIGHT";
        this.parts = [new SnakePart(overseer, true, 480, 480)];

        this.nextUpdate = this.snakeMoveTicker;
    }
    
    update(delta: number): void {
        // Input handling
        const keyInputs: {key: string, direction: string}[] = [
            {key: "KeyW", direction: "UP"},
            {key: "KeyA", direction: "LEFT"},
            {key: "KeyD", direction: "RIGHT"},
            {key: "KeyS", direction: "DOWN"}
        ]

        const opposingDirections = [
            ["UP", "DOWN"],
            ["LEFT", "RIGHT"]
        ]

        for (const keyInput of keyInputs) {
            if (this.overseer.keys[keyInput.key]) {
                let doChange = true;

                for (const direction of opposingDirections) {
                    if (direction.includes(keyInput.direction) && direction.includes(this.direction)) {
                        doChange = false;
                        continue;
                    }
                }

                if (doChange) {
                    this.direction = keyInput.direction
                }
            }
        }

        this.nextUpdate -= delta;

        if (this.nextUpdate > 0) {
            return;
        }

        // All code past this point is only handled when snake moves.
        this.nextUpdate += this.snakeMoveTicker;

        // Movement script.
        let adjustment: number[] = [0, 0];

        switch(this.direction) {
            case "UP":
                adjustment = [0, -1]
                break;

            case "RIGHT":
                adjustment = [1, 0]
                break;

            case "LEFT":
                adjustment = [-1, 0]
                break;

            case "DOWN":
                adjustment = [0, 1]
                break;
        }

        let nextLocation: number[] = [this.parts[0].x + adjustment[0] * 20, this.parts[0].y + adjustment[1] * 20]
        
        for (const id of [0, 1]) {
            if (nextLocation[id] < 0) {
                nextLocation[id] = 980;
            } else if (nextLocation[id] > 980) {
                nextLocation[id] = 0
            }
        }
        
        for (const part of this.parts) {
            const newLoaction: number[] = [part.x, part.y];
            part.x = nextLocation[0];
            part.y = nextLocation[1];
            nextLocation = newLoaction;
        }

        // Growth script
        if (this.sizeAdjustment > 0) {
            this.sizeAdjustment -= 1;

            this.parts.push(new SnakePart(this.overseer, false, nextLocation[0], nextLocation[1]));
        }
    }
}

class SnakePart extends Actor {
    isHead: boolean
    graphics: Graphics

    constructor(overseer: Overseer, isHead: boolean, x: number, y: number) {
        super(overseer);

        this.isHead = isHead;

        this.x = x;
        this.y = y

        this.graphics = new Graphics().rect(0, 0, 20, 20).fill("#00ff22ff");

        if (!this.isHead) {
            this.graphics = new Graphics().rect(0, 0, 20, 20).fill("#00a116ff");
        } else {
            this.graphics = new Graphics().rect(0, 0, 20, 20).fill("#00ff22ff");
        }

        this.addChild(this.graphics);
    }
    
    update(delta: number): void {
        
    }
}