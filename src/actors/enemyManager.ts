import { Overseer } from "../managers/overseer";
import { Actor } from "./actor";
import { BaseEnemy, Runner } from "./enemies";

export class EnemyManager extends Actor {
    availableEnemies: {type: string, cost: number}[];
    points: number;
    maxPoints: number;
    pointBuildRate: number;
    minSpawnRate: number;
    maxSpawnRate: number;
    nextSpawn: number;
    
    constructor(overseer: Overseer, availableEnemies: {type: string, cost: number}[], maxPoints: number, pointBuildRate: number, minSpawnRate: number, maxSpawnRate: number) {
        super(overseer);

        this.availableEnemies = availableEnemies;
        this.points = maxPoints;
        this.maxPoints = maxPoints;
        this.pointBuildRate = pointBuildRate;
        this.minSpawnRate = minSpawnRate;
        this.maxSpawnRate = maxSpawnRate;

        this.nextSpawn = this.minSpawnRate + (Math.random() * (this.maxSpawnRate - this.minSpawnRate));
    }

    update(delta: number) {
        this.nextSpawn -= delta;

        if (this.nextSpawn <= 0) {
            this.nextSpawn = this.minSpawnRate + (Math.random() * (this.maxSpawnRate - this.minSpawnRate));

            let spawnableEnemies: string[] = [];

            for (const enemyType of this.availableEnemies) {
                if (enemyType.cost <= this.points) {
                    spawnableEnemies.push(enemyType.type);
                }
            }

            if (spawnableEnemies.length > 0) {
                let randomIndex = Math.floor(Math.random() * spawnableEnemies.length);

                if (randomIndex >= spawnableEnemies.length) {
                    randomIndex = spawnableEnemies.length - 1;
                }

                this.points -= this.availableEnemies.find((enemy) => enemy.type === spawnableEnemies[randomIndex])!.cost;

                let newEnemy: BaseEnemy;

                switch(spawnableEnemies[randomIndex]) {
                    case "Runner":
                        newEnemy = new Runner(this.overseer, -100, -100);
                        break;
                    
                    default:
                        newEnemy = new Runner(this.overseer, -100, -100);
                        break;
                }

                let spawnX = 0;
                let spawnY = 0;

                if (Math.random() <= 0.5) {
                    spawnX = (Math.random() * (1000 + newEnemy.size)) - newEnemy.size;
                    spawnY = (Math.random() <= 0.5 ? -newEnemy.size : 1000);
                } else {
                    spawnX = (Math.random() <= 0.5 ? -newEnemy.size : 1000);
                    spawnY = (Math.random() * (1000 + newEnemy.size)) - newEnemy.size;
                }

                newEnemy.x = spawnX;
                newEnemy.y = spawnY;

                this.overseer.level.addActor(newEnemy);
            }
        }

        this.points = Math.min(this.maxPoints, this.points + (this.pointBuildRate * delta));
    }
}