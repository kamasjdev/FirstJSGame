import { allowedKeys } from "./keys.js";

// store only active keys
export class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener('keydown', e => {
            for (const key of allowedKeys) {
                if (e.key === key && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
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