import { allowedKeys } from "./keys.js";

// store only active keys
export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        window.addEventListener('keydown', e => {
            for (const key of allowedKeys) {
                if (e.key === key && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
            }

            if (e.key === 'd') {
                this.game.debug = !this.game.debug;
            }
        });

        window.addEventListener('keyup', e => {
            for (const key of allowedKeys) {
                if (e.key === key) {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            }
        });
    }

}