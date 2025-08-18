import { Weapon } from "../data/types";
import { Overseer } from "../managers/overseer";

export class Player extends Object {
    weapons: {type: Weapon, ammo: number, maxAmmo: number, reserveAmmo: number, maxReserveAmmo: number, upgrades: {damage: number, reloadSpeed: number, ammoCapacity: number, reserveCapacity: number}}[]
    equippedWeapon: Weapon
    gold: number

    constructor(overseer: Overseer) {
        super(overseer);

        this.weapons = [
            { type: "Pistol", ammo: 10, maxAmmo: 10, reserveAmmo: -1, maxReserveAmmo: -1, upgrades: {damage: 0, reloadSpeed: 0, ammoCapacity: 0, reserveCapacity: 0} }
        ];

        this.equippedWeapon = "Pistol";
        this.gold = 0;
    }
}