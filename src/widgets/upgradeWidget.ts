import { Text } from "pixi.js";
import { Overseer } from "../managers/overseer";
import { Widget } from "./widget";
import { WidgetButton } from "./widgetElements/button";
import { Weapon } from "../data/types";

export class UpgradeWidget extends Widget {
    goldText: Text;
    selectedWeapon: Weapon = "Pistol";

    constructor(overseer: Overseer) {
        super(overseer);

        // Gold text
        this.goldText = new Text({
            text: "",
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                fill: "#d8d8d8ff"
            },
            x: 10,
            y: 10
        });

        this.addChild(this.goldText);

        this.constructButtons();
    }

    private constructButtons() {
        for (const subWidget of this.subWidgets) {
            this.removeElement(subWidget);
        }
        
        const goldIncomeCost = 100 + (this.overseer.player.generalUpgrades.goldIncome * 125);
        this.addElement(new WidgetButton(this.overseer, 10, 40, {
            label: (this.overseer.player.generalUpgrades.goldIncome >= 5 ? "Upgrade Gold Income (5 / 5) [MAXED]" : `Upgrade Gold Income (${this.overseer.player.generalUpgrades.goldIncome} / 5) [${goldIncomeCost} gold]`),
            xSize: 350,
            ySize: 30,
            colour: "#b9b9b9ff",
            hoverColour: "#6b6b6bff",
            clickColour: "#464646ff"
        }, () => {
            if (this.overseer.player.gold >= goldIncomeCost && this.overseer.player.generalUpgrades.goldIncome < 5) {
                this.overseer.player.gold -= goldIncomeCost;
                this.overseer.player.generalUpgrades.goldIncome += 1;
                this.constructButtons();
            }
        }));

        const ammoGatheringCost = 200 + (this.overseer.player.generalUpgrades.ammoGathering * 100);
        this.addElement(new WidgetButton(this.overseer, 10, 80, {
            label: (this.overseer.player.generalUpgrades.ammoGathering >= 5 ? "Upgrade Ammo Gain (5 / 5) [MAXED]" : `Upgrade Ammo Gain (${this.overseer.player.generalUpgrades.ammoGathering} / 5) [${ammoGatheringCost} gold]`),
            xSize: 350,
            ySize: 30,
            colour: "#b9b9b9ff",
            hoverColour: "#6b6b6bff",
            clickColour: "#464646ff"
        }, () => {
            if (this.overseer.player.gold >= ammoGatheringCost && this.overseer.player.generalUpgrades.ammoGathering < 5) {
                this.overseer.player.gold -= ammoGatheringCost;
                this.overseer.player.generalUpgrades.ammoGathering += 1;
                this.constructButtons();
            }
        }));

        let weaponList: {type: Weapon, baseCost: number, level: number, damageCost: number, reloadSpeedCost: number, ammoCapacityCost: number, knockbackCost: number, capacityBoost: number}[] = [
            {type: "Pistol", baseCost: -1, level: 0, damageCost: 150, reloadSpeedCost: 100, ammoCapacityCost: 125, knockbackCost: 75, capacityBoost: 2},
            {type: "Machine Gun", baseCost: 200, level: 0, damageCost: 175, reloadSpeedCost: 125, ammoCapacityCost: 100, knockbackCost: 150, capacityBoost: 10},
            {type: "Rifle", baseCost: 225, level: 0, damageCost: 200, reloadSpeedCost: 175, ammoCapacityCost: 125, knockbackCost: 50, capacityBoost: 2},
            {type: "Shotgun", baseCost: 200, level: 0, damageCost: 175, reloadSpeedCost: 200, ammoCapacityCost: 150, knockbackCost: 150, capacityBoost: 2},
            {type: "Pulse Laser", baseCost: 300, level: 0, damageCost: 200, reloadSpeedCost: 150, ammoCapacityCost: 75, knockbackCost: 200, capacityBoost: 10},
            {type: "Rocket Launcher", baseCost: 450, level: 0, damageCost: 300, reloadSpeedCost: 250, ammoCapacityCost: 275, knockbackCost: 50, capacityBoost: 1}
        ];

        for (const cWeapon of weaponList) {
            const foundWeapon = this.overseer.player.weapons.find((weaponData) => weaponData.type == cWeapon.type)!;
            cWeapon.level = foundWeapon.upgrades.damage + foundWeapon.upgrades.ammoCapacity + foundWeapon.upgrades.knockback + foundWeapon.upgrades.reloadSpeed;

            this.addElement(new WidgetButton(this.overseer, 10 + (230 *(weaponList.indexOf(cWeapon) % 4)), 150 + (weaponList.indexOf(cWeapon) >= 4 ? 40 : 0), {
                label: (foundWeapon.unlocked ? (cWeapon.type == this.selectedWeapon ? `${cWeapon.type} [SELECTED]` : cWeapon.type) : `${cWeapon.type} [${cWeapon.baseCost} gold]`),
                xSize: 220,
                ySize: 30,
                colour: "#b9b9b9ff",
                hoverColour: "#6b6b6bff",
                clickColour: "#464646ff"
            }, () => {
                if (foundWeapon.unlocked) {
                    this.selectedWeapon = cWeapon.type;
                    this.constructButtons();
                } else if (this.overseer.player.gold >= cWeapon.baseCost) {
                    this.overseer.player.gold -= cWeapon.baseCost;
                    foundWeapon.unlocked = true;
                    this.constructButtons();
                }
            }));

            if (this.selectedWeapon == cWeapon.type) {
                const categories: string[] = ["damage", "reloadSpeed", "ammoCapacity", "knockback"];
                for (const category of categories) {
                    const conversionKeys: {key: string, value: string, cost: number, level: number}[] = [
                        {key: "damage", value: "Damage", cost: cWeapon.damageCost + (cWeapon.level * 25), level: foundWeapon.upgrades.damage},
                        {key: "reloadSpeed", value: "Reload Speed", cost: cWeapon.reloadSpeedCost + (cWeapon.level * 25), level: foundWeapon.upgrades.reloadSpeed},
                        {key: "ammoCapacity", value: "Ammo Capacity", cost: cWeapon.ammoCapacityCost + (cWeapon.level * 25), level: foundWeapon.upgrades.ammoCapacity},
                        {key: "knockback", value: "Knockback", cost: cWeapon.knockbackCost + (cWeapon.level * 25), level: foundWeapon.upgrades.knockback}
                    ]
                    
                    const translatedCategory: "damage" | "reloadSpeed" | "ammoCapacity" | "knockback" = category as "damage" | "reloadSpeed" | "ammoCapacity" | "knockback";

                    this.addElement(new WidgetButton(this.overseer, 10, 250 + (40 * categories.indexOf(category)), {
                        label: (foundWeapon.upgrades[translatedCategory] >= 5 ? `${conversionKeys.find((cKey) => cKey.key == category)!.value} (MAXED)` : `${conversionKeys.find((cKey) => cKey.key == category)!.value} (${conversionKeys.find((cKey) => cKey.key == category)!.level} / 5) [${conversionKeys.find((cKey) => cKey.key == category)!.cost} gold]`),
                        xSize: 250,
                        ySize: 30,
                        colour: "#b9b9b9ff",
                        hoverColour: "#6b6b6bff",
                        clickColour: "#464646ff"
                    }, () => {
                        if (foundWeapon.upgrades[translatedCategory] < 5 && this.overseer.player.gold >= conversionKeys.find((cKey) => cKey.key == category)!.cost) {
                            this.overseer.player.gold -= conversionKeys.find((cKey) => cKey.key == category)!.cost;
                            foundWeapon.upgrades[translatedCategory]++;

                            if (translatedCategory == "ammoCapacity") {
                                foundWeapon.ammo += cWeapon.capacityBoost;
                                foundWeapon.maxAmmo += cWeapon.capacityBoost;
                                foundWeapon.maxReserveAmmo += cWeapon.capacityBoost * 10;
                                foundWeapon.reserveAmmo += cWeapon.capacityBoost * 10;
                            }

                            this.constructButtons();
                        }
                    }));
                }

                if (this.selectedWeapon != "Pistol") {
                    this.addElement(new WidgetButton(this.overseer, 10, 440, {
                        label: (foundWeapon.reserveAmmo >= foundWeapon.maxReserveAmmo ? `Weapon Ammo: ${foundWeapon.reserveAmmo} / ${foundWeapon.maxReserveAmmo}` : `Weapon Ammo: ${foundWeapon.reserveAmmo} / ${foundWeapon.maxReserveAmmo} [Reload 10%: 25 gold]`),
                        xSize: 500,
                        ySize: 30,
                        colour: "#b9b9b9ff",
                        hoverColour: "#6b6b6bff",
                        clickColour: "#464646ff"
                    }, () => {
                        if (this.overseer.player.gold >= 25 && foundWeapon.reserveAmmo < foundWeapon.maxReserveAmmo) {
                            foundWeapon.reserveAmmo = Math.min(foundWeapon.maxReserveAmmo, foundWeapon.reserveAmmo + Math.ceil(foundWeapon.maxReserveAmmo * 0.1));
                            this.overseer.player.gold -= 25;
                            this.constructButtons();
                        }
                    }));
                }
            }
        }
    }

    update(delta: number) {
        super.update(delta);
        this.goldText.text = `Gold: ${this.overseer.player.gold}`;
    }
}