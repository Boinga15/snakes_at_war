import { Weapon } from "../data/types";
import { Overseer } from "../managers/overseer";

export class Player extends Object {
    weapons: {type: Weapon, ammo: number, maxAmmo: number, reserveAmmo: number, maxReserveAmmo: number, unlocked: boolean, upgrades: {damage: number, reloadSpeed: number, ammoCapacity: number, ammoGain: number}}[]
    equippedWeapon: Weapon
    gold: number

    constructor(overseer: Overseer) {
        super(overseer);

        this.weapons = [
            { type: "Pistol", ammo: 10, maxAmmo: 10, reserveAmmo: -1, maxReserveAmmo: -1, unlocked: true, upgrades: {damage: 0, reloadSpeed: 0, ammoCapacity: 0, ammoGain: 0} },
            { type: "Machine Gun", ammo: 30, maxAmmo: 30, reserveAmmo: 300, maxReserveAmmo: 300, unlocked: true, upgrades: {damage: 0, reloadSpeed: 0, ammoCapacity: 0, ammoGain: 0} },
            { type: "Rifle", ammo: 5, maxAmmo: 5, reserveAmmo: 50, maxReserveAmmo: 50, unlocked: true, upgrades: {damage: 0, reloadSpeed: 0, ammoCapacity: 0, ammoGain: 0} },
            { type: "Shotgun", ammo: 6, maxAmmo: 6, reserveAmmo: 60, maxReserveAmmo: 60, unlocked: true, upgrades: {damage: 0, reloadSpeed: 0, ammoCapacity: 0, ammoGain: 0} },
            { type: "Pulse Laser", ammo: 50, maxAmmo: 50, reserveAmmo: 500, maxReserveAmmo: 500, unlocked: true, upgrades: {damage: 0, reloadSpeed: 0, ammoCapacity: 0, ammoGain: 0} },
            { type: "Rocket Launcher", ammo: 1, maxAmmo: 1, reserveAmmo: 10, maxReserveAmmo: 10, unlocked: true, upgrades: {damage: 0, reloadSpeed: 0, ammoCapacity: 0, ammoGain: 0} },
        ];

        this.equippedWeapon = "Pistol";
        this.gold = 0;
    }
}