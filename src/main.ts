import { sound } from "@pixi/sound";
import { Overseer } from "./managers/overseer";

const soundsMap = {
    "fire": "sfx/fire.wav",
    "explosion": "sfx/explosion.wav",
    "hit": "sfx/hit.wav",
    "kill": "sfx/kill.wav",
    "pickup": "sfx/pickup.wav",
    "playerHurt": "sfx/playerHurt.wav",
    "click": "sfx/click.wav",
    "reload": "sfx/reload.wav"
}

sound.init();
sound.add(soundsMap, {preload: true});

const overseer = new Overseer();
overseer.beginGame();