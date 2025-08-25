import { EnemyManager } from "../actors/enemyManager";
import { Food } from "../actors/food";
import { Snake } from "../actors/snake";
import { Weapon } from "../data/types";
import { MainGameLevel } from "../levels/mainGame";
import { UpgradeAreaLevel } from "../levels/upgradeArea";
import { Overseer } from "../managers/overseer";
import { GameWidget } from "../widgets/gameWidget";
import { Object } from "./object";

export class Player extends Object {
    weapons: {type: Weapon, ammo: number, maxAmmo: number, reserveAmmo: number, maxReserveAmmo: number, unlocked: boolean, upgrades: {damage: number, reloadSpeed: number, ammoCapacity: number, knockback: number}}[]
    equippedWeapon: Weapon
    gold: number
    snakeLength: number = 0
    round: number = 0
    roundTimer: number = 0

    generalUpgrades: {goldIncome: number, ammoGathering: number}

    constructor(overseer: Overseer) {
        super(overseer);

        this.weapons = [
            { type: "Pistol", ammo: 10, maxAmmo: 10, reserveAmmo: -1, maxReserveAmmo: -1, unlocked: true, upgrades: {damage: 0, reloadSpeed: 0, ammoCapacity: 0, knockback: 0} },
            { type: "Machine Gun", ammo: 30, maxAmmo: 30, reserveAmmo: 300, maxReserveAmmo: 300, unlocked: false, upgrades: {damage: 0, reloadSpeed: 0, ammoCapacity: 0, knockback: 0} },
            { type: "Rifle", ammo: 5, maxAmmo: 5, reserveAmmo: 50, maxReserveAmmo: 50, unlocked: false, upgrades: {damage: 0, reloadSpeed: 0, ammoCapacity: 0, knockback: 0} },
            { type: "Shotgun", ammo: 6, maxAmmo: 6, reserveAmmo: 60, maxReserveAmmo: 60, unlocked: false, upgrades: {damage: 0, reloadSpeed: 0, ammoCapacity: 0, knockback: 0} },
            { type: "Pulse Laser", ammo: 50, maxAmmo: 50, reserveAmmo: 500, maxReserveAmmo: 500, unlocked: false, upgrades: {damage: 0, reloadSpeed: 0, ammoCapacity: 0, knockback: 0} },
            { type: "Rocket Launcher", ammo: 1, maxAmmo: 1, reserveAmmo: 10, maxReserveAmmo: 10, unlocked: false, upgrades: {damage: 0, reloadSpeed: 0, ammoCapacity: 0, knockback: 0} },
        ];

        this.generalUpgrades = {
            goldIncome: 0,
            ammoGathering: 0
        }

        this.equippedWeapon = "Pistol";
        this.gold = 0;
    }

    openShop() {
        this.snakeLength = this.overseer.getActorOfClass(Snake)!.parts.length - 1;

        this.overseer.loadLevel(UpgradeAreaLevel);
    }

    startRound() {
        this.round++;
        this.overseer.level = new MainGameLevel(this.overseer);

        this.roundTimer = 20 + (Math.random() * 20);

        let newSnake = new Snake(this.overseer);
        newSnake.sizeAdjustment = this.snakeLength;

        this.overseer.level.actors.push(new Food(this.overseer));
        this.overseer.level.actors.push(newSnake);

        this.overseer.level.widgets.push(new GameWidget(this.overseer));
        
        const enemyRanges: {type: string, round: number, roundMax: number, cost: number}[] = [
            {type: "Runner", round: 0, roundMax: 20, cost: 2},
            {type: "Gunner", round: 3, roundMax: 20, cost: 4},
            {type: "Charger", round: 6, roundMax: 20, cost: 3},
            {type: "Blaster", round: 10, roundMax: 20, cost: 8},
            {type: "Bulldozer", round: 15, roundMax: 20, cost: 20},
            {type: "Ace", round: 20, roundMax: 50, cost: 20},
            {type: "Bulldozer", round: 20, roundMax: 50, cost: 15},
            {type: "Charger", round: 20, roundMax: 50, cost: 1},
            {type: "Blaster", round: 20, roundMax: 50, cost: 3},
            {type: "Bulldozer", round: 50, roundMax: -1, cost: 1},
            {type: "Ace", round: 50, roundMax: -1, cost: 1}
        ];

        let availableEnemies: {type: string, cost: number}[] = [];

        for (const enemyRange of enemyRanges) {
            if (this.round >= enemyRange.round && (enemyRange.roundMax <= 0 || enemyRange.roundMax > this.round)) {
                availableEnemies.push({type: enemyRange.type, cost: enemyRange.cost})
            }
        }

        const maxPoints: number = 5 + (this.round * 2);
        const pointBuildRate: number = (this.round * 0.5);
        const minSpawnRate: number = 3**(-1 * (this.round / 20)) * 3;
        const maxSpawnRate: number = 3**(-1 * (this.round / 20)) * 4;

        this.overseer.level.actors.push(new EnemyManager(this.overseer, availableEnemies, maxPoints, pointBuildRate, minSpawnRate, maxSpawnRate));
    }
}